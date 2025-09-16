import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";



/**
 * PATCH /api/files/:fileId
 *
 * Updates file metadata (fileName, description, folderId, visibility, tags, isStarred)
 *
 * Requirements implemented:
 * - Authentication: Clerk currentUser() required
 * - Authorization: uploader or ProjectMember required
 * - Validation: zod schemas for path and body
 * - Only update changed fields
 * - FolderId must exist and belong to same project
 * - Proper status codes and structured responses
 * - Transactional update to ensure consistency
 */

/* -----------------------------
   Types & Validation Schemas
   ----------------------------- */

// Path params
const pathParamsSchema = z.object({
  fileId: z.string().min(1, "fileId is required"),
});

// Visibility enum must match Prisma enum FileVisibility
const visibilityEnum = z.enum([
  "PUBLIC",
  "PROJECT_MEMBERS",
  "SPECIFIC_USERS",
  "PRIVATE",
]);

// Request body schema (all optional; partial update)
const patchBodySchema = z
  .object({
    fileName: z
      .string()
      .min(1, "fileName cannot be empty")
      .max(260, "fileName too long")
      .optional(),
    description: z.string().max(10_000).optional().nullable(),
    folderId: z.string().min(1).optional().nullable(),
    visibility: visibilityEnum.optional(),
    tags: z.array(z.string().min(1).max(120)).optional(),
    isStarred: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update",
    path: [],
  });

// TypeScript-friendly types
type PatchBody = z.infer<typeof patchBodySchema>;

/* -----------------------------
   Utility helpers
   ----------------------------- */

/**
 * Build a minimal structured API response
 */
const successResponse = (data: any, message = "Success") =>
  NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );

const errorResponse = (status: number, message: string, details?: any) =>
  NextResponse.json(
    {
      success: false,
      error: { message, details },
      timestamp: new Date().toISOString(),
    },
    { status }
  );

/**
 * Simple helper: check if userId is uploader or project member with edit permission.
 * Assumes ProjectMember.role/permissions semantics exist — adapt as needed.
 */
async function checkAuthorization({
  userId,
  file,
}: {
  userId: string;
  file: Prisma.FileGetPayload<{
    select: { projectId: true; uploadedBy: true };
  }>;
}) {
  // If uploader, allow
  if (file.uploadedBy === userId) return { allowed: true, reason: "uploader" };

  // else check project membership
  const membership = await prisma.projectMember.findFirst({
    where: {
      projectId: file.projectId,
      userId,
    },
    select: {
      id: true,
      role: true,
      permissions: true,
    },
  });

  if (!membership) return { allowed: false, reason: "not_project_member" };

  // Simple permission logic: either role === 'owner' | 'admin', or permissions contain EDIT/ADMIN
  // Adjust according to your permissions schema shape.
  const roleAllowed =
    membership.role && ["owner", "admin"].includes(membership.role);
  const permissionsJson = membership.permissions ?? null;
  const hasEditPermission =
    typeof permissionsJson === "object" &&
    ((permissionsJson as any).canEdit === true ||
      (permissionsJson as any).edit === true);

  if (roleAllowed || hasEditPermission)
    return { allowed: true, reason: "project_member_with_permissions" };

  return { allowed: false, reason: "insufficient_permissions" };
}

/* -----------------------------
   PATCH Handler
   ----------------------------- */

export async function PATCH(
  request: NextRequest,
  { params }: { params: Record<string, string | undefined> }
) {
  // Basic try/catch for overall
  try {
    // Validate path param
    const parsedPath = pathParamsSchema.safeParse({
      fileId: String(params?.fileId ?? ""),
    });
    if (!parsedPath.success) {
      return errorResponse(400, "Invalid fileId", parsedPath.error.format());
    }
    const { fileId } = parsedPath.data;

    // Auth: Clerk currentUser
    const clerkUser = await currentUser();
    if (!clerkUser || !clerkUser.id) {
      return errorResponse(401, "Unauthorized: user not authenticated");
    }
    const clerkId = clerkUser.id;

    // Map clerkId -> User.id in our DB
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });
    if (!user) {
      return errorResponse(401, "Unauthorized: user record not found");
    }
    const userId = user.id;

    // Parse + validate body
    const bodyJson = await request.json().catch(() => null);
    if (!bodyJson) {
      return errorResponse(400, "Invalid JSON body");
    }
    const parsedBody = patchBodySchema.safeParse(bodyJson);
    if (!parsedBody.success) {
      return errorResponse(
        400,
        "Invalid request body",
        parsedBody.error.format()
      );
    }
    const body = parsedBody.data as PatchBody;

    // Fetch file and basic relations
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      select: {
        id: true,
        fileName: true,
        description: true,
        folderId: true,
        visibility: true,
        tags: true,
        isStarred: true,
        projectId: true,
        uploadedBy: true,
      },
    });

    if (!file) {
      return errorResponse(404, "File not found");
    }

    // Authorization: uploader or authorized project member
    const authCheck = await checkAuthorization({ userId, file });
    if (!authCheck.allowed) {
      // For security don't reveal too much; but return reason for logs
      console.warn(
        `Authorization failed for user ${userId} on file ${fileId}: ${authCheck.reason}`
      );
      return errorResponse(
        403,
        "Forbidden: you don't have permission to update this file"
      );
    }

    // If folderId is provided, verify folder exists and belongs to same project
    if (body.folderId !== undefined && body.folderId !== null) {
      // optional: empty string treated as null
      const folder = await prisma.folder.findUnique({
        where: { id: body.folderId },
        select: { id: true, projectId: true },
      });
      if (!folder) {
        return errorResponse(404, "Target folder not found");
      }
      if (folder.projectId !== file.projectId) {
        return errorResponse(
          403,
          "Target folder belongs to a different project"
        );
      }
    }

    // Input sanitization examples (fileName: remove dangerous characters)
    // This is conservative — you can extend with your own sanitizer library
    const sanitizeFileName = (name: string) =>
      name
        .replace(/\u0000/g, "")
        .trim()
        .slice(0, 260);

    // Compute update object: only include changed fields
    // Build update object: only include changed fields
    const updateData: Prisma.FileUpdateInput = {};

    if (body.fileName !== undefined && body.fileName !== null) {
      const sanitized = sanitizeFileName(body.fileName);
      if (sanitized !== file.fileName) updateData.fileName = sanitized;
    }

    if (Object.prototype.hasOwnProperty.call(body, "description")) {
      const desc =
        body.description === null ? null : String(body.description).trim();
      if (desc !== file.description) updateData.description = desc;
    }

    if (body.folderId !== undefined) {
      // allow null (move out of folder)
      updateData.folder = body.folderId
        ? { connect: { id: body.folderId } }
        : { disconnect: true };
    }

    if (body.visibility !== undefined && body.visibility !== file.visibility) {
      updateData.visibility = body.visibility;
    }

    if (body.tags !== undefined) {
      const normalizedTags = Array.from(
        new Set(body.tags.map((t) => t.trim()).filter(Boolean))
      );
      const existingTags = file.tags ?? [];

      const tagsChanged =
        normalizedTags.length !== existingTags.length ||
        normalizedTags.some((t) => !existingTags.includes(t));

      if (tagsChanged) {
        updateData.tags = { set: normalizedTags };
      }
    }

    if (body.isStarred !== undefined && body.isStarred !== file.isStarred) {
      updateData.isStarred = body.isStarred;
    }

    // If no changes detected → return 200 with original file
    if (Object.keys(updateData).length === 0) {
      // Return the file resource in the success shape
      return successResponse(
        {
          file: {
            id: file.id,
            fileName: file.fileName,
            description: file.description,
            folderId: file.folderId,
            visibility: file.visibility,
            tags: file.tags,
            isStarred: file.isStarred,
            updatedAt: new Date().toISOString(), // pragmatic
            updatedBy: userId,
          },
        },
        "No changes needed"
      );
    }

    // Transaction: update and optionally log audit record (commented placeholder)
    const updatedFile = await prisma.$transaction(async (tx) => {
      const result = await tx.file.update({
        where: { id: fileId },
        data: updateData,
        select: {
          id: true,
          fileName: true,
          description: true,
          folderId: true,
          visibility: true,
          tags: true,
          isStarred: true,
          updatedAt: true,
        },
      });

      // Optional: create audit log if you have an audits table
      // await tx.fileAudit.create({ data: { fileId, changedBy: userId, changes: JSON.stringify(updateData) } });

      return result;
    });

    // Structured log for observability
    console.info(`File ${fileId} updated by user ${userId}`, {
      fileId,
      updatedBy: userId,
      changes: updateData,
    });

    // Build response contract
    const responsePayload = {
      file: {
        id: updatedFile.id,
        fileName: updatedFile.fileName,
        description: updatedFile.description,
        folderId: updatedFile.folderId,
        visibility: updatedFile.visibility,
        tags: updatedFile.tags,
        isStarred: updatedFile.isStarred,
        updatedAt: updatedFile.updatedAt,
        updatedBy: userId,
      },
    };

    return NextResponse.json(
      {
        success: true,
        data: responsePayload,
        message: "File updated successfully",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err: any) {
    // Centralized error handling
    console.error("PATCH /api/files/:fileId error:", err);

    // Prisma known errors handling (basic)
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // e.g., foreign key constraint, invalid input
      return errorResponse(400, "Database error", {
        code: err.code,
        meta: err.meta,
      });
    }

    return errorResponse(500, "Internal Server Error", {
      message: err?.message ?? String(err),
    });
  }
}
