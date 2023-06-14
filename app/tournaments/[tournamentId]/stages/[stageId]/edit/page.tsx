import { SingleEliminationConfig } from "@/components/stage-type-configs/single-elimination";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

async function getStage(stageId: string, tournamentId: string) {
  return await prisma.stage.findFirst({
    where: {
      id: stageId,
      tournamentId: tournamentId,
    },
  });
}

interface Params {
  params: {
    tournamentId: string;
    stageId: string;
  };
}

export default async function EditStageSettings({ params }: Params) {
  const stage = await getStage(params.stageId, params.tournamentId);

  if (!stage) {
    // return notFound
    throw new Error("Stage not found");
  }

  if (stage.type === "single_elimination") {
    return <></>;
  }
}
