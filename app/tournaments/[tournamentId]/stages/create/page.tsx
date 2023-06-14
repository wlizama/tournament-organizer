import { DoubleEliminationConfig } from "@/components/stage-type-configs/double-elimination";
import { SingleEliminationConfig } from "@/components/stage-type-configs/single-elimination";
import prisma from "@/lib/prisma";
import Link from "next/link";

async function getStagesCount(id: string) {
  return await prisma.stage.count({
    where: {
      tournamentId: id,
    },
  });
}

interface Params {
  params: {
    tournamentId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CreateStage({ params, searchParams }: Params) {
  const stagesCount = await getStagesCount(params.tournamentId);
  const tournamentId = params.tournamentId;
  const matchType = searchParams.match_type;
  const stageType = searchParams.stage_type;

  if (matchType === "duel") {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-3xl font-semibold">Select a Stage Type</div>
        <div className="mt-8 font-medium space-y-2">
          <div className="">
            <Link
              href={`/tournaments/${params.tournamentId}/stages/create?stage_type=single_elimination`}
              className="underline"
            >
              Single Elimination
            </Link>
          </div>
          <div className="">
            <Link
              href={`/tournaments/${params.tournamentId}/stages/create?stage_type=double_elimination`}
              className="underline"
            >
              Double Elimination
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (stageType === "single_elimination") {
    return (
      <SingleEliminationConfig
        stagesCount={stagesCount}
        tournamentId={tournamentId}
      />
    );
  }

  if (stageType === "double_elimination") {
    return <DoubleEliminationConfig />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="text-3xl font-semibold">Select a Match Type</div>
      <div className="mt-8 font-medium space-y-2">
        <div className="">
          <Link
            href={`/tournaments/${params.tournamentId}/stages/create?match_type=duel`}
            className="underline"
          >
            Duel
          </Link>
        </div>
        <div className="">
          <Link
            href={`/tournaments/${params.tournamentId}/stages/create?match_type=ffa`}
            className="underline"
          >
            FFA
          </Link>
        </div>
      </div>
    </div>
  );
}
