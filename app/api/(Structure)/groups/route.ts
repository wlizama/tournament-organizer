import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = getServerSession(authOptions);
    const { stageId, tournamentId } = await request.json();

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const group = await prisma.group.create({
      data: {
        stage: {
          connect: {
            id: stageId,
          },
        },
        tournament: {
          connect: {
            id: tournamentId,
          },
        },
        number: 1,
        name: "Group A",
        settings: {},
        match_settings: {},
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    return new Response("Error creating group", { status: 500 });
  }
}
