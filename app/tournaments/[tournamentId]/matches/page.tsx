import prisma from "@/lib/prisma";
import Link from "next/link";

async function getMatches(id: string) {
  return await prisma.match.findMany({
    where: {
      tournamentId: id,
    },
    include: {
      stage: true,
      group: true,
      round: true,
    },
    orderBy: [
      { stage: { number: "asc" } },
      { group: { number: "asc" } },
      { round: { number: "asc" } },
      { number: "asc" },
    ],
  });
}

async function getStage(id: string) {
  return await prisma.stage.findMany({
    where: {
      tournamentId: id,
    },
  });
}

interface Params {
  params: {
    tournamentId: string;
  };
}

export default async function Matches({ params }: Params) {
  const matchData = getMatches(params.tournamentId);
  const stageData = getStage(params.tournamentId);

  const [matches, stages] = await Promise.all([matchData, stageData]);
  // console.log(matches[0].opponents);
  // console.log(stages);

  return (
    <div className="">
      <div className="relative my-10">
        <h1 className="text-3xl font-semibold">Matches</h1>
      </div>

      <div className="font-medium space-y-2">
        <div className="">
          <Link href={``} className="underline">
            Overview
          </Link>
        </div>
      </div>
      <div className="font-medium space-y-2">
        {stages.map((stage) => (
          <div className="" key={stage.id}>
            <Link
              href={`/tournaments/${params.tournamentId}/stages/${stage.id}/result`}
              className="underline"
            >
              {stage.name}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8 ring-1 ring-gray-300 sm:mx-0 rounded bg-white">
        <div className="min-w-full divide-y divide-gray-300">
          <h1 className="py-5 pl-4 pr-3 text-left text-2xl sm:pl-6">
            List of Matches
          </h1>
          <ul
            role="list"
            className="p-4 divide-y divide-gray-100 overflow-hidden"
          >
            {matches.map((match) => (
              <li
                key={match.id}
                className="relative flex items-center rounded gap-x-6 p-5 hover:bg-gray-100 sm:px-6"
              >
                {/* Match number */}
                <div className="flex flex-col justify-center w-1/3 text-start">
                  <div className="">
                    Match #{match.stage.number}.{match.group.number}.
                    {match.round.number}.{match.number}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {match.stage.name} - Round {match.round.number}
                  </div>
                </div>
                {/* Opponent names */}
                <div className="grid flex-1 row-auto justify-stretch gap-[1px]">
                  <div className="flex flex-nowrap items-center p-0">
                    <div className="text-ellipsis overflow-hidden whitespace-nowrap flex-[3_1_0%] text-sm">
                      {match.opponents && match.opponents.length > 0 ? (
                        (match.opponents[0] as any).participant?.name
                      ) : (
                        <div className="text-neutral-300">To be determined</div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-nowrap items-center p-0">
                    <div className="text-ellipsis overflow-hidden whitespace-nowrap flex-[3_1_0%] text-sm">
                      {match.opponents && match.opponents.length > 0 ? (
                        (match.opponents[1] as any).participant?.name
                      ) : (
                        <div className="text-neutral-300">To be determined</div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Match status */}
                <div className="flex flex-col justify-center w-20 text-xs text-center">
                  To be played
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
