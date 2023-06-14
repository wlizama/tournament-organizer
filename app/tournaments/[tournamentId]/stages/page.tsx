import prisma from "@/lib/prisma";
import Link from "next/link";

async function getStages(tournamentId: string) {
  return await prisma.stage.findMany({
    where: {
      tournamentId: tournamentId,
    },
    orderBy: {
      number: "asc",
    },
  });
}

interface Params {
  params: {
    tournamentId: string;
  };
}

export default async function Structure({ params }: Params) {
  const stages = await getStages(params.tournamentId);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="text-3xl font-semibold">Structure</div>
      <div className="mt-8 font-medium">
        <div className="">
          <Link
            href={`/tournaments/${params.tournamentId}/stages/create`}
            className="underline"
          >
            Create new stage
          </Link>
        </div>
        <div className="mt-8">
          {stages.map((stage) => (
            <Link
              key={stage.id}
              href={`/tournaments/${params.tournamentId}/stages/${stage.id}/edit`}
            >
              <div className="mt-2">{`${stage.number}. ${stage.name}`}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
