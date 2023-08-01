import prisma from "@/lib/prisma";

async function getParticipants(id: string) {
  return await prisma.participant.findMany({
    where: {
      tournamentId: id,
    },
  });
}

interface Params {
  params: {
    tournamentId: string;
  };
}

export default async function Participants({ params }: Params) {
  const participants = await getParticipants(params.tournamentId);

  return (
    <ul className="">
      {participants.map((p, index) => (
        <li className="" key={index}>
          {p.name}
        </li>
      ))}
    </ul>
  );
}
