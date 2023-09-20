import { TournamentNavigation } from "@/components/navigation/tournament-navigation";
import prisma from "@/lib/prisma";

async function getStage(tournamentId: string) {
  return await prisma.stage.findMany({
    where: {
      tournamentId: tournamentId,
    },
    select: {
      id: true,
      tournamentId: true,
      number: true,
      name: true,
    },
    orderBy: {
      number: "asc",
    },
  });
}

interface TournamentsLayoutProps {
  children: React.ReactNode;
  params: {
    tournamentId: string;
  };
}

export default async function TournamentLayout({
  children,
  params,
}: TournamentsLayoutProps) {
  const stages = await getStage(params.tournamentId);

  return (
    <>
      <div>
        <TournamentNavigation
          stages={stages}
          params={{
            tournamentId: params.tournamentId,
          }}
        />

        <main className="xl:pl-72 top-16 xl:top-0 right-0 bottom-0 left-0">
          <div className="h-full px-4 pb-4 sm:px-6 sm:pb-6 xl:px-10 xl:pb-10 overflow-y-scroll overflow-x-auto">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
