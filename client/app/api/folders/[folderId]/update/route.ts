// app/api/folders/[folderId]/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

/* ============================
   Types & Validation Schemas
   ============================ */

/**
 * Body payload schema for PATCH /api/folders/:folderId
 * - All fields optional (partial update).
 * - metadata is a free object but we restrict to record<string, unknown>
 */
const PatchFolderBodySchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  parentFolderId: z.string().nullable().optional(), // null => remove Parent
  metadata: z.record(z.string(), z.unknown()).optional(),
  color: z.string().max(50).optional(), // optional, matches Folder model color
});

/**
 * Path params schema
 */
const ParamsSchema = z.object({
  folderId: z.string().min(1),
});

/**
 * Response envelope types
 */
type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
};

type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
};

/* ============================
   Helper / Utility functions
   ============================ */

/**
 * Standardized JSON error response
 */
function jsonError(
  code: string,
  message: string,
  status = 500,
  details?: unknown
) {
  const payload: ApiError = {
    success: false,
    error: { code, message, details },
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(payload, { status });
}

/**
 * Standardized JSON success response
 */
function jsonSuccess<T>(data: T, message = "OK") {
  const payload: ApiSuccess<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(payload, { status: 200 });
}

/**
 * Simple role check: user must be OWNER or EDITOR to update folder
 * Adjust field names to match your ProjectMember model if required.
 */
const ALLOWED_MEMBER_ROLES = ["OWNER", "EDITOR"];

/**
 * Validates that moving folder to newParentId will not create a circular chain.
 * Walks up parent chain until root or max depth reached.
 */
async function assertNoCircularParent(
  folderId: string,
  newParentId: string | null
) {
  if (!newParentId) return; // removing parent -> OK

  if (newParentId === folderId) {
    throw new Error("parentSameAsFolder");
  }

  // Walk up the parent chain starting from newParentId.
  // To prevent infinite loops in corrupted DB, limit the iterations.
  const MAX_DEPTH = 100;
  let currentId: string | null = newParentId;
  for (let i = 0; i < MAX_DEPTH; i++) {
    if (!currentId) return;
    if (currentId === folderId) {
      // circular reference found
      throw new Error("circularParentReference");
    }
    const current: { parentFolderId: string | null } | null =
      await prisma.folder.findUnique({
        where: { id: currentId },
        select: { parentFolderId: true },
      });

    if (!current) return; // parent chain broken (parent not found) -> will be validated elsewhere
    currentId = current.parentFolderId ?? null;
  }
  // if loop completes, assume potential corruption; reject
  throw new Error("parentHierarchyTooDeep");
}

/* ============================
   Main PATCH Handler
   ============================ */

export async function PATCH(
  req: Request,
  { params }: { params: { folderId?: string } }
) {
  try {
    // 1) Validate path param
    const parseParams = ParamsSchema.safeParse({ folderId: params?.folderId });
    if (!parseParams.success) {
      return jsonError(
        "invalid_path_params",
        "Invalid or missing folderId path parameter",
        400,
        parseParams.error.format()
      );
    }
    const folderId = parseParams.data.folderId;

    // 2) Authenticate user via Clerk
    const clerkAuth = await currentUser();
    if (!clerkAuth) {
      return jsonError("unauthenticated", "Authentication required", 401);
    }
    const clerkId = clerkAuth.id;
    // const clerkId = "user_31TGF6kLrmgc5ZuCxiAp8ywbUbU";

    // 3) Parse JSON body & validate
    let rawBody: any;
    try {
      rawBody = await req.json();
    } catch (err) {
      return jsonError("invalid_json", "Request body must be valid JSON", 400);
    }

    const bodyParse = PatchFolderBodySchema.safeParse(rawBody);
    if (!bodyParse.success) {
      return jsonError(
        "invalid_body",
        "Request body validation failed",
        400,
        bodyParse.error.format()
      );
    }
    const body = bodyParse.data;

    // 4) Fetch authenticated user record mapped from Clerk id
    // Assumption: you maintain a User model with a clerkId field
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });
    if (!user) {
      return jsonError(
        "user_not_found",
        "Authenticated user record not found in DB",
        401
      );
    }

    // 5) Fetch folder and ensure existence + minimal relations
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        project: { select: { id: true } },
        creator: { select: { id: true } },
      },
    });
    if (!folder) {
      return jsonError("folder_not_found", "Folder not found", 404);
    }

    // 6) Authorization: check project membership and role
    // Assumption: ProjectMember model has fields { id, userId, projectId, role }
    const membership = await prisma.projectMember.findFirst({
      where: {
        projectId: folder.projectId,
        userId: user.id,
      },
      select: { role: true },
    });

    if (!membership || !ALLOWED_MEMBER_ROLES.includes(membership.role)) {
      return jsonError(
        "forbidden",
        "User does not have permission to update folder",
        403,
        { requiredRoles: ALLOWED_MEMBER_ROLES }
      );
    }

    // 7) If parentFolderId provided, validate it belongs to the same project and exists (or is null)
    if (Object.prototype.hasOwnProperty.call(body, "parentFolderId")) {
      const parentFolderId = body.parentFolderId ?? null; // explicit null is allowed (detach)
      if (parentFolderId !== null) {
        // must exist and belong to same project
        const parent = await prisma.folder.findUnique({
          where: { id: parentFolderId },
          select: { id: true, projectId: true },
        });
        if (!parent) {
          return jsonError(
            "parent_not_found",
            "Provided parentFolderId does not exist",
            400
          );
        }
        if (parent.projectId !== folder.projectId) {
          return jsonError(
            "parent_different_project",
            "parentFolderId belongs to a different project",
            400
          );
        }

        // 8) Circular parent check
        try {
          await assertNoCircularParent(folderId, parentFolderId);
        } catch (err: any) {
          if (
            err.message === "parentSameAsFolder" ||
            err.message === "circularParentReference"
          ) {
            return jsonError(
              "circular_hierarchy",
              "Setting this parentFolderId would create a circular folder hierarchy",
              400
            );
          }
          if (err.message === "parentHierarchyTooDeep") {
            return jsonError(
              "invalid_hierarchy",
              "Folder hierarchy appears malformed (too deep)",
              400
            );
          }
          // pass through other errors
          throw err;
        }
      }
    }

    // 9) Build selective update object - only send fields that are present in the request
    const dataToUpdate: Record<string, any> = {};
    if (body.name !== undefined) dataToUpdate.name = body.name.trim();
    if (body.description !== undefined)
      dataToUpdate.description = body.description;
    if (body.color !== undefined) dataToUpdate.color = body.color;
    if (Object.prototype.hasOwnProperty.call(body, "parentFolderId")) {
      dataToUpdate.parentFolderId = body.parentFolderId ?? null;
    }
    if (body.metadata !== undefined) {
      // Merge semantics: we'll replace metadata field with provided object.
      // If you want merge/patch behavior, change accordingly (read existing metadata then merge).
      dataToUpdate.metadata = body.metadata;
    }
    if (Object.keys(dataToUpdate).length === 0) {
      return jsonError(
        "nothing_to_update",
        "No valid update fields provided",
        400
      );
    }

    // 10) Perform the update
    // Use transaction if you plan to do multi-step updates later. Here it's single write.
    const updatedFolder = await prisma.folder.update({
      where: { id: folderId },
      data: {
        ...dataToUpdate,
      },
      include: {
        creator: { select: { id: true, displayName: true } },
        project: { select: { id: true, name: true } },
      },
    });

    // 11) Format response according to your Response Structure
    const responsePayload = {
      id: updatedFolder.id,
      name: updatedFolder.name,
      projectId: updatedFolder.projectId,
      parentFolderId: updatedFolder.parentFolderId ?? null,
      description: updatedFolder.description ?? null,
      metadata: (updatedFolder as any).metadata ?? null,
      color: updatedFolder.color ?? null,
      createdBy: {
        id: updatedFolder.creator?.id ?? null,
        name: updatedFolder.creator?.displayName ?? null,
      },
      createdAt: updatedFolder.createdAt,
      updatedAt: updatedFolder.updatedAt,
    };

    return jsonSuccess(responsePayload, "Folder updated successfully");
  } catch (err: any) {
    // Unhandled errors -> map to 500, but try to surface helpful info for common cases
    // (avoid leaking sensitive internal details)
    console.error("PATCH /api/folders/:folderId error:", err);

    // Common Prisma errors can be handled specifically (example)
    if (err?.code === "P2025") {
      // Record to update not found
      return jsonError(
        "not_found",
        "Folder not found (concurrent delete?)",
        404
      );
    }

    return jsonError(
      "internal_error",
      "An unexpected error occurred while updating the folder",
      500
    );
  }
}
