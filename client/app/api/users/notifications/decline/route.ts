import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // 1️⃣ Get current user
    const clerkUser = await currentUser();
    if (!clerkUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2️⃣ Parse body
    const body = await req.json();
    const { notificationId, inviteId, projectId, inviterId } = body;
    if (!notificationId || !inviteId || !projectId || !inviterId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 3️⃣ Validate ProjectInvite
    const invite = await prisma.projectInvite.findUnique({
      where: { id: inviteId },
      include: { project: true, inviter: true },
    });

    if (!invite)
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    if (invite.status !== "pending")
      return NextResponse.json(
        { error: "Invite not pending" },
        { status: 400 }
      );
    if (invite.invitedUserId !== user.id)
      return NextResponse.json({ error: "Not your invite" }, { status: 403 });
    if (invite.expiresAt && new Date() > invite.expiresAt)
      return NextResponse.json({ error: "Invite expired" }, { status: 400 });

    // 4️⃣ Transaction: decline invite
    await prisma.$transaction(async (tx) => {
      // a) Update invite status
      await tx.projectInvite.update({
        where: { id: inviteId },
        data: { status: "declined"},
      });

      // b) Mark the frontend notification as read
      await tx.notification.update({
        where: { id: notificationId },
        data: { read: true },
      });

      // c) Notify inviter
      await tx.notification.create({
        data: {
          user: { connect: { id: inviterId } },
          invite: { connect: { id: inviteId } },
          type: "update",
          content: `${user.displayName} declined your invite to project ${invite.project.name}`,
        },
      });
    });

    return NextResponse.json({
      success: true,
      invite: { id: inviteId, status: "declined" },
    });
  } catch (err) {
    console.error("decline invite error:", err);
    return NextResponse.json(
      { error: "Failed to decline invite" },
      { status: 500 }
    );
  }
}
