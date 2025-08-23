import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { FileCategory, PrismaClient } from "@prisma/client";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const prisma = new PrismaClient();
const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET = process.env.AWS_S3_BUCKET_NAME!;

export async function POST(req: Request) {
  try {
    // const clerkUser = await currentUser();
    // if (!clerkUser)
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const form = await req.formData();
    const file = form.get("file") as File | null;
    const fileName = form.get("fileName") as string;
    const projectId = form.get("projectId") as string;
    const folderId = form.get("folderId") as string | null;
    let category = form.get("category") as string;
    const description = form.get("description") as string | null;
    const tags = form.get("tags") ? JSON.parse(form.get("tags") as string) : [];

    if (!file || !fileName || !projectId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate S3 Key
    const timestamp = Date.now();
    const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const s3Key = `projects/${projectId}/${
      folderId ? `folders/${folderId}/` : ""
    }${timestamp}_${safeFileName}`;

    // Direct upload to S3
    const arrayBuffer = await file.arrayBuffer();
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
        Body: Buffer.from(arrayBuffer),
        ContentType: file.type,
      })
    );
    const validCategories = Object.values(FileCategory);
    if (!validCategories.includes(category.toUpperCase() as FileCategory)) {
      category = FileCategory.OTHER;
    }

    const categoryEnum: FileCategory =
      (category?.toUpperCase() as FileCategory) || FileCategory.OTHER;
    // Save metadata in DB after successful upload

    const user = await prisma.user.findUnique({
      where: { clerkId: "user_31TGF6kLrmgc5ZuCxiAp8ywbUbU" },
    });
    const fileRecord = await prisma.file.create({
      data: {
        fileName,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: s3Key,
        projectId,
        folderId: folderId || undefined,
        uploadedBy: user!.id,
        category: categoryEnum,
        description: description || null,
        tags,
        status: "ACTIVE",
        visibility: "PROJECT_MEMBERS",
      },
    });

    return NextResponse.json(
      { success: true, data: fileRecord },
      { status: 201 }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
