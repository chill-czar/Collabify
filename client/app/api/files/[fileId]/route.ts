// File: app/api/files/[fileId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { s3 } from "@/lib/s3";
import { Prisma } from "@prisma/client";
// ---------------------------
// Type Definitions
// ---------------------------

type FileResponse = {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  category: string;
  version: number;
  isStarred: boolean;
  downloadCount: number;
  status: string;
  visibility: string;
  description?: string;
  tags: string[];
  projectId: string;
  uploadedBy: {
    id: string;
    displayName: string;
    email: string;
    avatar?: string;
  };
  folder?: {
    id: string;
    name: string;
    description?: string;
    color?: string;
    parentFolderId?: string;
  };
  parentFile?: {
    id: string;
    fileName: string;
    version: number;
  };
  versions: {
    id: string;
    version: number;
    createdAt: string;
  }[];
  accessUsers: {
    id: string;
    userId: string;
    permission: string;
  }[];
  shareLinks: {
    id: string;
    shareToken: string;
    permission: string;
    expiresAt?: string;
  }[];
  createdAt: string;
  updatedAt: string;
};

// ---------------------------
// Input Validation
// ---------------------------

const ParamsSchema = z.object({
  fileId: z.string().min(1),
});

async function generatePresignedUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
  });
  return await getSignedUrl(s3, command, {
    expiresIn: Number(process.env.SIGNED_URL_EXPIRY || 900),
  });
}

// ---------------------------
// Helpers
// ---------------------------

function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

// ---------------------------
// GET Handler
// ---------------------------

export async function GET(
  req: NextRequest,
  { params }: { params: Record<string, string> }
) {
  try {
    // 1️⃣ Validate path params
    const { fileId } = ParamsSchema.parse(params);

    // 2️⃣ Authenticate user
    const clerkUser = await currentUser();

    if (!clerkUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 401 });

    // 3️⃣ Fetch file with relations
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: {
        uploader: {
          select: { id: true, displayName: true, email: true, avatar: true },
        },
        folder: {
          select: {
            id: true,
            name: true,
            description: true,
            color: true,
            parentFolderId: true,
          },
        },
        parentFile: { select: { id: true, fileName: true, version: true } },
        versions: {
          select: { id: true, version: true, createdAt: true },
          orderBy: { version: "asc" },
        },
        accessUsers: { select: { id: true, userId: true, permission: true } },
        shareLinks: {
          select: {
            id: true,
            shareToken: true,
            permission: true,
            expiresAt: true,
          },
        },
      },
    });

    if (!file)
      return NextResponse.json({ error: "File not found" }, { status: 404 });

    // 4️⃣ Authorization
    const isUploader = file.uploader.id === user.id;
    const isProjectMember = await prisma.projectMember.findFirst({
      where: { projectId: file.projectId, userId: user.id },
    });
    const hasExplicitAccess = file.accessUsers.some(
      (au: any) => au.userId === user.id
    );

    const canAccess =
      file.visibility === "PUBLIC" ||
      isUploader ||
      !!isProjectMember ||
      hasExplicitAccess ||
      (file.visibility === "SPECIFIC_USERS" && hasExplicitAccess);

    if (!canAccess)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // 5️⃣ Generate presigned URL if private
    let fileUrl = file.fileUrl;
    if (file.visibility === "PRIVATE" || file.visibility === "SPECIFIC_USERS") {
      fileUrl = await generatePresignedUrl(file.fileUrl);
    }

    // 6️⃣ Construct response
    const responseData: FileResponse = {
      id: file.id,
      fileName: file.fileName,
      fileType: file.fileType,
      fileSize: file.fileSize,
      fileUrl,
      category: file.category,
      version: file.version,
      isStarred: file.isStarred,
      downloadCount: file.downloadCount,
      status: file.status,
      visibility: file.visibility,
      description: nullToUndefined(file.description),
      tags: file.tags,
      projectId: file.projectId,
      uploadedBy: {
        id: file.uploader.id,
        displayName: file.uploader.displayName,
        email: file.uploader.email,
        avatar: nullToUndefined(file.uploader.avatar),
      },
      folder: file.folder
        ? {
            id: file.folder.id,
            name: file.folder.name,
            description: nullToUndefined(file.folder.description),
            color: nullToUndefined(file.folder.color),
            parentFolderId: nullToUndefined(file.folder.parentFolderId),
          }
        : undefined,
      parentFile: file.parentFile
        ? {
            id: file.parentFile.id,
            fileName: file.parentFile.fileName,
            version: file.parentFile.version,
          }
        : undefined,
      versions: file.versions.map((v: any) => ({
        id: v.id,
        version: v.version,
        createdAt: v.createdAt.toISOString(),
      })),
      accessUsers: file.accessUsers.map((au: any) => ({
        id: au.id,
        userId: au.userId,
        permission: au.permission.toString(),
      })),
      shareLinks: file.shareLinks.map((sl: any) => ({
        id: sl.id,
        shareToken: sl.shareToken,
        permission: sl.permission.toString(),
        expiresAt: sl.expiresAt ? sl.expiresAt.toISOString() : undefined,
      })),
      createdAt: file.createdAt.toISOString(),
      updatedAt: file.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: { file: responseData },
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error("GET /api/files/:fileId error:", err);
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request parameters", details: err.format() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
