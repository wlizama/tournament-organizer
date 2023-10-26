'use client'

import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { IconLoader } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'

export default function TournamentList() {
  const { data: tournaments, error, isLoading } = useSWR('/api/tournaments')

  return (
    <div className='-mx-4 mt-8 ring-1 ring-gray-300 sm:mx-0 rounded bg-white'>
      <div className='min-w-full divide-y divide-gray-300'>
        <div className='py-3.5 pl-4 pr-3 text-left text-2xl sm:pl-6'>
          Torneos
        </div>
        <ul
          role='list'
          className='p-4 divide-y divide-gray-100 overflow-hidden'
        >
          {isLoading && (
            <div className='flex mt-1 items-center justify-center'>
              <IconLoader className='h-5 w-5 animate-spin' />
            </div>
          )}
          {!isLoading &&
            !error &&
            tournaments.map((tournament: any) => (
              <li
                key={tournament.id}
                className='relative flex justify-between rounded gap-x-6 px-4 py-5 hover:bg-gray-100 sm:px-6'
              >
                <div className='flex gap-x-4'>
                  {tournament.imageUrl ? (
                    <Image
                      className='h-12 w-12 flex-none rounded bg-gray-50'
                      src={tournament.imageUrl}
                      alt=''
                      width={48}
                      height={48}
                    />
                  ) : (
                    <Image
                      src='/img/videogames.png'
                      className='h-12 w-12 flex-none rounded'
                      width={48}
                      height={48}
                      alt=''
                    />
                  )}
                  <div className='min-w-0 flex-auto'>
                    <p className='text-lg leading-6 text-gray-900'>
                      <Link href={`/tournaments/${tournament.id}`}>
                        <span className='absolute inset-x-0 -top-px bottom-0' />
                        {tournament.name}
                      </Link>
                    </p>
                    <p className='flex text-xs leading-5 truncate text-neutral-500'>
                      {tournament.discipline.name} ({tournament.platforms[0]})
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-x-4'>
                  <div className='hidden sm:flex sm:flex-col sm:items-end'>
                    <p className='text-sm leading-6 text-gray-900'>
                      Agosto 3 - Agosto 14, 2022
                    </p>
                    {/* {person.lastSeen ? (
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Last seen{" "}
                      <time dateTime={person.lastSeenDateTime}>
                        {person.lastSeen}
                      </time>
                    </p>
                  ) : ( */}
                    <div className='mt-1 flex items-center gap-x-1.5'>
                      <div className='flex-none rounded-full bg-emerald-500/20 p-1'>
                        <div className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
                      </div>
                      <p className='text-xs leading-5 text-gray-500'>
                        Completado
                      </p>
                    </div>
                    {/* )} */}
                  </div>
                  <ChevronRightIcon
                    className='h-5 w-5 flex-none text-gray-400'
                    aria-hidden='true'
                  />
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
