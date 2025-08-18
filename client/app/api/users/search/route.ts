// /app/api/users/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const q = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    if (!q) {
      // No query, return empty array
      return NextResponse.json([], { status: 200 });
    }

    // Search users by email (case-insensitive)
    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: q,
          mode: "insensitive",
        },
      },
      take: limit,
      select: {
        id: true,
        email: true,
        displayName: true,
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error("[User Search Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to search users" },
      { status: 500 }
    );
  }
}
