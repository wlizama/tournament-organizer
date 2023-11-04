'use client'

// FIX FORM VALIDATION FOR START AND END DATES
// END DATE CANNOT BE SET BEFORE START DATE

import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
// import { redirect, useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BsFillQuestionCircleFill } from 'react-icons/bs'
// import { TbLoader } from 'react-icons/tb'
import countryList from 'react-select-country-list'
import { useTimezoneSelect, allTimezones } from 'react-timezone-select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const labelStyle = 'original'
const timezones = allTimezones

interface GeneralSettingsProps {
  tournament: {
    id: string
    name: string
    full_name: string | null
    discipline: {
      name: string
    }
    platforms: string[]
    organization: string | null
    website: string | null
    size: number
    online: boolean | null
    location: string | null
    country: string | null
    scheduled_date_start: string | null
    scheduled_date_end: string | null
    timezone: string | null
    description: string | null
    prize: string | null
    rules: string | null
    contact: string | null
    discord: string | null
  } | null
}

export default function GeneralSettings({ tournament }: GeneralSettingsProps) {
  const countries = countryList().getData()
  const { options: tzOptions } = useTimezoneSelect({
    labelStyle,
    timezones,
  })
  const id = tournament?.id

  const [name, setName] = useState(tournament?.name)
  const [fullName, setFullName] = useState(tournament?.full_name)
  // const platforms
  const [organizer, setOrganizer] = useState(tournament?.organization)
  const [website, setWebsite] = useState(tournament?.website)
  const [size, setSize] = useState(tournament?.size)
  // const logo
  const [online, setOnline] = useState(tournament?.online)
  const [location, setLocation] = useState(tournament?.location)
  const [country, setCountry] = useState(tournament?.country)
  const [scheduledDateStart, setScheduledDateStart] = useState(
    tournament?.scheduled_date_start,
  )
  const [scheduledDateEnd, setScheduledDateEnd] = useState(
    tournament?.scheduled_date_end,
  )
  const [timezone, setTimezone] = useState(tournament?.timezone)
  const [description, setDescription] = useState(tournament?.description)
  const [prize, setPrize] = useState(tournament?.prize)
  const [rules, setRules] = useState(tournament?.rules)
  const [contact, setContact] = useState(tournament?.contact)
  const [discord, setDiscord] = useState(tournament?.discord)
  const [activeTab, setActiveTab] = useState('general')

  const [dateError, setDateError] = useState('')

  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false)
  // const router = useRouter()

  useEffect(() => {
    const isSubmitted = localStorage.getItem('submitted')
    if (isSubmitted) {
      setUpdateSuccess(true)
      localStorage.removeItem('submitted')
    }
  }, [])

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (scheduledDateEnd && scheduledDateStart) {
      const start = new Date(scheduledDateStart)
      const end = new Date(scheduledDateEnd)

      if (end < start) {
        setDateError('End date cannot be before start date')

        return
      }
    }

    try {
      const body = {
        id,
        name,
        fullName,
        // platforms,
        organizer,
        website,
        size,
        online,
        location,
        country,
        scheduledDateStart,
        scheduledDateEnd,
        timezone,
        description,
        prize,
        rules,
        contact,
        discord,
      }
      const res = await fetch(`/api/tournaments/${tournament?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        localStorage.setItem('submitted', 'true')
        window.location.reload()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div className=''>
        {/* <button
          className="text-sm mb-4 mt-8 hover:text-[#333]"
          onClick={() => {
            router.back();
          }}
        >
          <span aria-hidden="true">&larr;</span> Back
        </button> */}
        <div className='relative my-10'>
          <h1 className='text-3xl font-medium'>Ajustes Generales</h1>
        </div>
        {updateSuccess && (
          <div className='rounded-md bg-green-50 ring-1 ring-green-300 p-4 mt-4 mb-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <CheckCircleIcon
                  className='h-5 w-5 text-green-400'
                  aria-hidden='true'
                />
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-green-800'>
                  Actualizado correctamente
                </p>
              </div>
            </div>
          </div>
        )}
        <div className='shadow sm:mx-0 rounded bg-white'>
          <div className='py-3.5 px-6 text-left text-2xl'>
            <form onSubmit={submitData} method='PATCH'>
              <Tabs
                defaultValue='general'
                value={activeTab}
                className='w-full mt-2'
              >
                <TabsList className='max-w-full sm:w-auto justify-start overflow-x-auto'>
                  <TabsTrigger
                    value='general'
                    onClick={() => {
                      setActiveTab('general')
                    }}
                  >
                    General
                  </TabsTrigger>
                  <TabsTrigger
                    value='details'
                    onClick={() => {
                      setActiveTab('details')
                    }}
                  >
                    Detalles
                  </TabsTrigger>
                  <TabsTrigger
                    value='contact'
                    onClick={() => {
                      setActiveTab('contact')
                    }}
                  >
                    Contacto
                  </TabsTrigger>
                </TabsList>
                <TabsContent value='general'>
                  <div className='grid grid-cols-1 xl:grid-cols-2 xl:divide-x mt-6'>
                    <div className='xl:pr-6'>
                      <div className='gap-x-6 space-y-4'>
                        <div className=''>
                          <label
                            htmlFor='first-name'
                            className='block text-sm leading-6'
                          >
                            Nombre{' '}
                            <span className='text-xs text-orange-500'>
                              (requerido){' '}
                            </span>
                            <span className='text-xs text-neutral-500 font-light'>
                              (máximo 30 caracteres)
                            </span>
                          </label>
                          <input
                            type='text'
                            name='name'
                            id='name'
                            maxLength={30}
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value)
                            }}
                            className='block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6'
                          />
                        </div>

                        <div className=''>
                          <label
                            htmlFor='full-name'
                            className='block text-sm leading-6'
                          >
                            Nombre y apellidos{' '}
                            <span className='text-xs text-neutral-500 font-light'>
                              (máximo 80 caracteres)
                            </span>
                          </label>
                          <input
                            type='text'
                            name='full-name'
                            id='full-name'
                            maxLength={80}
                            value={fullName ?? ''}
                            onChange={(e) => {
                              setFullName(e.target.value)
                            }}
                            className='block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6'
                          />
                        </div>

                        <div className=''>
                          <label
                            htmlFor='discipline'
                            className='block text-sm leading-6 text-neutral-600'
                          >
                            Disciplina
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <BsFillQuestionCircleFill className='ml-2 h-[14px] w-[14px] text-[#555]' />
                                </TooltipTrigger>
                                <TooltipContent className='lg:ml-12'>
                                  <p className='w-80'>
                                    Esto no se puede cambiar dentro de un
                                    torneo. Si desea cambiar la disciplina, cree
                                    un nuevo torneo.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </label>
                          <select
                            id='discipline'
                            name='discipline'
                            disabled
                            className='block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6'
                          >
                            <option>{tournament?.discipline.name}</option>
                          </select>
                        </div>

                        <div className=''>
                          <label
                            htmlFor='country'
                            className='block text-sm leading-6 text-gray-900'
                          >
                            Platformas{' '}
                            <span className='text-xs text-orange-500'>
                              (requerido){' '}
                            </span>
                          </label>
                          <select
                            id='platform'
                            name='platform'
                            className='block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6'
                          >
                            <option></option>
                          </select>
                        </div>

                        <div className=''>
                          <label
                            htmlFor='organizer'
                            className='block text-sm leading-6 text-gray-900'
                          >
                            Organizador
                          </label>
                          <input
                            type='text'
                            name='organizer'
                            id='organizer'
                            value={organizer ?? ''}
                            onChange={(e) => {
                              setOrganizer(e.target.value)
                            }}
                            className='block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6'
                          />
                        </div>

                        <div className=''>
                          <label
                            htmlFor='website'
                            className='block text-sm leading-6 text-gray-900'
                          >
                            Website
                          </label>
                          <input
                            type='text'
                            name='website'
                            id='website'
                            value={website ?? ''}
                            onChange={(e) => {
                              setWebsite(e.target.value)
                            }}
                            placeholder='http://www.mywebsite.com'
                            className='block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6'
                          />
                        </div>

                        <div className=''>
                          <label
                            htmlFor='size'
                            className='block text-sm leading-6 text-gray-900'
                          >
                            Tamaño
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <BsFillQuestionCircleFill className='ml-2 h-[14px] w-[14px] text-[#555]' />
                                </TooltipTrigger>
                                <TooltipContent className='lg:ml-32'>
                                  <p className='w-80'>
                                    Número de participantes al inicio del del
                                    torneo.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span className='ml-1 text-xs text-orange-500'>
                              (requerido){' '}
                            </span>
                          </label>
                          <input
                            type='text'
                            name='size'
                            id='size'
                            value={size}
                            onChange={(e) => {
                              setSize(e.target.valueAsNumber)
                            }}
                            className='block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6'
                          />
                        </div>

                        <div className=''>
                          <label
                            htmlFor='photo'
                            className='block text-sm leading-6 text-gray-900'
                          >
                            Logo
                          </label>
                          <div className='mt-2 flex items-center gap-x-3'>
                            <UserCircleIcon
                              className='h-12 w-12 text-gray-300'
                              aria-hidden='true'
                            />
                            <button
                              type='button'
                              className='rounded bg-white px-2.5 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                            >
                              Cambiar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='mt-4 xl:-mt-2 xl:pl-6 space-y-4'>
                      <div className='pb-2'>
                        <label className='text-sm text-gray-900'>
                          ¿Jugado en Internet?
                        </label>
                        <fieldset className='mt-2'>
                          <legend className='sr-only'>
                            ¿Jugado en Internet?
                          </legend>
                          <div className='space-y-4 sm:flex sm:items-center sm:space-x-5 sm:space-y-0'>
                            <div className='flex items-center'>
                              <input
                                id='yes'
                                name='played-on-the-internet'
                                type='radio'
                                checked={online === true}
                                onChange={() => {
                                  setOnline(true)
                                }}
                                className='h-4 w-4 border-gray-300 text-[#111] focus:ring-0'
                              />
                              <label
                                htmlFor='yes'
                                className='ml-3 block text-sm leading-6 text-gray-900'
                              >
                                Si
                              </label>
                            </div>
                            <div className='flex items-center'>
                              <input
                                id='no'
                                name='played-on-the-internet'
                                type='radio'
                                checked={online === false}
                                onChange={() => {
                                  setOnline(false)
                                }}
                                className='h-4 w-4 border-gray-300 text-[#111] focus:ring-0'
                              />
                              <label
                                htmlFor='no'
                                className='ml-3 block text-sm leading-6 text-gray-900'
                              >
                                No
                              </label>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                      <div className=''>
                        <label
                          htmlFor='location'
                          className='block text-sm leading-6 text-gray-900'
                        >
                          Lugar
                        </label>
                        <input
                          type='text'
                          name='location'
                          id='location'
                          value={location ?? ''}
                          onChange={(e) => {
                            setLocation(e.target.value)
                          }}
                          className='block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                      <div className=''>
                        <label
                          htmlFor='country'
                          className='block text-sm leading-6 text-gray-900'
                        >
                          País
                        </label>
                        <select
                          id='platform'
                          name='platform'
                          value={country ?? 'Seleccione un país'}
                          onChange={(e) => {
                            setCountry(e.target.value)
                          }}
                          className='block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6'
                        >
                          <option disabled>Seleccione un país</option>
                          {countries.map((country) => (
                            <option
                              key={country.value}
                              value={country.value}
                              className=''
                            >
                              {country.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className=''>
                        <label
                          htmlFor='start-date'
                          className='block text-sm leading-6 text-gray-900'
                        >
                          Fecha de inicio
                        </label>
                        <input
                          type='date'
                          name='start-date'
                          id='start-date'
                          value={scheduledDateStart ?? ''}
                          onChange={(e) => {
                            setScheduledDateStart(e.target.value)
                          }}
                          className='block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                      <div className=''>
                        <label
                          htmlFor='end-date'
                          className='block text-sm leading-6 text-gray-900'
                        >
                          Fecha final
                        </label>
                        <input
                          type='date'
                          name='end-date'
                          id='end-date'
                          value={scheduledDateEnd ?? ''}
                          onChange={(e) => {
                            setScheduledDateEnd(e.target.value)
                          }}
                          className='block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                      {dateError && (
                        <p className='text-red-500 text-xs'>{dateError}</p>
                      )}
                      <div className=''>
                        <label
                          htmlFor='timezone'
                          className='block text-sm leading-6 text-gray-900'
                        >
                          Zona horaria
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <BsFillQuestionCircleFill className='ml-2 h-[14px] w-[14px] text-[#555]' />
                              </TooltipTrigger>
                              <TooltipContent className='lg:ml-12 xl:m-0'>
                                <p className='w-80'>
                                  Seleccione la zona horaria que desea utilizar
                                  para todas las fechas y horas del torneo.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <span className='ml-1 text-xs text-orange-500'>
                            (requerido){' '}
                          </span>
                        </label>
                        <select
                          id='timezone'
                          name='timezone'
                          value={timezone ?? ''}
                          onChange={(e) => {
                            setTimezone(e.target.value)
                          }}
                          className='block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6'
                        >
                          <option disabled className='text-neutral-300'>
                            Seleccione una zona horaria
                          </option>
                          {tzOptions.map((tz) => (
                            <option
                              key={tz.value}
                              value={tz.value}
                              className=''
                            >
                              {tz.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value='details'>
                  <div className='grid grid-cols-1 xl:grid-cols-2 xl:divide-x mt-6'>
                    <div className='xl:pr-6'>
                      <div className='gap-x-6 space-y-4'>
                        <div>
                          <label
                            htmlFor='description'
                            className='block text-sm leading-6 text-gray-900'
                          >
                            Descripción
                          </label>
                          <textarea
                            rows={10}
                            name='description'
                            id='description'
                            value={description ?? ''}
                            onChange={(e) => {
                              setDescription(e.target.value)
                            }}
                            className='block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6'
                          />
                        </div>

                        <div className=''>
                          <label
                            htmlFor='prize'
                            className='block text-sm leading-6 text-gray-900'
                          >
                            Premios
                          </label>
                          <textarea
                            rows={10}
                            name='prize'
                            id='prize'
                            value={prize ?? ''}
                            onChange={(e) => {
                              setPrize(e.target.value)
                            }}
                            className='block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6'
                          />
                        </div>
                      </div>
                    </div>

                    <div className='xl:mt-0 xl:pl-6'>
                      <div>
                        <label
                          htmlFor='rules'
                          className='block text-sm leading-6 text-gray-900'
                        >
                          Reglas
                        </label>
                        <textarea
                          rows={23}
                          name='rules'
                          id='rules'
                          value={rules ?? ''}
                          onChange={(e) => {
                            setRules(e.target.value)
                          }}
                          className='block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value='contact'>
                  <div className='grid grid-cols-1 xl:grid-cols-2 mt-6'>
                    <div className='gap-x-6 space-y-4'>
                      <div className=''>
                        <label
                          htmlFor='contact-email'
                          className='block text-sm leading-6 text-gray-900'
                        >
                          Correo electrónico de contacto
                        </label>
                        <input
                          type='email'
                          name='contact-email'
                          id='contact-email'
                          value={contact ?? ''}
                          onChange={(e) => {
                            setContact(e.target.value)
                          }}
                          className='block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6'
                        />
                      </div>

                      <div className=''>
                        <label
                          htmlFor='discord-link'
                          className='block text-sm leading-6 text-gray-900'
                        >
                          Enlace de invitación a Discord
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <BsFillQuestionCircleFill className='ml-2 h-[14px] w-[14px] text-[#555]' />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className='w-80'>
                                  Asegúrese de utilizar un{' '}
                                  <Link
                                    href={
                                      'https://support.discord.com/hc/en-us/articles/208866998-Instant-Invite-101'
                                    }
                                    className='text-blue-400'
                                    target='_blank'
                                  >
                                    Enlace de invitación permanente
                                  </Link>
                                  , para que no se invalide durante el torneo.
                                  torneo.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </label>
                        <input
                          type='text'
                          name='discord-link'
                          id='discord-link'
                          value={discord ?? ''}
                          onChange={(e) => {
                            setDiscord(e.target.value)
                          }}
                          className='block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className='mt-6 flex items-center justify-end gap-x-6'>
                <button
                  type='submit'
                  className='rounded bg-[#111] px-5 py-2 text-sm text-white shadow-sm hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                >
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
