import { redirect } from "next/navigation";

import RegistrationSettings from "@/components/settings/registration-settings";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

async function getTournament(id: string, userId: string) {
  return await prisma.tournament.findFirst({
    where: {
      id: id,
      userId: userId,
    },
    select: {
      id: true,
      timezone: true,
      registration_enabled: true,
      registration_participant_email_enabled: true,
      registration_opening_datetime: true,
      registration_closing_datetime: true,
      registration_permanent_team_mandatory: true,
      registration_notification_enabled: true,
      registration_request_message: true,
      registration_acceptance_message: true,
      registration_refusal_message: true,
      registration_terms_enabled: true,
      registration_terms_url: true,
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

  return <RegistrationSettings tournament={tournament} />;
}
