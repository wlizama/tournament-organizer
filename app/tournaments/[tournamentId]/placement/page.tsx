import prisma from "@/lib/prisma";
import Image from "next/image";
import { stageTypes } from "../stages/page";
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

export default async function Placement({ params }: Params) {
  const stages = await getStages(params.tournamentId);

  return (
    <div className="">
      <div className="relative my-10">
        <h1 className="text-3xl font-semibold">Placement</h1>
      </div>
      <ul
        role="list"
        className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3"
      >
        {stages.map((stage) => (
          <Link
            key={stage.id}
            href={`/tournaments/${params.tournamentId}/stages/${stage.id}/placement`}
          >
            <li className="col-span-1 flex flex-col rounded bg-white text-center shadow hover:outline hover:outline-2 hover:outline-neutral-500">
              <div className="flex flex-1 flex-col p-5">
                <Image
                  className="mx-auto h-32 w-32 flex-shrink-0"
                  src={stageTypes[stage.type].imgUrl}
                  width={128}
                  height={128}
                  alt=""
                />
                <h3 className="mt-6 text-xl font-medium text-gray-900">
                  {stage.number}. {stage.name}
                </h3>
                <dl className="mt-1 flex flex-grow flex-col justify-between">
                  <dt className="sr-only">Stage Type</dt>
                  <dd className="text-sm text-gray-500">
                    {stageTypes[stage.type].name}
                  </dd>
                </dl>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
