import prisma from "@/lib/prisma";
import { createBracket, createLinks } from "../result/page";
import SeedForm from "@/components/seeding/seed-form";

async function getStage(stageId: string) {
  return await prisma.stage.findFirst({
    where: {
      id: stageId,
    },
  });
}

async function getParticipants(tournamentId: string) {
  return await prisma.participant.findMany({
    where: {
      tournamentId: tournamentId,
    },
    select: {
      id: true,
      name: true,
      created_at: true,
    },
  });
}

async function getSeeds(stageId: string) {
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
    select: {
      opponents: true,
    },
  });

  // const seeds = firstRoundMatches
  //   .map((match) => match.opponents)
  //   .flat()
  //   .sort((a: any, b: any) => a.number - b.number)
  //   .map((opponent: any) => opponent.participant);

  const seeds = new Array(firstRoundMatches.length * 2).fill(null);

  firstRoundMatches.forEach((match) => {
    match.opponents.forEach((opponent: any) => {
      // seeds[opponent.number - 1] = opponent;
      if (opponent.participant) {
        seeds[opponent.number - 1] = opponent.participant;
      }
    });
  });

  return seeds;
}

interface Params {
  params: {
    tournamentId: string;
    stageId: string;
  };
}

export default async function StagePlacement({ params }: Params) {
  const stageData = getStage(params.stageId);
  const particpantsData = getParticipants(params.tournamentId);
  const seedsData = getSeeds(params.stageId);
  const [stage, participants, seeds] = await Promise.all([
    stageData,
    particpantsData,
    seedsData,
  ]);
  const stageSize: number = (stage?.settings as any)?.size;

  const bracket = createBracket(stage);
  const allMatches = bracket.reduce(
    (matches, round) => [...matches, ...round],
    []
  );
  const links = createLinks(bracket);

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex flex-wrap my-8">
        <h1 className="text-3xl font-medium">Placement</h1>
      </div>
      <div className="block relative flex-1 overflow-hidden h-full">
        <div className="grid h-full grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 lg:gap-8">
          <div className="md:col-span-1 xl:col-span-2">
            <div
              className="relative h-full flex flex-col bg-white text-start overflow-hidden rounded m-0 shadow"
              id="card"
            >
              <div className="p-5 border-b" id="card-header">
                <h2 className="text-2xl font-medium">Seeding</h2>
              </div>
              {/* CARD */}
              <SeedForm
                numSeeds={stageSize}
                participants={participants}
                stageId={stage!.id}
                seeds={seeds}
              />
            </div>
          </div>
          <div className="md:col-span-1 xl:col-span-3">
            <div
              className="relative flex flex-col bg-white text-left overflow-hidden rounded m-0 shadow"
              id="card"
            >
              <div className="p-5 border-b" id="card-header">
                <h2 className="text-2xl font-medium">Single Elimination</h2>
              </div>
              <div
                className="flex-1 p-5 overflow-hidden break-words"
                id="card-content"
              >
                {/* CARD */}
                <div className="block overflow-hidden break-words">
                  <div className="flex flex-wrap box-border min-w-max">
                    {bracket.map((round, i) => (
                      <div
                        key={`round-${i}`}
                        className="box-border min-w-0 mr-8"
                      >
                        <div className="min-w-[12rem] p-3 bg-neutral-100 rounded">
                          <h2 className="text-sm font-bold text-center">
                            Round {i + 1}
                          </h2>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    className="relative block"
                    style={{
                      width: bracket.length * 14 + "rem",
                      height: bracket[0].length * 5 + "rem",
                    }}
                  >
                    <div className="absolute z-[1] block" id="bracket-nodes">
                      {allMatches.map((match, i) => (
                        <div
                          key={`match-${i}`}
                          className="box-border min-w-0 mr-8 absolute"
                          style={{
                            left: match.left,
                            top: match.top,
                            width: "12rem",
                            height: "3.875rem",
                          }}
                        >
                          <div className="flex relative box-border min-w-[12rem] p-2 rounded border border-neutral-300">
                            <div
                              className="flex absolute -top-2 left-2 right-2 z-[1] text-xs"
                              id="header"
                            >
                              <div className="text-ellipsis overflow-hidden whitespace-nowrap bg-white px-1 mb-2 text-neutral-500">
                                {match.name}
                              </div>
                            </div>
                            <div
                              className="flex-[3_1_0%] block text-neutral-300 text-sm"
                              id="record"
                            >
                              <div className="flex items-center mb-[1px]">
                                <div className="">Team A</div>
                              </div>
                              <div className="flex items-center mb-0">
                                <div className="">Team B</div>
                              </div>
                            </div>
                            <div className="" id="state disabled"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <svg
                      className="absolute z-0 overflow-hidden w-full h-full"
                      x={0}
                      y={0}
                      viewBox={`0 0 ${bracket.length * 14000} ${
                        bracket[0].length * 5000
                      }`}
                      id="bracket-links"
                    >
                      {links.map((points, i) => (
                        <polyline
                          key={`link-${i}`}
                          className="fill-none stroke-[62.5] stroke-neutral-300"
                          points={points}
                          fill="none"
                        />
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
