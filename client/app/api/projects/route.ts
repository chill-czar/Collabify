import { NextResponse } from "next/server"; // if you’re using Clerk
import  prisma  from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from DB
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch projects where user is creator OR member
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { createdBy: user.id },
          { members: { some: { userId: user.id } } },
        ],
      },
      include: {
        members: true,
      },
    });

    // Map projects to response shape
    const formatted = projects.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description || undefined,
      projectType: p.projectType as
        | "design"
        | "development"
        | "research"
        | "marketing"
        | "other",
      visibility: p.visibility as "public" | "private",
      startDate: p.startDate.toISOString(),
      dueDate: p.dueDate ? p.dueDate.toISOString() : undefined,
      tags: p.tags,
      color: p.color,
      status: "active", // ⚡ you don’t have a status in schema → default "active"
      createdAt: p.createdAt.toISOString(),
      updatedAt: (p as any).updatedAt
        ? new Date((p as any).updatedAt).toISOString()
        : p.createdAt.toISOString(), // schema lacks updatedAt, fallback
      membersCount: p.members.length,
      progress: undefined, // can be calculated from tasks if needed
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (err) {
    console.error("[PROJECTS_GET]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
