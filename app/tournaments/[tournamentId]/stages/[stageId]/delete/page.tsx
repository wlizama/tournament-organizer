import { DeleteStageActionPanel } from "@/components/stages/delete-stage";
import prisma from "@/lib/prisma";

async function getStageName(stageId: string, tournamentId: string) {
  return await prisma.stage.findFirst({
    where: {
      id: stageId,
      tournamentId: tournamentId,
    },
    select: {
      id: true,
      name: true,
    },
  });
}

interface Params {
  params: {
    tournamentId: string;
    stageId: string;
  };
}

export default async function DeleteStage({ params }: Params) {
  const stage = await getStageName(params.stageId, params.tournamentId);

  if (!stage) {
    // return notFound
    throw new Error("Stage not found");
  }

  return (
    <DeleteStageActionPanel
      stageId={stage.id}
      stageName={stage.name}
      tournamentId={params.tournamentId}
    />
  );
}
