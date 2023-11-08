// import UpdateSuccess from "@/components/updateSuccess";
import Link from 'next/link'
import prisma from '@/lib/prisma'

async function getMatches(id: string) {
  return await prisma.match.findMany({
    where: {
      tournamentId: id,
    },
    include: {
      stage: true,
      group: true,
      round: true,
    },
    orderBy: [
      { stage: { number: 'asc' } },
      { group: { number: 'asc' } },
      { round: { number: 'asc' } },
      { number: 'asc' },
    ],
  })
}

interface Participant {
  id: string
  name: string
  created_at: string
}

interface Opponent {
  forfeit: string
  number: number
  participant: Participant
  position: number
  rank: number | null
  result: string
  score: number | null
}

interface Params {
  params: {
    tournamentId: string
  }
}

export default async function Matches({ params }: Params) {
  const matches = await getMatches(params.tournamentId)

  return (
    <div className=''>
      <div className='relative my-10'>
        <h1 className='text-3xl font-semibold'>Partidas</h1>
      </div>

      {/* <UpdateSuccess /> */}

      <div className='ring-1 ring-gray-300 sm:mx-0 rounded bg-white'>
        <div className='min-w-full divide-y divide-gray-300'>
          <h1 className='p-5 text-left text-2xl font-medium'>
            Lista de partidas
          </h1>
          <ul
            role='list'
            className='p-4 divide-y divide-gray-100 overflow-hidden'
          >
            {matches.map((match) => (
              <Link
                key={match.id}
                href={`/tournaments/${params.tournamentId}/matches/${match.id}`}
              >
                <li className='relative flex items-center rounded gap-x-6 p-5 hover:bg-gray-100 sm:px-6'>
                  {/* Match number */}
                  <div className='flex flex-col justify-center w-1/3 text-start'>
                    <div className=''>
                      Partida #{match.stage.number}.{match.group.number}.
                      {match.round.number}.{match.number}
                    </div>
                    <div className='text-xs text-neutral-500'>
                      {match.stage.name} - Round {match.round.number}
                    </div>
                  </div>
                  {/* Opponent names */}
                  <div className='grid flex-1 row-auto justify-stretch gap-[1px]'>
                    <div className='flex flex-nowrap items-center p-0'>
                      <div className='text-ellipsis overflow-hidden whitespace-nowrap flex-[3_1_0%] text-sm'>
                        {match.opponents[0] &&
                        Object.keys(match.opponents[0] as Opponent).length !==
                          0 ? (
                          (match.opponents[0] as Opponent).participant?.name
                        ) : (
                          <div className='text-neutral-300'>Por determinar</div>
                        )}
                      </div>
                    </div>
                    <div className='flex flex-nowrap items-center p-0'>
                      <div className='text-ellipsis overflow-hidden whitespace-nowrap flex-[3_1_0%] text-sm'>
                        {match.opponents[1] &&
                        Object.keys(match.opponents[1] as Opponent).length !==
                          0 ? (
                          (match.opponents[1] as Opponent).participant.name
                        ) : (
                          // <>testing</>
                          <div className='text-neutral-300'>Por determinar</div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Match status */}
                  <div className='flex flex-col justify-center w-20 text-xs text-center'>
                    {match.opponents.length === 2 &&
                    match.status !== 'completed' ? (
                      <div className=''>Por jugar</div>
                    ) : match.status === 'completed' ? (
                      <div className='text-green-500'>Completado</div>
                    ) : (
                      <div className='text-neutral-500'>Esperando</div>
                    )}
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
