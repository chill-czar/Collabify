// app/api/folders/[folderId]/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import z from "zod";
import { deleteS3KeysRecursive } from "@/lib/s3";
import { JsonValue } from "@prisma/client/runtime/library";
import { logger } from "@/lib/logger";

/**
 * Types / validation
 */
const ParamsSchema = z.object({
  folderId: z
    .string()
    .min(1)
    // assume Mongo ObjectId (24 hex chars). Adjust if your IDs differ.
    .regex(/^[a-fA-F0-9]{24}$/, "folderId must be a valid ObjectId"),
});

/**
 * ApiError for centralized error handling
 */
class ApiError extends Error {
  status: number;
  details?: any;
  constructor(message: string, status = 500, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/**
 * Helper: extract S3 key from a typical S3 URL.
 * Modify this if you store different URL formats (cloudfront, custom domain).
 */
function extractS3KeyFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    // If URL host is like s3.amazonaws.com or bucket.s3.amazonaws.com -> key is pathname
    // If using CloudFront/custom domain, you may need to map differently.
    return u.pathname.replace(/^\/+/, ""); // remove leading slash
  } catch (err) {
    logger.warn("Failed to extract S3 key from URL", { url, error: err });
    return null;
  }
}

/**
 * Recursively collect folder IDs (BFS) for deletion.
 */
async function collectFolderTreeIds(rootFolderId: string) {
  logger.info("Starting folder tree collection", { rootFolderId });

  const all: string[] = [rootFolderId];
  const queue = [rootFolderId];

  while (queue.length) {
    const batch = queue.splice(0, 50); // avoid huge query in single shot
    const children = await prisma.folder.findMany({
      where: { parentFolderId: { in: batch } },
      select: { id: true },
    });
    const childIds = children.map((c: any) => c.id);
    if (childIds.length) {
      all.push(...childIds);
      queue.push(...childIds);
    }
  }

  logger.info("Folder tree collection completed", {
    rootFolderId,
    totalFoldersFound: all.length,
  });

  return all;
}

/**
 * Main DELETE handler
 */
export async function DELETE(
  req: Request,
  { params }: { params: { folderId: string } }
) {
  const startTime = Date.now();
  logger.info("DELETE folder request started", {
    folderId: params?.folderId,
    method: req.method,
    url: req.url,
  });

  try {
    // --- validate inputs
    const validatedParams = ParamsSchema.parse(params);

    const folderId = validatedParams.folderId;
    const force = true;

    logger.info("Request validation successful", { folderId, force });

    // --- authenticate
    const clerkUser = await currentUser();
    if (!clerkUser) {
      logger.warn("Authentication failed - no user found", { folderId });
      throw new ApiError("Not authenticated", 401);
    }
    const clerkUserId = clerkUser.id;
    // const clerkUserId = "user_31TGF6kLrmgc5ZuCxiAp8ywbUbU";

    logger.info("User authenticated", { clerkUserId, folderId });

    // --- map Clerk user to DB user
    const requestingUser = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      select: { id: true }, // include role/permissions if you keep them
    });

    if (!requestingUser) {
      logger.error("User not found in database", { clerkUserId, folderId });
      throw new ApiError("User not found in DB", 401);
    }

    logger.info("Database user found", {
      userId: requestingUser.id,
      clerkUserId,
      folderId,
    });

    // --- fetch folder
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      select: {
        id: true,
        name: true,
        createdBy: true,
        projectId: true,
        parentFolderId: true,
      },
    });

    if (!folder) {
      logger.warn("Folder not found", { folderId, userId: requestingUser.id });
      throw new ApiError("Folder not found", 404);
    }

    logger.info("Folder found", {
      folderId,
      folderName: folder.name,
      projectId: folder.projectId,
      createdBy: folder.createdBy,
      userId: requestingUser.id,
    });

    // --- authorization: must be project creator OR folder.creator OR have project delete permission
    // We'll check project and possible membership role.
    const project = await prisma.project.findUnique({
      where: { id: folder.projectId },
      select: { id: true, createdBy: true },
    });
    if (!project) {
      logger.error("Parent project not found", {
        projectId: folder.projectId,
        folderId,
        userId: requestingUser.id,
      });
      throw new ApiError("Parent project not found", 404);
    }

    const isProjectOwner = project.createdBy === requestingUser.id;
    const isFolderCreator = folder.createdBy === requestingUser.id;

    logger.info("Authorization check - ownership status", {
      folderId,
      userId: requestingUser.id,
      isProjectOwner,
      isFolderCreator,
      projectId: project.id,
    });

    // Try to resolve role/permissions via ProjectMember if you have it
    const membership = await prisma.projectMember
      .findUnique({
        where: {
          projectId_userId: {
            projectId: project.id,
            userId: requestingUser.id,
          },
        } as any,
        select: { role: true, permissions: true },
      })
      .catch(() => null);

    function isStringArray(value: JsonValue): value is string[] {
      return Array.isArray(value) && value.every((v) => typeof v === "string");
    }

    const hasDeletePerm =
      isProjectOwner ||
      isFolderCreator ||
      (membership &&
        (membership.role === "ADMIN" ||
          (isStringArray(membership.permissions) &&
            membership.permissions.includes("folders:delete"))));

    if (!hasDeletePerm) {
      logger.warn("Authorization failed - insufficient permissions", {
        folderId,
        userId: requestingUser.id,
        isProjectOwner,
        isFolderCreator,
        membershipRole: membership?.role,
        membershipPermissions: membership?.permissions,
      });
      throw new ApiError("Forbidden: insufficient permissions", 403);
    }

    logger.info("Authorization successful", {
      folderId,
      userId: requestingUser.id,
      hasDeletePerm,
      membershipRole: membership?.role,
    });

    // --- collect folder tree
    const folderIds = await collectFolderTreeIds(folderId);

    // --- fetch files in all these folders
    const files = await prisma.file.findMany({
      where: { folderId: { in: folderIds } },
      select: { id: true, fileUrl: true, fileName: true },
    });

    logger.info("Files and folders analysis", {
      folderId,
      totalFoldersToDelete: folderIds.length,
      totalFilesToDelete: files.length,
      force,
    });

    if (!force && (files.length > 0 || folderIds.length > 1)) {
      // If folder has children (folderIds length > 1) or files and force not set, block deletion.
      logger.warn("Deletion blocked - folder not empty and force not set", {
        folderId,
        filesCount: files.length,
        subfoldersCount: folderIds.length - 1,
        force,
      });
      throw new ApiError(
        "Folder is not empty. Use ?force=true to delete folder and all its contents.",
        400,
        { filesCount: files.length, subfoldersCount: folderIds.length - 1 }
      );
    }

    // --- collect S3 keys
    const s3Keys: string[] = [];
    for (const f of files) {
      const key = extractS3KeyFromUrl(f.fileUrl);
      if (key) s3Keys.push(key);
    }

    logger.info("S3 keys collected for deletion", {
      folderId,
      totalS3Keys: s3Keys.length,
      s3Keys:
        s3Keys.length <= 10
          ? s3Keys
          : `${s3Keys.slice(0, 10).join(", ")}... (+${
              s3Keys.length - 10
            } more)`,
    });

    // Also optionally remove folder metadata files (like thumbnails) placed under folder path:
    // If your app stores thumbnails or folder-level objects, add them here using folder.projectId/folderId path pattern
    // Example of folder metadata key prefix:
    // projects/{projectId}/folders/{folderId}/...
    // For now we only delete file keys found on File.fileUrl.

    // --- S3: delete objects first
    let totalDeletedFromS3 = 0;
    if (s3Keys.length) {
      logger.info("Starting S3 deletion", {
        folderId,
        s3KeysCount: s3Keys.length,
      });

      // attempt one try; you can wrap in an exponential retry outside or here.
      const { totalDeleted, errors } = await deleteS3KeysRecursive(s3Keys);
      totalDeletedFromS3 = totalDeleted;

      logger.info("S3 deletion completed", {
        folderId,
        totalDeleted,
        requestedCount: s3Keys.length,
        hasErrors: !!(errors && errors.length),
      });

      if (errors && errors.length) {
        // Rollback policy: do NOT delete DB if S3 errors occurred (per spec).
        logger.error("S3 deletion failed - aborting DB deletion", {
          folderId,
          errors,
          totalDeleted,
          totalRequested: s3Keys.length,
        });
        throw new ApiError("Failed to delete some S3 objects", 500, { errors });
      }
    }

    // --- DB deletion: delete files & folders in transaction
    // Prisma + Mongo: $transaction works for deleteMany; if it throws, fallback to sequential deletes.
    logger.info("Starting database deletion", {
      folderId,
      folderIdsToDelete: folderIds.length,
      filesToDelete: files.length,
    });

    try {
      // Delete files metadata
      const deleteFiles = prisma.file.deleteMany({
        where: { folderId: { in: folderIds } },
      });

      // Delete nested folders (excluding root) and then root folder or deleteMany by id in folderIds
      const deleteFolders = prisma.folder.deleteMany({
        where: { id: { in: folderIds } },
      });

      await prisma.$transaction([deleteFiles, deleteFolders]);

      logger.info("Database deletion successful via transaction", {
        folderId,
        deletedFolders: folderIds.length,
        deletedFiles: files.length,
      });
    } catch (txErr) {
      logger.warn("Transaction failed, attempting sequential deletion", {
        folderId,
        transactionError: txErr,
      });

      // Attempt sequential fallback (best-effort) and then throw if failure
      try {
        await prisma.file.deleteMany({
          where: { folderId: { in: folderIds } },
        });
        await prisma.folder.deleteMany({ where: { id: { in: folderIds } } });

        logger.info("Database deletion successful via sequential fallback", {
          folderId,
          deletedFolders: folderIds.length,
          deletedFiles: files.length,
        });
      } catch (fallbackErr) {
        // At this stage S3 already deleted. This is a serious state; log and alert.
        logger.error(
          "CRITICAL: Failed to delete DB records after S3 deletion - data inconsistency",
          {
            folderId,
            s3DeletedCount: totalDeletedFromS3,
            transactionError: txErr,
            fallbackError: fallbackErr,
          }
        );
        throw new ApiError(
          "Failed to delete DB records after S3 deletion",
          500,
          {
            txErr,
            fallbackErr,
          }
        );
      }
    }

    // --- Prepare response
    const responsePayload = {
      success: true,
      message: "Folder deleted successfully",
      data: {
        folderId,
        deletedFilesCount: s3Keys.length,
        deletedSubfoldersCount: folderIds.length - 1,
        s3DeletedObjectsCount: totalDeletedFromS3,
      },
      timestamp: new Date().toISOString(),
    };

    const duration = Date.now() - startTime;
    logger.info("DELETE folder request completed successfully", {
      folderId,
      duration,
      deletedFilesCount: s3Keys.length,
      deletedSubfoldersCount: folderIds.length - 1,
      s3DeletedObjectsCount: totalDeletedFromS3,
    });

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (err) {
    const duration = Date.now() - startTime;

    // centralized error formatting
    if (err instanceof ApiError) {
      logger.error("API Error occurred", {
        folderId: params?.folderId,
        duration,
        status: err.status,
        message: err.message,
        details: err.details,
      });

      return NextResponse.json(
        {
          success: false,
          error: err.message,
          details: err.details ?? null,
        },
        { status: err.status }
      );
    }

    // zod errors
    // @ts-ignore
    if (err?.issues) {
      logger.error("Validation error", {
        folderId: params?.folderId,
        duration,
        validationIssues: err,
      });

      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: err,
        },
        { status: 400 }
      );
    }

    logger.error("Unhandled error in DELETE folder", {
      folderId: params?.folderId,
      duration,
      error: err,
      stack: err instanceof Error ? err.stack : undefined,
    });

    console.error("Unhandled error in DELETE /api/folders/:folderId", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
