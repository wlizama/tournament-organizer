import prisma from "@/lib/prisma";
import Link from "next/link";

async function getMatches(id: string) {
  return await prisma.match.findMany({
    where: {
      tournamentId: id,
    },
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
  console.log(matches);
  console.log(stages);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="text-3xl font-semibold">Match Overview</div>
      <div className="mt-8 font-medium space-y-2">
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
    </div>
  );
}
