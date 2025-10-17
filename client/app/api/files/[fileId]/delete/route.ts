/**
 * DELETE /api/files/:fileId
 *
 * Responsibilities:
 *  - Authenticate via Clerk (currentUser)
 *  - Authorize: allow uploader OR project admin/member with delete permission
 *  - Validate fileId (MongoDB ObjectId / 24-hex)
 *  - Delete object from S3 (idempotent, retry on transient errors)
 *  - Delete DB records (File, FileAccess, FileShareLink, cascade)
 *  - Provide consistent responses and HTTP status codes
 *
 * Important considerations:
 *  - This implementation permanently removes the S3 object before DB deletion.
 *    If you prefer safe/undo-able behavior, use a soft-delete (mark status=DELETED)
 *    instead of hard deleting. See comments below about compensating actions.
 *
 * Adjust imports to match your project structure.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server"; // provided snippet used currentUser()
import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import prisma from "@/lib/prisma";

//
// ---------- Configuration / Clients (adjust paths/vars as needed) ----------
//



// S3 client config from env
const S3_BUCKET = process.env.AWS_S3_BUCKET_NAME!;
const S3_REGION = process.env.AWS_REGION!;
if (!S3_BUCKET || !S3_REGION) {
  // Don't throw here in runtime; just warn - requests will fail with 5xx later.
  console.warn(
    "S3_BUCKET or S3_REGION not configured - S3 deletion will fail."
  );
}

/**
 * ----- Types -----
 */

type ApiSuccess = {
  success: true;
  message: string;
  timestamp: string;
};

type ApiError = {
  success: false;
  error: string;
  details?: any;
  timestamp: string;
};

/**
 * ----- Helpers -----
 */

/** Validate a MongoDB ObjectId (24 hex chars). Adjust if you use a different ID format. */
function isValidObjectId(id: string) {
  return typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
}

/** Standard error response helper */
function errorResponse(status: number, message: string, details?: any) {
  const payload: ApiError = {
    success: false,
    error: message,
    details,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(payload, { status });
}

/** Success response helper */
function successResponse(message: string) {
  const payload: ApiSuccess = {
    success: true,
    message,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(payload, { status: 200 });
}

/**
 * Attempt to delete an object from S3.
 * - idempotent: if object is missing, treat as success (log it)
 * - will retry once on transient errors
 */
async function deleteFromS3(s3Key: string) {
  if (!s3Key) {
    throw new Error("Missing s3Key for file");
  }

  const params = {
    Bucket: S3_BUCKET,
    Key: s3Key,
  };

  try {
    const cmd = new DeleteObjectCommand(params);
    const resp: DeleteObjectCommandOutput = await s3.send(cmd);
    // AWS returns 204/200-ish responses; successful deletion does not necessarily have a body.
    return { ok: true, resp };
  } catch (err: any) {
    // If the object doesn't exist we treat it as success (idempotency).
    // AWS SDK v3 doesn't throw a typed NoSuchKey easily; the service returns 204 or a NotFound code.
    const message = err?.message || String(err);
    // Basic heuristic: if error string contains "NotFound" or "NoSuchKey", treat as ok
    if (/NoSuchKey|NotFound|404/i.test(message)) {
      console.warn(
        `S3 object not found for key=${s3Key}. Proceeding with DB cleanup.`
      );
      return { ok: true, resp: null, warning: "object-not-found" };
    }

    // Retry once on transient errors
    console.warn(
      `S3 delete failed for key=${s3Key}. Retrying once. Error: ${message}`
    );
    try {
      const cmd2 = new DeleteObjectCommand(params);
      const resp2 = await s3.send(cmd2);
      return { ok: true, resp: resp2, retried: true };
    } catch (err2: any) {
      const message2 = err2?.message || String(err2);
      console.error(
        `S3 delete retry failed for key=${s3Key}. Error: ${message2}`
      );
      return { ok: false, error: message2 };
    }
  }
}

/**
 * Check authorization:
 * - uploader can delete
 * - project member with role 'admin' can delete
 * - project member whose permissions JSON includes 'delete' or 'ADMIN' can delete
 *
 * NOTE: adjust permission logic depending on how ProjectMember.permissions is structured.
 */
async function isAuthorizedToDelete(
  currentUserId: string,
  file: { uploadedBy: string; projectId: string }
) {
  // uploader
  if (file.uploadedBy === currentUserId)
    return { authorized: true, reason: "uploader" };

  // project admin/member
  const member = await prisma.projectMember.findFirst({
    where: {
      projectId: file.projectId,
      userId: currentUserId,
    },
    select: {
      id: true,
      role: true,
      permissions: true,
    },
  });

  if (!member) return { authorized: false, reason: "not-a-member" };

  // role === 'admin' (case-insensitive)
  if (member.role && String(member.role).toLowerCase() === "admin") {
    return { authorized: true, reason: "project-admin" };
  }

  // If permissions is JSON array or object, try to detect 'delete' or 'ADMIN'
  try {
    const perms = member.permissions;
    if (Array.isArray(perms)) {
      if (perms.map(String).some((p) => /delete|admin|ADMIN/i.test(p))) {
        return { authorized: true, reason: "permissions-delete" };
      }
    } else if (typeof perms === "string") {
      if (/delete|admin/i.test(perms))
        return { authorized: true, reason: "permissions-delete-string" };
    } else if (typeof perms === "object" && perms !== null) {
      // e.g., { delete: true } or { role: 'editor', delete: true }
      if (Object.keys(perms).some((k) => /delete|admin/i.test(k)))
        return { authorized: true, reason: "permissions-object" };
      // Also check truthy values
      if (
        Object.values(perms).some(
          (v) => v === true || /delete|admin/i.test(String(v))
        )
      )
        return { authorized: true, reason: "permissions-object-value" };
    }
  } catch (e) {
    console.warn("Failed to parse projectMember.permissions", e);
  }

  return { authorized: false, reason: "insufficient-permissions" };
}

/**
 * Main handler for DELETE
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { fileId?: string } }
) {
  try {
    // 1) Authentication
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return errorResponse(401, "Unauthorized: missing Clerk session");
    }
    const clerkId = clerkUser.id; // Clerk user id (external). We'll map to our User via clerkId.
    // const clerkId = "user_31TGF6kLrmgc5ZuCxiAp8ywbUbU"; // Clerk user id (external). We'll map to our User via clerkId.

    // 2) Validate path param
    const fileId = params?.fileId;
    if (!fileId) return errorResponse(400, "Missing fileId path parameter");
    if (!isValidObjectId(fileId))
      return errorResponse(400, "Invalid fileId format");

    // 3) Map Clerk -> internal User id
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      // This probably means the user hasn't been provisioned in your DB
      return errorResponse(
        401,
        "Unauthorized: user not found in application database"
      );
    }

    const currentUserId = user.id;

    // 4) Fetch File metadata (minimal fields)
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      select: {
        id: true,
        fileName: true,
        fileUrl: true,
        projectId: true,
        uploadedBy: true,
        // assume we store the s3 key in fileUrl or a separate field; adjust accordingly
        // if you have a dedicated `s3Key` column, select it here instead.
        // For this example, we'll expect `fileUrl` is s3://bucket/key or https://.../bucket/key
        // and prefer a dedicated `s3Key` column if available.
        // Add s3Key to select when present.
        // s3Key: true,
      },
    });

    if (!file) {
      return errorResponse(404, `File with id ${fileId} not found`);
    }

    // --- Determine s3Key from file metadata ---
    // Prefer a dedicated s3Key field if present in your schema. If not, try to parse fileUrl.
    // This parsing is fragile; prefer to store the key directly in DB.
    let s3Key: string | null = null;
    // @ts-ignore - if s3Key exists on record use it
    if ((file as any).s3Key) {
      // If you have a column named s3Key, use it; uncomment in schema & query.
      s3Key = (file as any).s3Key;
    } else if (file.fileUrl && typeof file.fileUrl === "string") {
      // Example formats:
      // - s3://bucket/path/to/object.mp4
      // - https://<bucket>.s3.<region>.amazonaws.com/path/to/object.mp4
      // - https://cdn.example.com/path/to/object.mp4 (not recoverable -> warn)
      if (file.fileUrl.startsWith("s3://")) {
        s3Key = file.fileUrl.replace(/^s3:\/\/[^\/]+\//i, "");
      } else {
        // Try to parse URL and take pathname as key
        try {
          const url = new URL(file.fileUrl);
          // If host contains .s3. or s3.amazonaws, we can use pathname minus leading slash
          if (
            url.hostname.includes(".s3.") ||
            url.hostname.endsWith("s3.amazonaws.com") ||
            url.protocol === "s3:"
          ) {
            s3Key = url.pathname.replace(/^\/+/, "");
          } else {
            // The fileUrl might be a CDN URL; we cannot compute S3 key reliably.
            console.warn(
              `fileUrl appears to be CDN or non-s3 URL; cannot compute s3Key automatically: ${file.fileUrl}`
            );
            // We will attempt deletion only if dedicated s3Key exists;
            // otherwise proceed to attempt DB deletion but log that S3 deletion was skipped.
            s3Key = null;
          }
        } catch (err) {
          console.warn("Failed to parse file.fileUrl to compute s3Key:", err);
          s3Key = null;
        }
      }
    }

    // 5) Authorization check
    const authCheck = await isAuthorizedToDelete(currentUserId, {
      uploadedBy: file.uploadedBy,
      projectId: file.projectId,
    });
    if (!authCheck.authorized) {
      console.info(
        `User ${currentUserId} unauthorized to delete file ${fileId} reason=${authCheck.reason}`
      );
      return errorResponse(
        403,
        "Forbidden: you do not have permission to delete this file"
      );
    }

    // 6) S3 Deletion
    let s3DeleteResult: {
      ok: boolean;
      resp?: any;
      warning?: string;
      error?: string;
      retried?: boolean;
    } | null = null;
    if (s3Key) {
      s3DeleteResult = await deleteFromS3(s3Key);
      if (!s3DeleteResult.ok) {
        // If S3 deletion failed, do NOT delete DB record (to avoid orphaned metadata).
        // Return 500 with error details.
        console.error(
          `S3 deletion failed for fileId=${fileId} s3Key=${s3Key} error=${s3DeleteResult.error}`
        );
        return errorResponse(
          500,
          "Failed to delete file from storage (S3). Aborting DB deletion.",
          {
            s3Key,
            s3Error: s3DeleteResult.error,
          }
        );
      }
    } else {
      // No s3Key available - decide policy: either fail or proceed to DB delete.
      // We'll proceed but log a warning: the raw object may remain in storage if it exists.
      console.warn(
        `Proceeding without S3 deletion for fileId=${fileId} because s3Key could not be determined.`
      );
    }

    // 7) DB Deletion inside transaction
    // NOTE: cascading deletions configured in Prisma schema (onDelete: Cascade) will apply.
    // We explicitly delete related objects for clarity/explicitness so we can control ordering.
    try {
      await prisma.$transaction(async (tx: any) => {
        // Delete file access entries
        await tx.fileAccess.deleteMany({ where: { fileId: fileId } });

        // Delete share links for file
        await tx.fileShareLink.deleteMany({ where: { fileId: fileId } });

        // Optionally delete notes, versions, etc. Adjust to your relations.
        // Example: delete notes linked to file
        // await tx.note.deleteMany({ where: { fileId } });

        // Now delete file
        await tx.file.delete({
          where: { id: fileId },
        });
      });

      // 8) Log and respond
      console.info(
        `File deleted: fileId=${fileId}, deletedBy=${currentUserId}, reason=${authCheck.reason}`
      );
      return successResponse("File deleted successfully");
    } catch (dbErr: any) {
      // DB deletion failed after S3 deletion succeeded -> critical. We cannot automatically restore object.
      // Provide a transparent error and recommend manual remediation or reupload.
      console.error(
        "DB deletion failed after S3 deletion. This may have left the system inconsistent.",
        {
          fileId,
          s3Key,
          error: dbErr,
        }
      );

      // Attempt to persist a 'tombstone' record if appropriate (not implemented here).
      return errorResponse(
        500,
        "Internal server error while deleting file metadata. Manual remediation required.",
        {
          fileId,
          s3Key,
          dbError: dbErr?.message ?? String(dbErr),
        }
      );
    }
  } catch (err: any) {
    console.error("Unexpected error in DELETE /api/files/:fileId", err);
    return errorResponse(500, "Unexpected error", {
      message: err?.message ?? String(err),
    });
  }
}
