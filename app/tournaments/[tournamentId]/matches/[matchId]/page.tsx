import MatchForm from "@/components/match-form";
import prisma from "@/lib/prisma";
import { Group, Match, Round, Stage } from "@prisma/client";

async function getMatch(matchId: string) {
  return await prisma.match.findFirst({
    where: {
      id: matchId,
    },
    include: {
      stage: {
        select: {
          id: true,
          number: true,
          name: true,
        },
      },
      group: {
        select: {
          id: true,
          number: true,
          name: true,
        },
      },
      round: {
        select: {
          id: true,
          number: true,
          name: true,
        },
      },
      tournament: {
        select: {
          timezone: true,
        },
      },
    },
    orderBy: [
      { stage: { number: "asc" } },
      { group: { number: "asc" } },
      { round: { number: "asc" } },
      { number: "asc" },
    ],
  });
}

interface Params {
  params: {
    tournamentId: string;
    matchId: string;
  };
}

type MMatch = Match & {
  stage: {
    id: string;
    number: number;
    name: string;
  };
  group: {
    id: string;
    number: number;
    name: string;
  };
  round: {
    id: string;
    number: number;
    name: string;
  };
  tournament: {
    timezone: string;
  };
};

export default async function Match({ params }: Params) {
  const match = (await getMatch(params.matchId)) as MMatch;

  return <MatchForm match={match} />;
}
