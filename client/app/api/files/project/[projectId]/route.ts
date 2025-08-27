import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

// -----------------------------
// Utility: Mongo ObjectId check
// -----------------------------
const objectIdRegex = /^[a-f\d]{24}$/i;
const isObjectId = (v: string) => objectIdRegex.test(v);

// -----------------------------
// Zod validation (only folderId)
// -----------------------------
const querySchema = z.object({
  folderId: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || isObjectId(v), { message: "Invalid folderId" }),
});
type ParsedQuery = z.infer<typeof querySchema>;

// -----------------------------
// GET handler
// -----------------------------
export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string , folderId: string } }
) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const clerkId = clerkUser.id;
    // const clerkId = "user_31TGF6kLrmgc5ZuCxiAp8ywbUbU";
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const projectId = params.projectId;
    // const { searchParams } = new URL(req.url);
    // const folderId = searchParams.get("folderId");
    // console.log("folderId: ",folderId)
    if (!isObjectId(projectId)) {
      return NextResponse.json(
        { success: false, error: "Invalid projectId" },
        { status: 400 }
      );
    }

    // Parse & validate query
    const url = new URL(req.url);
    const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams));
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid query",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }
    const q = parsed.data;
    console.log("folderId",q.folderId)
console.log(q.folderId || null )
    // Fetch files + folders in this folder
    const [files, folders] = await Promise.all([
      prisma.file.findMany({
        where: {
          projectId,
          folderId: q.folderId || null,
        },
        select: {
          id: true,
          fileName: true,
          fileType: true,
          fileSize: true,
          folderId: true,
          createdAt: true,
          updatedAt: true,
          fileUrl: true,
          category: true,
          tags: true,
          description: true,
          uploadedBy: true,
          parentFileId: true,
          parentFile: true,
          status: true,
          isStarred: true,
          downloadCount: true,
          visibility: true,
          accessUsers: true,
          shareLinks: true,
        },
        orderBy: { createdAt: "desc" },
      }),

      prisma.folder.findMany({
        where: {
          projectId,
          parentFolderId: q.folderId || null,
        },
        select: {
          id: true,
          name: true,
          parentFolderId: true,
          color: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { name: "asc" },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: { files, folders },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("GET /api/files/project/[projectId] error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
