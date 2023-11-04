import { type Discipline } from "@prisma/client";
import CreateTournamentForm from "@/components/create-tournament-form";
import prisma from "@/lib/prisma";

async function getDisciplines(): Promise<Discipline[] | Response> {
  try {
    const res = await prisma.discipline.findMany();

    return res;
  } catch (error) {
    return new Response("Error retrieving disciplines", { status: 500 });
  }
}

export default async function CreateTournament() {
  const disciplines = await getDisciplines();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
      <h1 className="text-3xl font-medium">Crear nuevo torneo</h1>
      <div className="w-full py-8">
        <CreateTournamentForm disciplines={disciplines} />
      </div>
    </div>
  );
}
