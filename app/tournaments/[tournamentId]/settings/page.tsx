import Link from 'next/link'

interface Params {
  params: {
    tournamentId: string
  }
}

export default async function Tournament({ params }: Params) {
  return (
    <div className=''>
      <div className='relative my-10'>
        <h1 className='text-3xl font-semibold'>Ajustes</h1>
      </div>
      <div className='font-medium space-y-2'>
        <div className=''>
          <Link
            href={`/tournaments/${params.tournamentId}/edit`}
            className='underline'
          >
            General
          </Link>
        </div>
        {/* <div className="">
          <Link
            href={`/tournaments/${params.tournamentId}/settings/#`}
            className="underline"
          >
            Match
          </Link>
        </div> */}
        <div className=''>
          <Link
            href={`/tournaments/${params.tournamentId}/registration/settings`}
            className='underline'
          >
            Registratro
          </Link>
        </div>
        <div className=''>
          <Link
            href={`/tournaments/${params.tournamentId}/participants/settings`}
            className='underline'
          >
            Participantes
          </Link>
        </div>
      </div>
    </div>
  )
}
