import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Match } from "@prisma/client";
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
        Round: true,
      },
    });

    if (!stage) {
      return new Response("Stage not found", { status: 400 });
    }

    const groupId = stage.Group[0].id;
    const roundId = stage.Round[0].id;
    const stageSize = (stage?.settings as any)?.size;
    let totalMatches = stageSize / 2;

    // Generate matches
    const matches = generateMatchesForStage(stage);

    const data = matches.map((match) => ({
      stageId: match.stageId,
      number: match.number,
      type: match.type,
      status: match.status,
    }));
    console.log(data);

    await prisma.match.createMany({
      data: matches.map((match) => ({
        // tournament: {
        //   connect: {
        //     id: stage.tournamentId
        //   }
        // },
        // stage: {
        //   connect: {
        //     id: stage.id
        //   }
        // },
        // group: {
        //   connect: {
        //     id: (stage?.Group as any)?.id
        //   }
        // },
        // round: {
        //   connect: {
        //     id: (stage?.Round as any)?.id
        //   }
        // },
        tournamentId: tournamentId,
        stageId: stage.id,
        groupId: groupId,
        roundId: roundId,
        number: match.number!,
        type: match.type!,
        status: match.status!,
        settings: {},
        opponents: [],
      })),
    });

    return NextResponse.json("Success", { status: 200 });
  } catch (error) {
    return new Response("Error creating group", { status: 500 });
  }
}

function generateMatchesForStage(stage: any): Partial<Match>[] {
  switch (stage.type) {
    case "single_elimination":
      return generateSingleEliminationMatches(stage);
      break;
    // case "double_elimination":
    //   return generateDoubleEliminationMatches(stage);
    //   break;
    default:
      throw new Error("Invalid stage type");
  }
}

function generateSingleEliminationMatches(stage: any): Partial<Match>[] {
  const size = stage.settings.size;
  const thirdDecider = stage.settings.third_decider;
  const threshold = stage.settings.threshold;
  const matches: Partial<Match>[] = [];

  const totalMatches = size - 1;
  let validCompetitors = size;

  if (threshold) {
    validCompetitors = Math.max(validCompetitors, threshold);
  }

  for (let i = 0; i < totalMatches; i++) {
    if (i >= validCompetitors - 1) {
      // Skip matches with seeds lower or equal to the threshold
      continue;
    }
    matches.push({
      stageId: stage.id,
      type: "duel",
      status: "pending",
      number: i + 1,
    });
  }

  if (thirdDecider && size >= 4) {
    matches.push({
      stageId: stage.id,
      type: "duel",
      status: "pending",
      number: totalMatches + 1,
    });
  }

  return matches;
}
