import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

interface Params {
  params: {
    id: string;
  };
}

type Participant = {
  id: string;
  name: string;
  created_at: string;
};

type Opponent = {
  forfeit: boolean;
  number: number;
  participant: Participant;
  position: number;
  rank: number | null;
  result: string;
  score: number | null;
};

type Data = {
  opponent1: {
    score: number | null;
    result: string;
  };
  opponent2: {
    score: number | null;
    result: string;
  };
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const matchId = params.id;
    const session = await getServerSession(authOptions);
    const data: Data = await request.json();
    // console.log(data);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const match = await prisma.match.findFirst({
      where: {
        id: matchId,
      },
      select: {
        status: true,
        settings: true,
        scheduled_datetime: true,
        public_note: true,
        private_note: true,
        opponents: true,
      },
    });

    if (data.opponent1 && match?.opponents[0]) {
      (match.opponents[0] as Opponent).score = data.opponent1.score;
      (match.opponents[0] as Opponent).result = data.opponent1.result;
    }

    if (data.opponent2 && match?.opponents[1]) {
      (match.opponents[1] as Opponent).score = data.opponent2.score;
      (match.opponents[1] as Opponent).result = data.opponent2.result;
    }

    if (data.opponent1.score === null && data.opponent2.score === null) {
      match!.status = "pending";
    } else if (data.opponent1.score !== null || data.opponent2.score !== null) {
      match!.status = "running";
    }

    if (data.opponent1.result !== "" || data.opponent2.result !== "") {
      match!.status = "completed";
    }

    // console.log(match?.status);

    const updateMatch = await prisma.match.update({
      where: {
        id: matchId,
      },
      data: {
        opponents: match?.opponents as Opponent[],
        status: match?.status,
      },
    });

    try {
      await handleSingleEliminationMatchProgression(
        matchId,
        updateMatch.status
      );
    } catch (error: any) {
      console.error("Error handling match progression:", error.message);
    }

    return NextResponse.json({ updateMatch });
  } catch (error) {
    return new Response("Error updating matches", { status: 500 });
  }
}

async function handleSingleEliminationMatchProgression(
  matchId: string,
  status: string
) {
  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
    },
    include: {
      round: {
        select: { id: true, number: true, name: true },
      },
    },
  });

  if (!match) {
    throw new Error("Match not found");
  }

  // Get previous match details to update report_closed status
  const previousRoundNumber = match.round.number - 1;

  const previousMatchesNumbers = [match.number * 2 - 1, match.number * 2];

  const previousRound = await prisma.round.findFirst({
    where: {
      stageId: match.stageId,
      number: previousRoundNumber,
    },
  });

  if (previousRound) {
    for (const matchNumber of previousMatchesNumbers) {
      const previousMatch = await prisma.match.findFirst({
        where: {
          roundId: previousRound.id,
          number: matchNumber,
        },
      });

      if (previousMatch) {
        const reportClosed = match.opponents.some(
          (opponent) => (opponent as Opponent).score !== null
        );

        await prisma.match.update({
          where: { id: previousMatch.id },
          data: { report_closed: reportClosed },
        });
      }
    }
  }

  // GET NEXT MATCH DETAILS
  const nextRoundNumber = match.round.number + 1;
  const nextRound = await prisma.round.findFirst({
    where: {
      stageId: match.stageId,
      number: nextRoundNumber,
    },
  });

  if (!nextRound) {
    console.log("This was the final round or next round not set up yet");
    return;
  }

  const nextMatchNumber = Math.ceil(match.number / 2);
  const nextMatch = await prisma.match.findFirst({
    where: {
      roundId: nextRound.id,
      number: nextMatchNumber,
    },
  });

  if (!nextMatch) {
    throw new Error("Next match not found");
  }

  const opponentPosition = match.number % 2 === 0 ? 1 : 0;

  if (status === "completed") {
    const winner = match.opponents.find(
      (opponent) => (opponent as Opponent).result === "win"
    ) as Opponent;
    if (!winner) {
      throw new Error("No winning team found");
    }

    // Reset opponent stats for next match
    const resetWinner: Opponent = {
      ...winner,
      number: 1,
      score: null,
      result: "",
      forfeit: false,
      rank: null,
      position: opponentPosition + 1, // or winner.number based on your needs
    };

    const updatedOpponents = [...nextMatch.opponents];
    updatedOpponents[opponentPosition] = resetWinner;
    // console.log(updatedOpponents);

    // Fill the array with empty objects
    for (let i = 0; i < 2; i++) {
      if (!updatedOpponents[i]) {
        updatedOpponents[i] = {};
      }
    }

    await prisma.match.update({
      where: { id: nextMatch.id },
      data: {
        opponents: updatedOpponents as Opponent[],
      },
    });
  } else if (status === "running" || status === "pending") {
    // const opponents = nextMatch.opponents.filter(
    //   (opponent, index) => index !== opponentPosition - 1
    // );

    const opponents = nextMatch.opponents.map((opponent, index) =>
      index === opponentPosition ? {} : opponent
    );

    await prisma.match.update({
      where: { id: nextMatch.id },
      data: {
        opponents: opponents as Opponent[],
      },
    });
  }
}
