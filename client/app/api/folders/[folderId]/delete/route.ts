// app/api/folders/[folderId]/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import  prisma  from "@/lib/prisma";
import z from "zod";
import { deleteS3KeysRecursive } from "@/lib/s3";
import { JsonValue } from "@prisma/client/runtime/library";
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

const QuerySchema = z.object({
  force: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined) return false;
      return val === "true" || val === "1" || val === "yes";
    })
    .or(z.boolean().optional())
    .default(false),
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
    return null;
  }
}

/**
 * Recursively collect folder IDs (BFS) for deletion.
 */
async function collectFolderTreeIds(rootFolderId: string) {
  const all: string[] = [rootFolderId];
  const queue = [rootFolderId];

  while (queue.length) {
    const batch = queue.splice(0, 50); // avoid huge query in single shot
    const children = await prisma.folder.findMany({
      where: { parentFolderId: { in: batch } },
      select: { id: true },
    });
    const childIds = children.map((c) => c.id);
    if (childIds.length) {
      all.push(...childIds);
      queue.push(...childIds);
    }
  }

  return all;
}

/**
 * Main DELETE handler
 */
export async function DELETE(
  req: Request,
  { params }: { params: { folderId: string } }
) {
  try {
    // --- validate inputs
    const validatedParams = ParamsSchema.parse(params);
    const url = new URL(req.url);
    const parsedQuery = QuerySchema.parse({
      force: url.searchParams.get("force") ?? undefined,
    });

    const folderId = validatedParams.folderId;
    const force = parsedQuery.force as boolean;

    // --- authenticate
    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new ApiError("Not authenticated", 401);
    }
    const clerkUserId = clerkUser.id;
    // const clerkUserId = "user_31TGF6kLrmgc5ZuCxiAp8ywbUbU";

    // --- map Clerk user to DB user
    const requestingUser = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      select: { id: true }, // include role/permissions if you keep them
    });

    if (!requestingUser) throw new ApiError("User not found in DB", 401);

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

    if (!folder) throw new ApiError("Folder not found", 404);

    // --- authorization: must be project creator OR folder.creator OR have project delete permission
    // We'll check project and possible membership role.
    const project = await prisma.project.findUnique({
      where: { id: folder.projectId },
      select: { id: true, createdBy: true },
    });
    if (!project) throw new ApiError("Parent project not found", 404);

    const isProjectOwner = project.createdBy === requestingUser.id;
    const isFolderCreator = folder.createdBy === requestingUser.id;

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

    if (!hasDeletePerm)
      throw new ApiError("Forbidden: insufficient permissions", 403);

    // --- collect folder tree
    const folderIds = await collectFolderTreeIds(folderId);

    // --- fetch files in all these folders
    const files = await prisma.file.findMany({
      where: { folderId: { in: folderIds } },
      select: { id: true, fileUrl: true, fileName: true },
    });

    if (!force && (files.length > 0 || folderIds.length > 1)) {
      // If folder has children (folderIds length > 1) or files and force not set, block deletion.
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

    // Also optionally remove folder metadata files (like thumbnails) placed under folder path:
    // If your app stores thumbnails or folder-level objects, add them here using folder.projectId/folderId path pattern
    // Example of folder metadata key prefix:
    // projects/{projectId}/folders/{folderId}/...
    // For now we only delete file keys found on File.fileUrl.

    // --- S3: delete objects first
    let totalDeletedFromS3 = 0;
    if (s3Keys.length) {
      // attempt one try; you can wrap in an exponential retry outside or here.
      const { totalDeleted, errors } = await deleteS3KeysRecursive(s3Keys);
      totalDeletedFromS3 = totalDeleted;
      if (errors && errors.length) {
        // Rollback policy: do NOT delete DB if S3 errors occurred (per spec).
        throw new ApiError("Failed to delete some S3 objects", 500, { errors });
      }
    }

    // --- DB deletion: delete files & folders in transaction
    // Prisma + Mongo: $transaction works for deleteMany; if it throws, fallback to sequential deletes.
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
    } catch (txErr) {
      // Attempt sequential fallback (best-effort) and then throw if failure
      try {
        await prisma.file.deleteMany({
          where: { folderId: { in: folderIds } },
        });
        await prisma.folder.deleteMany({ where: { id: { in: folderIds } } });
      } catch (fallbackErr) {
        // At this stage S3 already deleted. This is a serious state; log and alert.
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

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (err) {
    // centralized error formatting
    if (err instanceof ApiError) {
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
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: err
        },
        { status: 400 }
      );
    }

    console.error("Unhandled error in DELETE /api/folders/:folderId", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
