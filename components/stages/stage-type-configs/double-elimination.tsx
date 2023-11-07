'use client'

import { Listbox, Transition } from '@headlessui/react'
import {
  CheckCircleIcon,
  CheckIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/20/solid'
import { type Stage } from '@prisma/client'
import { useState, Fragment, useEffect } from 'react'
import { BsFillQuestionCircleFill } from 'react-icons/bs'
import { TbPencil, TbPlus } from 'react-icons/tb'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface Props {
  stage: any
  stages: Stage[]
  tournamentId: string
}

interface MatchSettings {
  format: {
    type: string
    options: Record<string, any>
  }
}

type MatchOption = Record<
  string,
  Array<{ value: string; label: string }> | Record<string, any>
>

const verboseNames: Record<string, string> = {
  calculation: 'Cálculo',
  interrupt:
    '¿Terminar automáticamente el partido cuando se conoce un ganador?',
  nb_match_sets: 'Número máximo de partidas',
}
const descriptions: Record<string, string> = {
  none: 'Establecer manualmente cada puntuación y resultado',
  score:
    'Establezca la puntuación de los partidos y el sistema calculará los resultados de los partidos. La puntuación del partido es el número de partidas ganadas y determina el ganador del partido.',
  outcome:
    'Establece los resultados de los partidos. La puntuación del partido se calcula a partir del número de partidas ganadas y determina el ganador del partido.',
}

export function DoubleEliminationConfig({
  stage,
  stages,
  tournamentId,
}: Props) {
  const type = 'double_elimination'
  const stageNumbers = stages.map((stage: any) => stage.number)
  const lastStageNumber = stageNumbers[stageNumbers.length - 1]
  const [number, setNumber] = useState(
    stage?.number || lastStageNumber + 1 || 1,
  )
  const [numberError, setNumberError] = useState<string | null>(null)
  const [name, setName] = useState(stage?.name || 'Playoffs')
  const [autoPlacement, setAutoPlacement] = useState(
    stage?.auto_placement_enabled || false,
  )
  const [settings, setSettings] = useState({
    size: stage?.settings.size || 0,
    skip_round1: stage?.settings.third_decider || false,
    grand_final: stage?.settings.grand_final || 'simple',
    threshold: stage?.settings.threshold || 0,
  })
  const [matchSettings, setMatchSettings] = useState<MatchSettings>({
    format: {
      type: stage?.match_settings.format.type || '',
      options: stage?.match_settings.format.options || {},
    },
  })
  const [matchOptions] = useState<MatchOption>({
    no_sets: {},
    inherited_format: {},
    single_set: {
      calculation: [
        {
          value: 'none',
          label: 'Ninguno',
          description: descriptions.none,
        },
        {
          value: 'score',
          label: 'Según puntuación',
          description: descriptions.score,
        },
        {
          value: 'outcome',
          label: 'Según resultados',
          description: descriptions.outcome,
        },
      ],
    },
    home_and_away: {
      calculation: [
        {
          value: 'none',
          label: 'Ninguna',
          description: descriptions.none,
        },
        {
          value: 'score',
          label: 'Según puntuación',
          description: descriptions.score,
        },
      ],
    },
    best_of: {
      nb_match_sets: 0,
      interrupt: false,
      calculation: [
        {
          value: 'none',
          label: 'Ninguna',
          description: descriptions.none,
        },
        {
          value: 'score',
          label: 'Según puntuación',
          description: descriptions.score,
        },
        {
          value: 'outcome',
          label: 'Según resultados',
          description: descriptions.outcome,
        },
      ],
    },
    fixed_sets: {
      nb_match_sets: 0,
      calculation: [
        {
          value: 'none',
          label: 'Ninguna',
          description: descriptions.none,
        },
        {
          value: 'score',
          label: 'Según puntuación',
          description: descriptions.score,
        },
        {
          value: 'outcome',
          label: 'Según resultados',
          description: descriptions.outcome,
        },
      ],
    },
  })
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false)

  useEffect(() => {
    const isUpdated = localStorage.getItem('updated')
    if (isUpdated) {
      setUpdateSuccess(true)
      localStorage.removeItem('updated')
    }
  }, [])

  function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = e.target

    setMatchSettings((prevMatchSettings) => ({
      ...prevMatchSettings,
      format: {
        ...prevMatchSettings.format,
        type: value,
        options: {}, // Reset options when the type changes
      },
    }))
  }

  function handleOptionChange(name: string, value: any) {
    setMatchSettings((prevMatchSettings) => ({
      format: {
        ...prevMatchSettings.format,
        options: {
          ...prevMatchSettings.format.options,
          [name]: value,
        },
      },
    }))
  }

  function validateNumber(value: number) {
    if (stage) {
      if (value !== stage.number && stageNumbers.includes(Number(value))) {
        return 'Este número de etapa ya está ocupado en este torneo'
      }
    } else {
      if (stageNumbers.includes(Number(value))) {
        return 'Este número de etapa ya está ocupado en este torneo'
      }
    }

    return null
  }

  const submitData = async (e: React.SyntheticEvent) => {
    const numberError = validateNumber(number)
    setNumberError(numberError)

    if (numberError) {
      e.preventDefault()
    }

    if (!numberError) {
      try {
        if (stage) {
          e.preventDefault()
          const body = {
            number,
            name,
            settings,
            matchSettings,
            autoPlacement,
          }
          const res = await fetch(`/api/stages/${stage.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
          if (res.ok) {
            localStorage.setItem('updated', 'true')
            window.location.reload()
          }
        } else {
          e.preventDefault()
          const body = {
            tournamentId,
            number,
            name,
            type,
            settings,
            matchSettings,
            autoPlacement,
          }
          const res = await fetch(`/api/stages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
          if (res.ok) {
            localStorage.setItem('created', 'true')
            window.location.href = `/tournaments/${tournamentId}/stages`
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const updateStageAndBack = async (e: React.SyntheticEvent) => {
    const numberError = validateNumber(number)
    setNumberError(numberError)

    if (numberError) {
      e.preventDefault()
    }

    if (!numberError) {
      try {
        e.preventDefault()
        const body = {
          number,
          name,
          settings,
          matchSettings,
          autoPlacement,
        }
        const res = await fetch(`/api/stages/${stage.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (res.ok) {
          localStorage.setItem('updated', 'true')
          window.location.href = `/tournaments/${tournamentId}/stages`
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const selectedOptions = matchOptions[matchSettings.format.type] || {}

  return (
    <div className='mx-auto max-w-4xl'>
      <div className='relative my-10'>
        <h1 className='text-3xl font-medium'>
          Configurar fase
          {stage ? (
            <span> &quot;{stage.name}&quot;</span>
          ) : (
            <span>: Eliminación Doble</span>
          )}
        </h1>
      </div>
      {updateSuccess && (
        <div className='rounded-md bg-green-50 ring-1 ring-green-300 p-4 mt-4 -mb-4'>
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
            <Tabs defaultValue='general' className='w-full mt-2'>
              <TabsList className='max-w-full sm:w-auto justify-start overflow-x-auto'>
                <TabsTrigger value='general'>General</TabsTrigger>
                <TabsTrigger value='advanced'>Avanzado</TabsTrigger>
                <TabsTrigger value='placement'>Posicionamiento</TabsTrigger>
                <TabsTrigger value='match-settings'>
                  Ajustes de encuentro
                </TabsTrigger>
              </TabsList>
              <TabsContent value='general'>
                <div className='grid grid-cols-1 xl:grid-cols-2 xl:divide-x mt-6'>
                  <div className='xl:pr-6'>
                    <div className='gap-x-2 space-y-4'>
                      <div className=''>
                        <label
                          htmlFor='number'
                          className='block text-sm leading-6 text-gray-900'
                        >
                          Número
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger disabled>
                                <BsFillQuestionCircleFill className='ml-2 h-[14px] w-[14px] text-[#555] cursor-pointer' />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className='w-80'>
                                  Número empleado para determinar el orden de
                                  las fases en el torneo. Dos fases no pueden
                                  tener el mismo número.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </label>
                        <input
                          type='number'
                          name='number'
                          id='number'
                          min={1}
                          max={30}
                          required
                          value={number || ''}
                          onChange={(e) => {
                            setNumber(e.target.valueAsNumber)
                          }}
                          // className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                          className={classNames(
                            numberError
                              ? 'focus:ring-2 focus:ring-red-500 ring-red-300'
                              : 'focus:ring-1 focus:ring-neutral-600 ring-gray-300',
                            'block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-inset sm:text-sm sm:leading-6',
                          )}
                        />
                        {numberError && (
                          <p
                            className='mt-2 text-sm text-red-600'
                            id='number-error'
                          >
                            {numberError}
                          </p>
                        )}
                      </div>
                      <div className=''>
                        <label
                          htmlFor='name'
                          className='block text-sm leading-6 text-gray-900'
                        >
                          Nombre{' '}
                          <span className='text-xs text-neutral-500 font-light'>
                            (30 caracteres máximo)
                          </span>
                        </label>
                        <input
                          type='text'
                          name='name'
                          id='name'
                          maxLength={30}
                          required
                          value={name || ''}
                          onChange={(e) => {
                            setName(e.target.value)
                          }}
                          className='block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='mt-4 xl:m-0 xl:pl-6 space-y-2'>
                    <div className=''>
                      <label
                        htmlFor='size'
                        className='block text-sm leading-6 text-gray-900'
                      >
                        Tamaño
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger disabled>
                              <BsFillQuestionCircleFill className='ml-2 h-[14px] w-[14px] text-[#555] cursor-pointer' />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className='w-80'>
                                Número de participantes al comienzo de la fase.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <input
                        type='number'
                        name='size'
                        id='size'
                        required
                        value={settings.size || ''}
                        onChange={(e) => {
                          setSettings({
                            ...settings,
                            size: e.target.valueAsNumber,
                          })
                        }}
                        className='block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6'
                      />
                    </div>

                    <div className='pt-2'>
                      <label
                        htmlFor='grand-final'
                        className='block text-sm leading-6 text-gray-900'
                      >
                        ¿Habilitar gran final?
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger disabled>
                              <BsFillQuestionCircleFill className='ml-2 h-[14px] w-[14px] text-[#555] cursor-pointer' />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className='w-80'>
                                Especifica el tipo de gran final que quieres en
                                esta fase de doble eliminación.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <select
                        id='grand-final'
                        name='grand-final'
                        className='block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6'
                        value={settings.grand_final || ''}
                        onChange={(e) => {
                          setSettings({
                            ...settings,
                            grand_final: e.target.value,
                          })
                        }}
                      >
                        <option value={'none'}>Ninguna</option>
                        <option value={'simple'}>Simple</option>
                        <option value={'double'}>Doble</option>
                      </select>
                    </div>

                    <div className='pb-2'>
                      <label className='text-sm text-gray-900'>
                        ¿Omitir primera serie?
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger disabled>
                              <BsFillQuestionCircleFill className='ml-2 h-[14px] w-[14px] text-[#555] cursor-pointer' />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className='w-80'>
                                Si la primera serie se omite, la mitad de los
                                participantes comenzarán en la ronda de
                                ganadores (clasificaciones más altas), y la
                                mitad comenzará en la ronda de perdedores
                                (clasificaciones más bajas).
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <fieldset>
                        <legend className='sr-only'>
                          ¿Omitir primera serie?
                        </legend>
                        <div className='mt-2 sm:flex sm:items-center sm:space-x-5 sm:space-y-0'>
                          <div className='flex items-center'>
                            <input
                              id='yes'
                              name='skip-round1'
                              type='radio'
                              checked={settings.skip_round1 === true}
                              onChange={() => {
                                setSettings({
                                  ...settings,
                                  skip_round1: true,
                                })
                              }}
                              className='h-4 w-4 border-gray-300 text-gray-900 focus:ring-0'
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
                              name='skip-round1'
                              type='radio'
                              checked={settings.skip_round1 === false}
                              onChange={() => {
                                setSettings({
                                  ...settings,
                                  skip_round1: false,
                                })
                              }}
                              className='h-4 w-4 border-gray-300 text-gray-900 focus:ring-0'
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
                  </div>
                </div>
              </TabsContent>
              <TabsContent value='advanced'>
                <div className='grid grid-cols-1 xl:grid-cols-2 mt-6'>
                  <div className='gap-x-6 space-y-4'>
                    <div className=''>
                      <label
                        htmlFor='threshold'
                        className='block text-sm leading-6 text-gray-900'
                      >
                        Umbral
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger disabled>
                              <BsFillQuestionCircleFill className='ml-2 h-[14px] w-[14px] text-[#555] cursor-pointer' />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className='w-80'>
                                Número de participantes que se clasificarán al
                                final de esta fase. Se eliminarán los encuentros
                                innecesarios.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <input
                        type='number'
                        name='threshold'
                        id='threshold'
                        min={0}
                        value={settings.threshold || 0}
                        onChange={(e) => {
                          setSettings({
                            ...settings,
                            threshold: e.target.valueAsNumber,
                          })
                        }}
                        className='block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6'
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value='placement'>
                <div className='mt-6'>
                  <div className='gap-x-2 space-y-4'>
                    <div className='pb-2 -mt-2'>
                      <label className='text-sm text-gray-900'>
                        ¿Posicionar participantes automáticamente?
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger disabled>
                              <BsFillQuestionCircleFill className='ml-2 h-[14px] w-[14px] text-[#555] cursor-pointer' />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className='w-80'>
                                Si se habilita esta opción, los participantes se
                                posicionarán automáticamente en esta fase usando
                                su orden de creación como criterio de
                                clasificación.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <fieldset className='mt-2'>
                        <legend className='sr-only'>
                          ¿Posicionar participantes automáticamente?
                        </legend>
                        <div className='space-y-4 sm:flex sm:items-center sm:space-x-5 sm:space-y-0'>
                          <div className='flex items-center'>
                            <input
                              id='yes'
                              name='auto-placement'
                              type='radio'
                              checked={autoPlacement === true}
                              onChange={() => {
                                setAutoPlacement(true)
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
                              name='auto-placement'
                              type='radio'
                              checked={autoPlacement === false}
                              onChange={() => {
                                setAutoPlacement(false)
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
                  </div>
                </div>
              </TabsContent>
              <TabsContent value='match-settings'>
                <div className='grid grid-cols-1 xl:grid-cols-2 mt-6'>
                  <div className='col-span-1'>
                    <label
                      htmlFor='format'
                      className='block text-sm leading-6 text-gray-900'
                    >
                      Formato
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger disabled>
                            <BsFillQuestionCircleFill className='ml-2 h-[14px] w-[14px] text-[#555] cursor-pointer' />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className='w-80'>
                              Define el formato de encuentro que quieras aplicar
                              a este elemento (torneo, fase, grupo, serie o
                              encuentro) del torneo, y a todos los elementos que
                              dependan del mismo.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <select
                      id='format'
                      name='format'
                      className='block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-[#111] sm:text-sm sm:leading-6'
                      value={matchSettings.format.type || ''}
                      onChange={handleTypeChange}
                    >
                      <option value='' disabled>
                        Selecciona a formato
                      </option>
                      <option value={'inherited_format'}>
                        Formato heredado
                      </option>
                      <option value={'no_sets'}>Sin partidas</option>
                      <option value={'single_set'}>Partida única</option>
                      <option value={'home_and_away'}>Ida y vuelta</option>
                      <option value={'best_of'}>Mejor de</option>
                      <option value={'fixed_sets'}>Partidas fijas</option>
                    </select>
                  </div>

                  {Object.entries(selectedOptions).map(([key, value]) => {
                    if (key === 'interrupt') {
                      return (
                        <div key={key} className='mt-2'>
                          <label
                            htmlFor={key}
                            className='text-sm text-gray-900'
                          >
                            {verboseNames[key] || key}
                          </label>
                          <fieldset className='mt-2'>
                            <legend className='sr-only'>
                              {verboseNames[key] || key}
                            </legend>
                            <div className='space-y-4 sm:flex sm:items-center sm:space-x-5 sm:space-y-0'>
                              <div className='flex items-center'>
                                <input
                                  type='radio'
                                  name={key}
                                  checked={
                                    matchSettings.format.options[key] === true
                                  }
                                  onChange={() => {
                                    setMatchSettings({
                                      ...matchSettings,
                                      format: {
                                        ...matchSettings.format,
                                        options: {
                                          ...matchSettings.format.options,
                                          interrupt: true,
                                        },
                                      },
                                    })
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
                                  type='radio'
                                  name={key}
                                  checked={
                                    matchSettings.format.options[key] === false
                                  }
                                  onChange={() => {
                                    setMatchSettings({
                                      ...matchSettings,
                                      format: {
                                        ...matchSettings.format,
                                        options: {
                                          ...matchSettings.format.options,
                                          interrupt: false,
                                        },
                                      },
                                    })
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
                      )
                    }

                    return (
                      <div key={key} className='xl:col-span-2 mt-2'>
                        <label htmlFor={key} className='text-sm'>
                          {verboseNames[key] || key}
                        </label>
                        {Array.isArray(value) ? (
                          <Listbox
                            value={matchSettings.format.options[key] || ''}
                            onChange={(newValue) => {
                              handleOptionChange(key, newValue)
                            }}
                          >
                            {({ open }) => (
                              <>
                                <div className='relative'>
                                  <Listbox.Button className='relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-1 focus:ring-[#111] text-base sm:text-sm sm:leading-6'>
                                    <span className='inline-flex w-full truncate'>
                                      <span>
                                        {value.find(
                                          (option) =>
                                            option.value ===
                                            matchSettings.format.options[key],
                                        )?.label || 'Select an option'}
                                      </span>
                                    </span>
                                    <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                                      <ChevronUpDownIcon
                                        className='h-5 w-5 text-gray-400'
                                        aria-hidden='true'
                                      />
                                    </span>
                                  </Listbox.Button>

                                  <Transition
                                    show={open}
                                    as={Fragment}
                                    leave='transition ease-in duration-100'
                                    leaveFrom='opacity-100'
                                    leaveTo='opacity-0'
                                  >
                                    <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                                      {value.map((option) => (
                                        <Listbox.Option
                                          key={option.value}
                                          className={({ active }) =>
                                            classNames(
                                              active
                                                ? 'bg-[#111] text-white'
                                                : 'text-gray-900',
                                              'relative cursor-default select-none py-2 pl-3 pr-9',
                                            )
                                          }
                                          value={option.value}
                                        >
                                          {({ selected, active }) => (
                                            <>
                                              <div className='block'>
                                                <span
                                                  className={classNames(
                                                    selected
                                                      ? 'font-semibold'
                                                      : 'font-normal',
                                                    'text-base',
                                                  )}
                                                >
                                                  {option.label}
                                                </span>
                                              </div>
                                              <div className=''>
                                                <span
                                                  className={classNames(
                                                    active
                                                      ? 'text-neutral-200'
                                                      : 'text-neutral-500',
                                                  )}
                                                >
                                                  {option.description}
                                                </span>
                                              </div>

                                              {selected ? (
                                                <span
                                                  className={classNames(
                                                    active
                                                      ? 'text-white'
                                                      : 'text-[#111]',
                                                    'absolute inset-y-0 right-0 flex items-center pr-4',
                                                  )}
                                                >
                                                  <CheckIcon
                                                    className='h-5 w-5'
                                                    aria-hidden='true'
                                                  />
                                                </span>
                                              ) : null}
                                            </>
                                          )}
                                        </Listbox.Option>
                                      ))}
                                    </Listbox.Options>
                                  </Transition>
                                </div>
                              </>
                            )}
                          </Listbox>
                        ) : (
                          <input
                            type='number'
                            id={key}
                            name={key}
                            min={0}
                            value={matchSettings.format.options[key] || ''}
                            onChange={(e) => {
                              handleOptionChange(key, e.target.valueAsNumber)
                            }}
                            className='block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6'
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>

            <div className='mt-6 flex items-center justify-end gap-x-2'>
              {stage ? (
                <>
                  <button
                    type='button'
                    className='rounded bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                  >
                    Atrás
                  </button>
                  <button
                    type='button'
                    className='flex items-center rounded bg-[#111] px-3 py-2 text-sm text-white shadow-sm hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                    onClick={updateStageAndBack}
                  >
                    <TbPencil className='h-5 w-5 mr-2' />
                    Actualizar + Atrás
                  </button>
                  <button
                    type='submit'
                    className='flex items-center rounded bg-[#111] px-3 py-2 text-sm text-white shadow-sm hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                  >
                    <TbPencil className='h-5 w-5 mr-2' />
                    Actualizar
                  </button>
                </>
              ) : (
                <button
                  type='submit'
                  className='flex items-center rounded bg-[#111] px-3 py-2 text-sm text-white shadow-sm hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                >
                  <TbPlus className='h-5 w-5 mr-2' />
                  Crear
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
