import ParticipantSettings from "@/components/settings/participant-settings";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

async function getTournament(id: string, userId: string) {
  return await prisma.tournament.findFirst({
    where: {
      id: id,
      userId: userId,
    },
    select: {
      id: true,
      timezone: true,
      participant_type: true,
      check_in_enabled: true,
      check_in_participant_enabled: true,
      check_in_participant_start_datetime: true,
      check_in_participant_end_datetime: true,
      team_min_size: true,
      team_max_size: true,
    },
  });
}

interface Params {
  params: {
    tournamentId: string;
  };
}

export default async function EditRegistrationSettings({ params }: Params) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/auth/login");
  }

  const tournament = await getTournament(params.tournamentId, user.id);

  return <ParticipantSettings tournament={tournament} />;
}
