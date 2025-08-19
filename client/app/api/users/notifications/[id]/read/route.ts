import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(
  req: Request,
  { params }:  { params: { id: string } }
) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Map Clerk ID → internal user
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });
    if (!dbUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!params.id) {
      return NextResponse.json(
        { error: "Missing notification ID" },
        { status: 400 }
      );''
    }
    const notificationId = params.id; // ✅ correct now

    // Find notification
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!notification)
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );

    // Ownership check
    if (notification.userId !== dbUser.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    // Update read
    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
