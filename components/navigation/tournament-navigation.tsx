'use client'

import { Dialog, Disclosure, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Fragment, useCallback, useMemo, useState } from 'react'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface Props {
  params: {
    tournamentId: string
  }
  stages: Array<{
    id: string
    tournamentId: string
    number: number
    name: string
  }>
}

interface Navigation {
  name: string
  href?: string
  current: boolean
  children?: Navigation[]
}

export function TournamentNavigation({ stages, params }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()

  const getStagesNav = useCallback(
    (url: string) => {
      return stages.map((stage) => ({
        name: stage.number + '. ' + stage.name,
        href: `/tournaments/${stage.tournamentId}/stages/${stage.id}/${url}`,
        current:
          pathname ===
          `/tournaments/${stage.tournamentId}/stages/${stage.id}/${url}`,
      }))
    },
    [stages, pathname],
  )

  const navigation: Navigation[] = useMemo(
    () => [
      {
        name: 'Torneos',
        href: '/tournaments',
        current: pathname === '/tournaments',
      },
      {
        name: 'Ajustes',
        current: false,
        children: [
          {
            name: 'General',
            href: `/tournaments/${params.tournamentId}/edit`,
            current: pathname === `/tournaments/${params.tournamentId}/edit`,
          },
          {
            name: 'Registro',
            href: `/tournaments/${params.tournamentId}/registration/settings`,
            current:
              pathname ===
              `/tournaments/${params.tournamentId}/registration/settings`,
          },
          {
            name: 'Participantes',
            href: `/tournaments/${params.tournamentId}/participants/settings`,
            current:
              pathname ===
              `/tournaments/${params.tournamentId}/participants/settings`,
          },
        ],
      },
      {
        name: 'Estructuras',
        href: `/tournaments/${params.tournamentId}/stages`,
        current: pathname === `/tournaments/${params.tournamentId}/stages`,
      },

      {
        name: 'Posicionamiento',
        current: false,
        children: [
          {
            name: 'Visión general',
            href: `/tournaments/${params.tournamentId}/placement`,
            current:
              pathname === `/tournaments/${params.tournamentId}/placement`,
          },
          ...getStagesNav('placement'),
        ],
      },
      {
        name: 'Partidas',
        current: false,
        children: [
          {
            name: 'Visión general',
            href: `/tournaments/${params.tournamentId}/matches`,
            current: pathname.startsWith(
              `/tournaments/${params.tournamentId}/matches`,
            ),
          },
          ...getStagesNav('result'),
        ],
      },
    ],
    [pathname, params.tournamentId, getStagesNav],
  )

  const logout = useCallback(async () => {
    try {
      await signOut()
    } catch (error) {
      console.error(error)
    }
  }, [])

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-50 xl:hidden'
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter='transition-opacity ease-linear duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity ease-linear duration-300'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-900/80' />
          </Transition.Child>

          <div className='fixed inset-0 flex'>
            <Transition.Child
              as={Fragment}
              enter='transition ease-in-out duration-300 transform'
              enterFrom='-translate-x-full'
              enterTo='translate-x-0'
              leave='transition ease-in-out duration-300 transform'
              leaveFrom='translate-x-0'
              leaveTo='-translate-x-full'
            >
              <Dialog.Panel className='relative mr-16 flex w-full max-w-xs flex-1'>
                <Transition.Child
                  as={Fragment}
                  enter='ease-in-out duration-300'
                  enterFrom='opacity-0'
                  enterTo='opacity-100'
                  leave='ease-in-out duration-300'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <div className='absolute left-full top-0 flex w-16 justify-center pt-5'>
                    <button
                      type='button'
                      className='-m-2.5 p-2.5'
                      onClick={() => {
                        setSidebarOpen(false)
                      }}
                    >
                      <span className='sr-only'>Cerrar sidebar</span>
                      <XMarkIcon
                        className='h-6 w-6 text-white'
                        aria-hidden='true'
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-[#111] px-6 pb-2 ring-1 ring-white/10'>
                  <div className='flex h-16 shrink-0 items-center'>
                    <img
                      className='h-8 w-auto'
                      src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500'
                      alt='Your Company'
                    />
                  </div>
                  <nav className='flex flex-1 flex-col'>
                    <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                      <li>
                        <ul role='list' className='-mx-2 space-y-1'>
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <a
                                href={item.href}
                                className={classNames(
                                  item.current
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                                )}
                              >
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className='hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col'>
        <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-[#111] px-6'>
          <div className='flex h-16 shrink-0 items-center'>
            <h1 className='text-white text-2xl font-bold'>Organizer</h1>
          </div>
          <nav className='flex flex-1 flex-col'>
            <ul role='list' className='flex flex-1 flex-col gap-y-7'>
              <li>
                <ul role='list' className='-mx-2 space-y-1'>
                  {navigation.map((item) => (
                    <li key={item.name}>
                      {!item.children ? (
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-[#333] text-white'
                              : 'text-[#777] hover:text-white hover:bg-[#222]',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6',
                          )}
                        >
                          {item.name}
                        </a>
                      ) : (
                        <Disclosure
                          as='div'
                          key={item.name}
                          defaultOpen={item.children.some(
                            (child) => child.current,
                          )}
                        >
                          {({ open }) => (
                            <>
                              <Disclosure.Button
                                className={classNames(
                                  item.current
                                    ? 'bg-[#333] text-white'
                                    : 'text-[#777] hover:text-white hover:bg-[#222]',
                                  'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6',
                                )}
                              >
                                {item.name}
                                <ChevronRightIcon
                                  className={classNames(
                                    open ? 'rotate-90' : '',
                                    'ml-auto h-5 w-5 shrink-0',
                                  )}
                                  aria-hidden='true'
                                />
                              </Disclosure.Button>

                              <Disclosure.Panel as='ul' className='mt-1 px-2'>
                                {item.children?.map((subItem) => (
                                  <li key={subItem.name}>
                                    <Disclosure.Button
                                      as='a'
                                      href={subItem.href}
                                      className={classNames(
                                        subItem.current
                                          ? 'bg-[#333] text-white'
                                          : 'text-[#777] hover:text-white hover:bg-[#222]',
                                        'block rounded-md py-2 pr-2 pl-4 text-sm leading-6',
                                      )}
                                    >
                                      {subItem.name}
                                    </Disclosure.Button>
                                  </li>
                                ))}
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
              <button
                type='button'
                className='text-white underline'
                onClick={logout}
              >
                Cerrar sesión
              </button>
              <li className='-mx-6 mt-auto'>
                <a
                  href='#'
                  className='flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800'
                >
                  <img
                    className='h-8 w-8 rounded-full bg-gray-800'
                    src={session?.user.image as string}
                    alt='user-profile-image'
                  />

                  <span className='sr-only'>Your profile</span>
                  <span aria-hidden='true'>{session?.user.name}</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className='sticky top-0 z-40 flex items-center gap-x-6 bg-[#111] px-4 py-4 shadow-sm sm:px-6 xl:hidden'>
        <button
          type='button'
          className='-m-2.5 p-2.5 text-gray-400 xl:hidden'
          onClick={() => {
            setSidebarOpen(true)
          }}
        >
          <span className='sr-only'>AbrirOpen sidebar</span>
          <Bars3Icon className='h-6 w-6 text-white' aria-hidden='true' />
        </button>
        <div className='flex-1 text-md text-center font-semibold tracking-wide leading-6 text-white'>
          Organizer
        </div>
        <a href='#'>
          <span className='sr-only'>Tu perfil</span>
          <img
            className='h-8 w-8 rounded-full bg-gray-800'
            src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
            alt=''
          />
        </a>
      </div>
    </div>
  )
}
