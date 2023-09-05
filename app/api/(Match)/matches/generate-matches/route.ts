import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { stageId, seeding } = await request.json();
    // console.log(data);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const firstRoundMatches = await prisma.match.findMany({
      where: {
        stageId: stageId,
        round: {
          number: 1,
        },
      },
      orderBy: {
        number: "asc",
      },
    });

    if (firstRoundMatches.length !== seeding.length / 2) {
      return new Response(
        "Seeding information does not match the number of first-round matches.",
        { status: 400 }
      );
    }

    // Update the matches with the opponents
    const opponentsList = seedParticipants(seeding, firstRoundMatches);
    await Promise.all(
      opponentsList.map((item: any) =>
        prisma.match.update({
          where: {
            id: item.matchId,
          },
          data: {
            opponents: item.opponents,
          },
        })
      )
    );

    return NextResponse.json({ stageId, seeding });
  } catch (error) {
    return new Response("Error updating matches", { status: 500 });
  }
}

function seedParticipants(seeding: any, firstRoundMatches: any) {
  const seedingLength = seeding.length;
  const matchups = generateSingleEliminationMatchups(seedingLength);
  const opponentsList = [];

  for (let i = 0; i < matchups.length; i++) {
    const [seed1, seed2] = matchups[i];
    const participant1 = seeding[seed1 - 1];
    const participant2 = seeding[seed2 - 1];

    if (participant1 && participant2) {
      const opponents = [];
      if (participant1.started !== true) {
        opponents.push({
          number: seed1,
          position: seed1,
          result: "",
          rank: null,
          forfeit: false,
          score: null,
          participant: participant1,
        });
      }
      if (participant2.started !== true) {
        opponents.push({
          number: seed2,
          position: seed2,
          result: "",
          rank: null,
          forfeit: false,
          score: null,
          participant: participant2,
        });
      }
      if (opponents.length > 0) {
        // Check if opponents array is not empty
        opponentsList.push({
          matchId: firstRoundMatches[i].id,
          opponents,
        });
      }
    } else if (participant1 == null && participant2 == null) {
      opponentsList.push({
        matchId: firstRoundMatches[i].id,
        opponents: [{}, {}],
      });
    } else if (participant1 || participant2) {
      const opponents = [];
      if (participant1 && participant1.started !== true) {
        opponents.push({
          number: seed1,
          position: seed1,
          result: "",
          rank: null,
          forfeit: false,
          score: null,
          participant: participant1,
        });
      }
      if (participant2 && participant2.started !== true) {
        opponents.push({
          number: seed2,
          position: seed2,
          result: "",
          rank: null,
          forfeit: false,
          score: null,
          participant: participant2,
        });
      }
      if (opponents.length > 0) {
        opponentsList.push({
          matchId: firstRoundMatches[i].id,
          opponents,
        });
      }
    }
  }

  return opponentsList;
}

function generateSingleEliminationMatchups(teams: number): [number, number][] {
  const matchups: [number, number][] = [];

  if (teams === 4) {
    matchups.push([1, 4], [2, 3]);
  }

  if (teams === 8) {
    matchups.push([1, 8], [4, 5], [2, 7], [3, 6]);
  }

  if (teams === 16) {
    matchups.push(
      [1, 16],
      [8, 9],
      [4, 13],
      [5, 12],
      [2, 15],
      [7, 10],
      [3, 14],
      [6, 11]
    );
  }

  return matchups;
}
