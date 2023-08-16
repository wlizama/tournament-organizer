import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Match } from "@prisma/client";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Retrive stages in a tournament
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

// Create a new stage as the organizer
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const {
      tournamentId,
      number,
      name,
      type,
      settings,
      match_settings,
      auto_placement_enabled,
    } = await request.json();

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const stage = await prisma.stage.create({
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
        match_settings,
        auto_placement_enabled,
      },
    });

    // create group
    const group = await prisma.group.create({
      data: {
        stage: {
          connect: {
            id: stage.id,
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

    // create round
    const round = await prisma.round.create({
      data: {
        stage: {
          connect: {
            id: stage.id,
          },
        },
        group: {
          connect: {
            id: group.id,
          },
        },
        tournament: {
          connect: {
            id: tournamentId,
          },
        },
        number: 1,
        name: `Round 1`,
        settings: {},
        match_settings: {},
      },
    });

    // console.log(stage);

    // Generate matches
    const matches = generateMatchesForStage(stage);
    // console.log(matches);

    // const data = matches.map((match) => ({
    //   stageId: match.stageId,
    //   number: match.number,
    //   type: match.type,
    //   status: match.status,
    // }));
    // console.log(data);

    await prisma.match.createMany({
      data: matches.map((match) => ({
        stageId: stage.id,
        groupId: group.id,
        tournamentId: stage.tournamentId,
        roundId: round.id,
        settings: {},
        opponents: [],
        number: match.number!,
        type: match.type!,
        status: match.status!,
      })),
    });

    return NextResponse.json({ stage, group, round });
  } catch (error) {
    return new Response("Error creating stage", { status: 500 });
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

function generateDoubleEliminationMatches(stage: any): Partial<Match>[] {
  const size = stage.settings.size;
  const skipRound1 = stage.settings.skip_round_1;
  const grandFinal = stage.settings.grand_final;
  const threshold = stage.settings.threshold;
  const matches: Partial<Match>[] = [];

  const totalMatchesInWinnersBracket = size - 1;
  const totalMatchesInLosersBracket = (size - 1) * 2;
  let validCompetitors = size;

  if (threshold) {
    validCompetitors = Math.max(validCompetitors, threshold);
  }

  // Winners bracket
  for (let i = 0; i < totalMatchesInWinnersBracket; i++) {
    if (i >= validCompetitors - 1) {
      continue;
    }
    if (skipRound1 && i < size / 2) {
      // Skip first round matches
      continue;
    }
    matches.push({});
  }

  // Losers bracket
  for (let i = 0; i < totalMatchesInLosersBracket; i++) {
    if (i >= validCompetitors - 1) {
      continue;
    }
    matches.push({});
  }

  // Grand Final
  if (grandFinal === "simple" || grandFinal === "double") {
    matches.push({});
    if (grandFinal === "double") {
      matches.push({});
    }
  }

  return matches;
}
