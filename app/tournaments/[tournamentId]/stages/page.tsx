import Image from 'next/image'
import Link from 'next/link'
import { TbPlus } from 'react-icons/tb'
import { StageOptions } from '@/components/stages/stage-options'
import { StageSuccessAlert } from '@/components/stages/success-alert'
import prisma from '@/lib/prisma'

async function getStages(tournamentId: string) {
  return await prisma.stage.findMany({
    where: {
      tournamentId,
    },
    orderBy: {
      number: 'asc',
    },
  })
}

export const stageTypes: Record<string, Record<string, string>> = {
  single_elimination: {
    name: 'Eliminación simple',
    imgUrl:
      'https://organizer.toornament.com/structures/icon_single_elimination.svg?1686061578',
  },
  double_elimination: {
    name: 'Eliminación doble',
    imgUrl:
      'https://organizer.toornament.com/structures/icon_double_elimination.svg?1686903689',
  },
  bracket_groups: {
    name: 'Guantelete',
    imgUrl:
      'https://organizer.toornament.com/structures/icon_bracket_groups.svg?1686903689',
  },
  pools: {
    name: 'Grupo de rondas',
    imgUrl:
      'https://organizer.toornament.com/structures/icon_pools.svg?1686903689',
  },
  gauntlet: {
    name: 'Grupos de robin',
    imgUrl:
      'https://organizer.toornament.com/structures/icon_gauntlet.svg?1686903689',
  },
  league: {
    name: 'Liga',
    imgUrl:
      'https://organizer.toornament.com/structures/icon_league.svg?1686903689',
  },
  swiss: {
    name: 'Sistema suizo',
    imgUrl:
      'https://organizer.toornament.com/structures/icon_swiss.svg?1686903689',
  },
  simple: {
    name: 'Simple',
    imgUrl:
      'https://organizer.toornament.com/structures/icon_simple.svg?1686903689',
  },
  ffa_single_elimination: {
    name: 'FFA Eliminación directa',
    imgUrl:
      'https://organizer.toornament.com/structures/icon_ffa_single_elimination.svg?1686903689',
  },
  ffa_bracket_groups: {
    name: 'FFA Grupo de rondas',
    imgUrl:
      'https://organizer.toornament.com/structures/icon_ffa_bracket_groups.svg?1686903689',
  },
  ffa_league: {
    name: 'Liga FFA',
    imgUrl:
      'https://organizer.toornament.com/structures/icon_ffa_league.svg?1686903689',
  },
}

interface Params {
  params: {
    tournamentId: string
  }
}

export default async function Structure({ params }: Params) {
  const stages = await getStages(params.tournamentId)

  return (
    <div className=''>
      <div className='relative my-10'>
        <h1 className='text-3xl font-semibold'>Estructuras</h1>
      </div>
      <StageSuccessAlert />
      <ul
        role='list'
        className='mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3'
      >
        {stages.map((stage) => (
          <li
            key={stage.id}
            className='col-span-1 flex flex-col rounded bg-white text-center shadow'
          >
            <div className='flex flex-1 flex-col p-5'>
              <Image
                className='mx-auto h-32 w-32 flex-shrink-0'
                src={stageTypes[stage.type].imgUrl}
                width={128}
                height={128}
                alt=''
              />
              <h3 className='mt-6 text-xl font-medium text-gray-900'>
                {stage.number}. {stage.name}
              </h3>
              <dl className='mt-1 flex flex-grow flex-col justify-between'>
                <dt className='sr-only'>Tipo de fase</dt>
                <dd className='text-sm text-gray-500'>
                  {stageTypes[stage.type].name}
                </dd>
                <dt className='sr-only'>Configurar</dt>
                <dd className='flex mt-3 justify-center items-center'>
                  <Link
                    href={`/tournaments/${params.tournamentId}/stages/${stage.id}/edit`}
                  >
                    <button
                      type='button'
                      className='rounded bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-600 shadow-sm hover:bg-neutral-100'
                    >
                      Configurar
                    </button>
                  </Link>
                  <StageOptions
                    stageId={stage.id}
                    tournamentId={params.tournamentId}
                  />
                </dd>
              </dl>
            </div>
          </li>
        ))}
        <Link
          href={`/tournaments/${params.tournamentId}/stages/create`}
          className='col-span-1 flex flex-col rounded bg-white text-center shadow justify-center hover:ring-2 hover:ring-neutral-600'
        >
          <li>
            <div className='flex flex-1 flex-col p-5'>
              <TbPlus className='mx-auto h-32 w-32 flex-shrink-0 text-neutral-600' />
              <h3 className='mt-4 text-lg text-gray-900'>Crear nueva fase</h3>
            </div>
          </li>
        </Link>
      </ul>
    </div>
  )
}
