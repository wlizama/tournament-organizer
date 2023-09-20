import GeneralSettings from "@/components/settings/general-settings";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { notFound, redirect } from "next/navigation";

async function getTournament(id: string, userId: string) {
  return await prisma.tournament.findFirst({
    where: {
      id: id,
      userId: userId,
    },
    select: {
      id: true,
      name: true,
      full_name: true,
      discipline: {
        select: { name: true },
      },
      platforms: true,
      organization: true,
      website: true,
      size: true,
      // logo: true,
      online: true,
      location: true,
      country: true,
      scheduled_date_start: true,
      scheduled_date_end: true,
      timezone: true,
      description: true,
      prize: true,
      rules: true,
      contact: true,
      discord: true,
    },
  });
}

interface Params {
  params: {
    tournamentId: string;
  };
}

export default async function EditGeneralSettings({ params }: Params) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/auth/login");
  }

  const tournament = await getTournament(params.tournamentId, user.id);

  if (!tournament) {
    // notFound()
  }

  return <GeneralSettings tournament={tournament} />;
}
