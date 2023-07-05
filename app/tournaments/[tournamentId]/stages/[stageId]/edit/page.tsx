import { DoubleEliminationConfig } from "@/components/stages/stage-type-configs/double-elimination";
import { GauntletConfig } from "@/components/stages/stage-type-configs/gauntlet";
import { SingleEliminationConfig } from "@/components/stages/stage-type-configs/single-elimination";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

async function getStages(stageId: string, tournamentId: string) {
  return await prisma.$transaction([
    prisma.stage.findMany({ where: { tournamentId: tournamentId } }),
    prisma.stage.findFirst({
      where: { id: stageId, tournamentId: tournamentId },
    }),
  ]);
}

interface Params {
  params: {
    tournamentId: string;
    stageId: string;
  };
}

export default async function EditStageSettings({ params }: Params) {
  const data = await getStages(params.stageId, params.tournamentId);
  const stages = data[0];
  const stage = data[1];

  if (!stage) {
    // return notFound
    throw new Error("Stage not found");
  }

  if (stage.type === "single_elimination") {
    return (
      <SingleEliminationConfig
        stage={stage}
        stages={stages}
        tournamentId={params.tournamentId}
      />
    );
  }

  if (stage.type === "double_elimination") {
    return (
      <DoubleEliminationConfig
        stage={stage}
        stages={stages}
        tournamentId={params.tournamentId}
      />
    );
  }

  if (stage.type === "gauntlet") {
    return (
      <GauntletConfig
        stage={stage}
        stages={stages}
        tournamentId={params.tournamentId}
      />
    );
  }
  return;
}
