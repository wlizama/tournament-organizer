import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Retrive the tournaments you organize and have organized
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const tournamentId = searchParams.get("tournament_id");

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    return NextResponse.json(`tournament_id: ${tournamentId}`);
  } catch (error) {
    return new Response("Error retrieving stages", { status: 500 });
  }
}

// Create a new tournament as the organizer
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const {
      tournamentId,
      number,
      name,
      type,
      settings,
      matchSettings,
      autoPlacement,
    } = await request.json();

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const newStage = await prisma.stage.create({
      data: {
        tournament: {
          connect: {
            id: tournamentId,
          },
        },
        number,
        name,
        type,
        settings,
        match_settings: matchSettings,
        auto_placement_enabled: autoPlacement,
      },
    });

    return NextResponse.json(newStage);
  } catch (error) {
    return new Response("Error creating stage", { status: 500 });
  }
}
