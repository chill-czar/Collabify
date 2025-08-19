import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

// Utility to get current user ID from request (adjust according to your auth system)

export async function getCurrentUserId(
  req: NextRequest
): Promise<string | null> {
  const user = await currentUser();

  // Guard against missing user or email
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (!email) return null;

  const userRecord = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return userRecord?.id || null;
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch notifications for the user
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        read: false,
        OR: [
          {
            type: "invite",
            invite: { status: "pending" },
          },
          {
            type: { not: "invite" },
          },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: { invite: true },
    });

    // Normalize the response
    const formattedNotifications = notifications.map((n) => ({
      id: n.id,
      type: n.type,
      content: n.content,
      read: n.read,
      createdAt: n.createdAt,
      // for invite notifications, include projectId, inviterId, status etc
      invite:
        n.type === "invite" && n.invite
          ? {
              id: n.invite.id,
              projectId: n.invite.projectId,
              inviterId: n.invite.inviterId,
              status: n.invite.status,
              expiresAt: n.invite.expiresAt,
              acceptedAt: n.invite.acceptedAt,
            }
          : null,
    }));
      

    return NextResponse.json(formattedNotifications);
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
