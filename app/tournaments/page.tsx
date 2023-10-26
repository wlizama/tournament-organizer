import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import TournamentList from '@/components/tournament-list'
import { authOptions } from '@/lib/auth'

export default async function Tournaments() {
  const session = await getServerSession(authOptions)

  return (
    <div className='px-4 sm:px-6 lg:px-8'>
      <div className='sm:flex sm:items-center my-8'>
        <div className='sm:flex-auto'>
          <h1 className='text-4xl font-medium leading-6 text-gray-900'>
            Bienvenido {session?.user.name}
          </h1>
        </div>
        <div className='sm:ml-16 sm:mt-0 sm:flex-none'>
          <Link
            href={'/tournaments/create'}
            type='button'
            className='flex gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
          >
            <PlusIcon className='h-5 w-5' />
            Crear
          </Link>
        </div>
      </div>
      <TournamentList />
    </div>
  )
}
