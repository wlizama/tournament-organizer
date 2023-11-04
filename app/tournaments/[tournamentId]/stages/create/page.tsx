import Image from 'next/image'
import Link from 'next/link'
import { FaUserFriends, FaUsers } from 'react-icons/fa'
import { DoubleEliminationConfig } from '@/components/stages/stage-type-configs/double-elimination'
import { GauntletConfig } from '@/components/stages/stage-type-configs/gauntlet'
import { SingleEliminationConfig } from '@/components/stages/stage-type-configs/single-elimination'
import prisma from '@/lib/prisma'

async function getStages(id: string) {
  return await prisma.stage.findMany({
    where: {
      tournamentId: id,
    },
    orderBy: {
      number: 'asc',
    },
  })
}

const duelStageTypes = [
  {
    name: 'single_elimination',
    verboseName: 'Eliminación simple',
    description:
      'Ronda en la que los participantes son eliminados tras una derrota. ',
    imgUrl:
      'https://organizer.toornament.com/structures/icon_single_elimination.svg?1686061578',
  },
  {
    name: 'double_elimination',
    verboseName: 'Eliminación doble',
    description:
      'Ronda en la que los participantes deben perder dos veces para ser eliminados.',
    imgUrl:
      'https://organizer.toornament.com/structures/icon_double_elimination.svg?1686903689',
  },
  {
    name: 'gauntlet',
    verboseName: 'Guantelete',
    description:
      'Ronda en las que los participantes de menor clasificación juegan progresivamente contra contrincantes de una clasificación superior.',
    imgUrl:
      'https://organizer.toornament.com/structures/icon_gauntlet.svg?1686903689',
  },
  {
    name: 'bracket_groups',
    verboseName: 'Grupo de rondas',
    description:
      'Grupos en los que los participantes juegan en pequeñas rondas de doble eliminación o eliminación simple.',
    imgUrl:
      'https://organizer.toornament.com/structures/icon_bracket_groups.svg?1686903689',
  },
  {
    name: 'pools',
    verboseName: 'Grupos de robin',
    description:
      'Pequeños grupos en los que los participantes juegan contra el resto de jugadores de su grupo.',
    imgUrl:
      'https://organizer.toornament.com/structures/icon_pools.svg?1686903689',
  },
  {
    name: 'league',
    verboseName: 'Liga',
    description:
      'Grandes divisiones en las que los participantes juegan contra el resto de participantes de su división.',
    imgUrl:
      'https://organizer.toornament.com/structures/icon_league.svg?1686903689',
  },
  {
    name: 'swiss',
    verboseName: 'Sistema suizo',
    description:
      'Fase en la que los participantes juegan contra contrincantes lo más similares posible a su nivel de habilidad.',
    imgUrl:
      'https://organizer.toornament.com/structures/icon_swiss.svg?1686903689',
  },
]

const ffaStageTypes = [
  {
    name: 'simple',
    verboseName: 'Simple',
    description: 'Fase consistente en una sola serie de encuentros.',
    imgUrl:
      'https://organizer.toornament.com/structures/icon_simple.svg?1686903689',
  },
  {
    name: 'ffa_single_elimination',
    verboseName: 'FFA Eliminación directa',
    description:
      'Ronda con encuentros en los que un número determinado de participantes se clasifica para la siguiente serie.',
    imgUrl:
      'https://organizer.toornament.com/structures/icon_ffa_single_elimination.svg?1686903689',
  },
  {
    name: 'ffa_bracket_groups',
    verboseName: 'FFA Grupo de rondas',
    description:
      'Grupos en los que los participantes juegan encuentros de todos contra todos en rondas de eliminación simple.',
    imgUrl:
      'https://organizer.toornament.com/structures/icon_ffa_bracket_groups.svg?1686903689',
  },
  {
    name: 'ffa_league',
    verboseName: 'Liga FFA',
    description:
      'Divisiones en las que los participantes ganan puntos en los partidos para un ranking.',
    imgUrl:
      'https://organizer.toornament.com/structures/icon_ffa_league.svg?1686903689',
  },
]

interface Params {
  params: {
    tournamentId: string
  }
  searchParams: Record<string, string | string[] | undefined>
}

export default async function CreateStage({ params, searchParams }: Params) {
  const stages = await getStages(params.tournamentId)
  const tournamentId = params.tournamentId
  const matchType = searchParams.match_type
  const stageType = searchParams.stage_type
  const stage = null

  if (matchType === 'duel') {
    return (
      <div className=''>
        <div className='relative my-10'>
          <h1 className='text-3xl font-semibold'>
            Seleccionar un tipo de fase
          </h1>
        </div>
        <ul
          role='list'
          className='mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3'
        >
          {duelStageTypes.map((stage) => (
            <Link
              key={stage.name}
              href={`/tournaments/${params.tournamentId}/stages/create?stage_type=${stage.name}`}
              className='col-span-1 flex flex-col rounded bg-white text-left shadow justify-center hover:ring-2 hover:ring-neutral-600'
            >
              <li>
                <div className='flex flex-1 flex-col p-5'>
                  <Image
                    className='mx-auto h-32 w-32 flex-shrink-0'
                    src={stage.imgUrl}
                    width={128}
                    height={128}
                    alt=''
                  />
                  <h3 className='mt-6 text-xl font-medium text-gray-900'>
                    {stage.verboseName}
                  </h3>
                  <dl className='mt-1 flex flex-grow flex-col justify-between'>
                    <dt className='sr-only'>Tipo de fase</dt>
                    <dd className='text-gray-500'>{stage.description}</dd>
                  </dl>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    )
  }

  if (matchType === 'ffa') {
    return (
      <div className=''>
        <div className='relative my-10'>
          <h1 className='text-3xl font-semibold'>
            Seleccionar un tipo de fase
          </h1>
        </div>
        <ul
          role='list'
          className='mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3'
        >
          {ffaStageTypes.map((stage) => (
            <Link
              key={stage.name}
              href={`/tournaments/${params.tournamentId}/stages/create?stage_type=${stage.name}`}
              className='col-span-1 flex flex-col rounded bg-white text-left shadow justify-center hover:ring-2 hover:ring-neutral-600'
            >
              <li>
                <div className='flex flex-1 flex-col p-5'>
                  <Image
                    className='mx-auto h-32 w-32 flex-shrink-0'
                    src={stage.imgUrl}
                    width={128}
                    height={128}
                    alt=''
                  />
                  <h3 className='mt-6 text-xl font-medium text-gray-900'>
                    {stage.verboseName}
                  </h3>
                  <dl className='mt-1 flex flex-grow flex-col justify-between'>
                    <dt className='sr-only'>Tipo de fase</dt>
                    <dd className='text-gray-500'>{stage.description}</dd>
                  </dl>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    )
  }

  if (stageType === 'single_elimination') {
    return (
      <SingleEliminationConfig
        stage={stage}
        stages={stages}
        tournamentId={tournamentId}
      />
    )
  }

  if (stageType === 'double_elimination') {
    return (
      <DoubleEliminationConfig
        stage={stage}
        stages={stages}
        tournamentId={tournamentId}
      />
    )
  }

  if (stageType === 'gauntlet') {
    return (
      <GauntletConfig
        stage={stage}
        stages={stages}
        tournamentId={tournamentId}
      />
    )
  }

  // TODO: implement the rest of the stage types
  if (stageType === 'bracket_groups') {
    return <>bracket groups config</>
  }

  if (stageType === 'pools') {
    return <>round-robin groups config</>
  }

  if (stageType === 'league') {
    return <>league config</>
  }

  if (stageType === 'swiss') {
    return <>swiss system config</>
  }

  if (stageType === 'simple') {
    return <>simple config</>
  }

  if (stageType === 'ffa_single_elimination') {
    return <>ffa single elimination config</>
  }

  if (stageType === 'ffa_bracket_groups') {
    return <>ffa bracket groups config</>
  }

  if (stageType === 'ffa_league') {
    return <>ffa league config</>
  }

  return (
    <div className=''>
      <div className='relative my-10'>
        <h1 className='text-3xl font-semibold'>
          Seleccionar un tipo de encuentro
        </h1>
      </div>
      <ul role='list' className='mt-8 grid grid-cols-1 gap-8 xl:grid-cols-2'>
        <Link
          href={`/tournaments/${params.tournamentId}/stages/create?match_type=duel`}
          className='col-span-1 flex flex-col rounded bg-white text-center shadow justify-center hover:ring-2 hover:ring-neutral-600'
        >
          <li>
            <div className='flex flex-1 flex-col p-5'>
              <div className='flex'>
                <div className='hidden sm:flex mr-4 p-8 flex-shrink-0 self-center'>
                  <FaUserFriends className='h-16 w-16 text-neutral-600' />
                </div>
                <div className='text-left'>
                  <h4 className='text-2xl font-medium'>Duelo</h4>
                  <p className='mt-1'>
                    Los encuentros con dos participantes (sean dos jugadores o
                    dos equipos) requieren una estructura de fases tipo duelo
                    como doble eliminación, eliminación simple, guantelete,
                    robin o sistema suizo.
                  </p>
                </div>
              </div>
            </div>
          </li>
        </Link>
        <Link
          href={`/tournaments/${params.tournamentId}/stages/create?match_type=ffa`}
          className='col-span-1 flex flex-col rounded bg-white text-center shadow justify-center hover:ring-2 hover:ring-neutral-600'
        >
          <li>
            <div className='flex flex-1 flex-col p-5'>
              <div className='flex'>
                <div className='hidden sm:flex mr-4 p-8 flex-shrink-0 self-center'>
                  <FaUsers className='h-16 w-16 text-neutral-600' />
                </div>
                <div className='text-left'>
                  <h4 className='text-2xl font-medium'>FFA</h4>
                  <p className='mt-1'>
                    Los encuentros de más de dos participantes, normalmente
                    llamados encuentros de todos contra todos (FFA), requieren
                    una estructura con fases específicamente diseñada para
                    ellos.
                  </p>
                </div>
              </div>
            </div>
          </li>
        </Link>
      </ul>
    </div>
  )
}
