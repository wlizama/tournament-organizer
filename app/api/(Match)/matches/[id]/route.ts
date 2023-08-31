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
  forfeit: string;
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
    console.log(data);

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

    console.log(match?.status);

    const updateMatch = await prisma.match.update({
      where: {
        id: matchId,
      },
      data: {
        opponents: match?.opponents as Opponent[],
        status: match?.status,
      },
    });

    return NextResponse.json({ updateMatch });
  } catch (error) {
    return new Response("Error updating matches", { status: 500 });
  }
}
