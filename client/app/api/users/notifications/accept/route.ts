// app/api/users/notifications/accept/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { notificationId, inviteId, projectId, inviterId } = body;
    if (!notificationId || !inviteId || !projectId || !inviterId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1️⃣ Validate ProjectInvite
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

    // 2️⃣ Transaction: accept invite
    const result = await prisma.$transaction(async (tx: any) => {
      // a) Create ProjectMember
      const member = await tx.projectMember.create({
        data: {
          user: { connect: { id: user.id } },
          project: { connect: { id: projectId } },
          role: "member",
          permissions: {}, // or your default permissions
          joinedAt: new Date(),
        },
      });

      // b) Update Invite status
      await tx.projectInvite.update({
        where: { id: inviteId },
        data: { status: "accepted", acceptedAt: new Date() },
      });

      // c) Create Notification for inviter
      await tx.notification.create({
        data: {
          user: { connect: { id: inviterId } },
          invite: { connect: { id: inviteId } },
          type: "update",
          content: `${user.displayName} accepted your invite to project ${invite.project.name}`,
        },
      });

      // d) Mark the frontend notification as read
      if (notificationId) {
        await tx.notification.update({
          where: { id: notificationId },
          data: { read: true },
        });
      }

      return { member };
    });

    // 3️⃣ Fetch updated project info
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { members: { include: { user: true } } },
    });

    return NextResponse.json({ project, member: result.member });
  } catch (err) {
    console.error("accept invite error:", err);
    return NextResponse.json(
      { error: "Failed to accept invite" },
      { status: 500 }
    );
  }
}
