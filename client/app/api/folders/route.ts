import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

/* ----------------------------- Schemas ---------------------------- */
const createFolderSchema = z.object({
  projectId: z.string().min(1),
  name: z.string().min(1).max(255),
  parentFolderId: z.string().optional().nullable(),
  description: z.string().max(2000).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

/* --------------------------- Helpers ------------------------------ */
function sanitizeFolderName(name: string): string {
  const withoutControls = name.replace(/[\u0000-\u001F\u007F]/g, "");
  const noSlashes = withoutControls.replace(/[\\/]+/g, " ");
  return noSlashes.replace(/\s+/g, " ").trim();
}

function sanitizeMetadata(input: unknown): Record<string, unknown> | undefined {
  if (!input || typeof input !== "object") return undefined;
  try {
    return JSON.parse(JSON.stringify(input)) as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

/* --------------------------- Rate limiter -------------------------- */
const creationWindowMs = 60 * 1000;
const maxCreatesPerWindow = 30;
const inMemoryRateMap = new Map<
  string,
  { count: number; windowStart: number }
>();

function checkRateLimit(userId: string, projectId: string) {
  const key = `${userId}:${projectId}`;
  const now = Date.now();
  const state = inMemoryRateMap.get(key);
  if (!state || now - state.windowStart > creationWindowMs) {
    inMemoryRateMap.set(key, { count: 1, windowStart: now });
    return { ok: true };
  }
  if (state.count + 1 > maxCreatesPerWindow) {
    return {
      ok: false,
      retryAfterMs: creationWindowMs - (now - state.windowStart),
    };
  }
  state.count += 1;
  return { ok: true };
}

/* -------------------------- Route Handler -------------------------- */
export async function POST(req: NextRequest) {
  try {
    // Parse & validate body
    const json = await req.json()
    const parsed = createFolderSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request payload",
          details: parsed.error.flatten(),
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    } 

    const { projectId, name, parentFolderId, description, metadata } =
      parsed.data;

    // Auth
    const clerkUser = await currentUser();
    if (!clerkUser?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }
    const clerkId = clerkUser.id;
    // const clerkId = "user_31TGF6kLrmgc5ZuCxiAp8ywbUbU";

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true, displayName: true },
    });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }
    const userId = user.id;

    // Rate limit
    const rl = checkRateLimit(userId, projectId);
    if (!rl.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded",
          timestamp: new Date().toISOString(),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 0) / 1000)),
          },
        }
      );
    }

    // Project existence & membership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, createdBy: true },
    });
    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: "Project not found",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    const isCreator = project.createdBy === userId;
    if (!isCreator) {
      const projectMember = await prisma.projectMember.findFirst({
        where: { projectId, userId },
        select: { id: true },
      });
      if (!projectMember) {
        return NextResponse.json(
          {
            success: false,
            error: "Forbidden: not a member",
            timestamp: new Date().toISOString(),
          },
          { status: 403 }
        );
      }
    }

    // Validate parent folder
    let resolvedParentFolderId: string | null = null;
    if (parentFolderId) {
      const parentFolder = await prisma.folder.findUnique({
        where: { id: parentFolderId },
        select: { id: true, projectId: true },
      });
      if (!parentFolder) {
        return NextResponse.json(
          {
            success: false,
            error: "Parent folder not found",
            timestamp: new Date().toISOString(),
          },
          { status: 404 }
        );
      }
      if (parentFolder.projectId !== projectId) {
        return NextResponse.json(
          {
            success: false,
            error: "Parent folder belongs to another project",
            timestamp: new Date().toISOString(),
          },
          { status: 403 }
        );
      }
      resolvedParentFolderId = parentFolderId;
    }

    // Sanitize
    const cleanName = sanitizeFolderName(name);
    if (!cleanName) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid folder name",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }
    const cleanMetadata = sanitizeMetadata(metadata);

    // Create folder
    const now = new Date();
   const created = await prisma.folder.create({
     data: {
       // id: folderId, // remove this
       name: cleanName,
       description: description ?? null,
       projectId,
       createdBy: userId,
       parentFolderId: resolvedParentFolderId ?? null,
       createdAt: now,
       updatedAt: now,
     },
     select: {
       id: true,
       name: true,
       description: true,
       projectId: true,
       parentFolderId: true,
       createdAt: true,
       updatedAt: true,
     },
   });

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: "Folder created successfully",
        data: {
          id: created.id,
          name: created.name,
          projectId: created.projectId,
          parentFolderId: created.parentFolderId ?? null,
          description: created.description ?? null,
          metadata: cleanMetadata ?? null,
          createdBy: { id: userId, name: user.displayName ?? null },
          createdAt: created.createdAt.toISOString(),
          updatedAt: created.updatedAt.toISOString(),
        },
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST /api/folders error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Internal Server Error",
        details:
          process.env.NODE_ENV === "development"
            ? { stack: err?.stack }
            : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: err?.statusCode ?? 500 }
    );
  }
}
