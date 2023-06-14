import CreateTournamentForm from "@/components/create-tournament-form";
import prisma from "@/lib/prisma";
import Link from "next/link";

async function getDisciplines() {
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
      {/* <div className="mb-4">
        <Link href={"/tournaments"} className="text-sm hover:text-[#333]">
          <span aria-hidden="true">&larr;</span> Back
        </Link>
      </div> */}
      <h1 className="text-3xl font-medium">Create a new tournament</h1>
      <div className="w-full py-8">
        <CreateTournamentForm disciplines={disciplines} />
      </div>
    </div>
  );
}
