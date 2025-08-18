import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      members = [], // array of { email, role }
      visibility,
      projectType,
      startDate,
      dueDate,
      tags = [],
      color,
    } = body;
    console.log(members) 
    const user = await currentUser();
    const creatorEmail = user?.emailAddresses[0]?.emailAddress;

    // 🔎 Validation
    if (!name || !creatorEmail) {
      console.warn("[Project Creation] Missing required fields", {
        name,
        creatorEmail,
      });
      return NextResponse.json(
        {
          success: false,
          error: "Project name and creator email are required",
        },
        { status: 400 }
      );
    }

    const creator = await prisma.user.findUnique({
      where: { email: creatorEmail },
    });

    if(!creator) return NextResponse.json(
      { success: false, error: "Creator does not exist"},
      { status: 401 }
    );

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        createdBy: creator.id,
        visibility,
        projectType,
        startDate: startDate ? new Date(startDate) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : new Date(),
        tags,
        color,
        members: {
          create: {
            userId: creator.id,
            role: "owner",
            permissions: {}, // full access
          },
        },
      },
      include: { creator: true, members: true },
    });
    for (const member of members) {
      const invitedUser = await prisma.user.findUnique({
        where: { email: member },
      });

      if (invitedUser) {
       const invite =  await prisma.projectInvite.create({
          data: {
            projectId: newProject.id,
            invitedUserId: invitedUser.id,
            inviterId: creator.id,
            permissions: {}, // set defaults
          },
        });

        await prisma.notification.create({
          data: {
            userId: invitedUser.id,
            type: "invite",
            content: `You have been invited to join project "${newProject.name}".`,
            inviteId: invite.id
          },
        });
      }
    }
    console.info("[Project Created]", {
      projectId: newProject.id,
      name: newProject.name,
      creator: creatorEmail,
    //   memberCount: newProject.members.length,
    });

    return NextResponse.json(
      { success: true, project: newProject },
      { status: 201 }
    );
  } catch (error: any) {
    // Prisma unique constraint error
    if (error.code === "P2002") {
      console.error("[Project Creation Error] Duplicate entry", error.meta);
      return NextResponse.json(
        { success: false, error: "A project with this name already exists" },
        { status: 409 }
      );
    }

    // Log unexpected errors
    console.error("[Project Creation Error]", {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
