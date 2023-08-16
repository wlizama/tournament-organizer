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

    const stage = await prisma.stage.findFirst({
      where: {
        id: stageId,
      },
      include: {
        Group: true,
      },
    });

    if (!stage) {
      return new Response("Stage not found", { status: 400 });
    }

    const groupId = stage.Group[0].id;
    const stageSize = (stage?.settings as any)?.size;
    let totalMatches = stageSize / 2;

    for (
      let roundNumber = 1;
      totalMatches >= 1;
      roundNumber++, totalMatches /= 2
    ) {
      await prisma.round.create({
        data: {
          stage: {
            connect: {
              id: stageId,
            },
          },
          group: {
            connect: {
              id: groupId,
            },
          },
          tournament: {
            connect: {
              id: tournamentId,
            },
          },
          number: roundNumber,
          name: `Round ${roundNumber}`,
          settings: {},
          match_settings: {},
        },
      });
    }

    return NextResponse.json("Success", { status: 200 });
  } catch (error) {
    return new Response("Error creating group", { status: 500 });
  }
}
