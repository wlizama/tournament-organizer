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
      matchSettings,
      autoPlacement,
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
        match_settings: matchSettings,
        auto_placement_enabled: autoPlacement,
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

    // Generate rounds and matches
    const { rounds, matches } = await generateMatchesForStage(stage, group);

    return NextResponse.json({ stage, group, rounds, matches });
  } catch (error) {
    return new Response("Error creating stage", { status: 500 });
  }
}

async function generateMatchesForStage(stage: any, group: any) {
  let rounds;
  let matches;

  switch (stage.type) {
    case "single_elimination":
      // return generateSingleEliminationMatches(stage, group);
      ({ rounds, matches } = await generateSingleEliminationMatches(
        stage,
        group
      ));
      break;
    // case "double_elimination":
    //   return generateDoubleEliminationMatches(stage);
    //   break;
    // default:
    //   throw new Error("Invalid stage type");
  }

  return { rounds, matches };
}

async function generateSingleEliminationMatches(stage: any, group: any) {
  const size = stage.settings.size;
  const thirdDecider = stage.settings.third_decider;
  const threshold = stage.settings.threshold;
  const matches = [];

  const totalMatches = size - 1;
  let validCompetitors = size;

  if (threshold) {
    validCompetitors = Math.max(validCompetitors, threshold);
  }

  // Create rounds for single elimination
  const roundsData = [];
  let roundNumber = 1;
  let matchesInRound = size / 2;
  while (matchesInRound >= 1) {
    if (matchesInRound * 2 <= validCompetitors) {
      roundsData.push({
        stageId: stage.id,
        groupId: group.id,
        tournamentId: stage.tournamentId,
        number: roundNumber,
        name: `Round ${roundNumber}`,
        settings: {},
        match_settings: {},
      });
    }

    matchesInRound = matchesInRound / 2;
    roundNumber++;
  }

  // If thirdDecider option is enabled, add an additional round
  if (thirdDecider && size >= 4) {
    roundsData.push({
      stageId: stage.id,
      groupId: group.id,
      tournamentId: stage.tournamentId,
      number: roundNumber,
      name: `Round ${roundNumber}`,
      settings: {},
      match_settings: {},
    });
  }

  // Insert rounds into the database in bulk
  await prisma.round.createMany({
    data: roundsData,
    skipDuplicates: true,
  });

  // Create matches for each round
  // Note: since createMany does not return the created records, you need to query the rounds separately
  const rounds = await prisma.round.findMany({
    where: {
      stageId: stage.id,
      groupId: group.id,
      tournamentId: stage.tournamentId,
    },
  });

  for (let i = 0; i < rounds.length; i++) {
    const round = rounds[i];
    const numMatches = size / Math.pow(2, round.number);
    for (let j = 0; j < numMatches; j++) {
      matches.push({
        tournamentId: stage.tournamentId,
        stageId: stage.id,
        groupId: group.id,
        roundId: round.id,
        type: "duel",
        status: "pending",
        number: j + 1,
        settings: {},
        opponents: [],
      });
    }
  }

  // Insert matches into the database
  await prisma.match.createMany({
    data: matches,
  });

  return { rounds, matches };
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
