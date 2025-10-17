// app/api/folders/[folderId]/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { getPresignedUrl } from "@/lib/s3";

/**
 * =========================
 * 1) Input Validation
 * =========================
 */
const paramsSchema = z.object({
  folderId: z.string().min(1, "folderId is required"),
});

/**
 * =========================
 * 2) Response Types
 * =========================
 */
type FileResponse = {
  id: string;
  name: string;
  size: number;
  presignedUrl?: string;
};

type FolderResponse = {
  id: string;
  name: string;
  projectId: string;
  parentFolderId?: string | null;
  description?: string | null;
  metadata?: Record<string, any>;
  createdBy: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
  files: FileResponse[];
  subfolders: { id: string; name: string }[];
};

/**
 * =========================
 * 3) GET Handler
 * =========================
 */
export async function GET(
  req: Request,
  { params }: { params: { folderId: string } }
) {
  try {
    // ------------------------
    // 3a) Authenticate User
    // ------------------------
    const clerkUser = await currentUser();
    if (!clerkUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ------------------------
    // 3b) Validate Params
    // ------------------------
    const { folderId } = paramsSchema.parse(params);

    // ------------------------
    // 3c) Fetch User from DB
    // ------------------------
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true, displayName: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // ------------------------
    // 3d) Fetch Folder with Project and Creator
    // ------------------------
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        project: {
          select: {
            id: true,
            createdBy: true,
            members: { select: { userId: true } },
          },
        },
        creator: { select: { id: true, displayName: true } },
      },
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    // ------------------------
    // 3e) Authorization
    // ------------------------
    const isProjectMember =
      folder.project.createdBy === user.id ||
      folder.project.members.some((m: any) => m.userId === user.id);

    if (!isProjectMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ------------------------
    // 3f) Fetch Files
    // ------------------------
    const fileRecords = await prisma.file.findMany({
      where: { folderId: folder.id, status: "ACTIVE" },
      select: {
        id: true,
        fileName: true,
        fileSize: true,
        fileUrl: true,
      },
    });

    const files: FileResponse[] = await Promise.all(
      fileRecords.map(async (f: any) => {
        let presignedUrl: string | undefined;
        try {
          presignedUrl = await getPresignedUrl(f.fileUrl);
        } catch (err) {
          console.error("S3 presign failed:", err);
        }
        return { id: f.id, name: f.fileName, size: f.fileSize, presignedUrl };
      })
    );

    // ------------------------
    // 3g) Fetch Subfolders
    // ------------------------
    const subfolderRecords = await prisma.folder.findMany({
      where: { parentFolderId: folder.id },
      select: { id: true, name: true },
    });

    const subfolders = subfolderRecords.map((sf: any) => ({
      id: sf.id,
      name: sf.name,
    }));

    // ------------------------
    // 3h) Build Response
    // ------------------------
    const response: FolderResponse = {
      id: folder.id,
      name: folder.name,
      projectId: folder.projectId,
      parentFolderId: folder.parentFolderId,
      description: folder.description,
      metadata: { color: folder.color },
      createdBy: { id: folder.creator.id, name: folder.creator.displayName },
      createdAt: folder.createdAt.toISOString(),
      updatedAt: folder.updatedAt.toISOString(),
      files,
      subfolders,
    };

    return NextResponse.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("GET /api/folders/:folderId error:", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
