import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const email =
      clerkUser.emailAddresses?.[0]?.emailAddress ??
      clerkUser.primaryEmailAddress?.emailAddress ??
      "";

    const displayName = `${clerkUser.firstName || ""} ${
      clerkUser.lastName || ""
    }`.trim();

    const user = await prisma.user.upsert({
      where: { clerkId: clerkUser.id }, // requires @unique on clerkId
      update: {
        email,
        displayName,
        avatar: clerkUser.imageUrl,
      },
      create: {
        clerkId: clerkUser.id,
        email,
        displayName,
        avatar: clerkUser.imageUrl,
      },
    });

    // If you want to differentiate created vs updated:
    // return NextResponse.json({ user, created: !exists }, { status: exists ? 200 : 201 });

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("sync-user error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
