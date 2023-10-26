import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Retrive the tournaments you organize and have organized
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log('here', 'me');


    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;
    const tournaments = await prisma.tournament.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        discipline: {
          select: { name: true },
        },
        name: true,
        full_name: true,
        status: true,
        scheduled_date_start: true,
        scheduled_date_end: true,
        timezone: true,
        public: true,
        size: true,
        online: true,
        location: true,
        country: true,
        platforms: true,
        // logo: true,
        registration_enabled: true,
        registration_opening_datetime: true,
        registration_closing_datetime: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(tournaments);
  } catch (error) {
    return new Response("Error retrieving tournaments", { status: 500 });
  }
}

// Create a new tournament as the organizer
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { discipline, name, participantType, size, timezone, platforms } =
      await request.json();

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const teamsize = await prisma.discipline.findUnique({
      where: {
        id: discipline,
      },
    });
    const teamsizeValue = teamsize?.teamsize as { max: number; min: number };
    const { max, min } = teamsizeValue;

    const { user } = session;
    const newTournament = await prisma.tournament.create({
      data: {
        discipline: {
          connect: {
            id: discipline,
          },
        },
        name,
        participant_type: participantType,
        size,
        timezone,
        platforms,
        team_min_size: min,
        team_max_size: max,
        user: { connect: { id: user.id } },
      },
    });

    return NextResponse.json(newTournament);
  } catch (error) {
    return new Response("Error creating tournament", { status: 500 });
  }
}
