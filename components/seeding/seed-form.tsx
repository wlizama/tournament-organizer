'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { TbCheck, TbPencil, TbPlus, TbX } from 'react-icons/tb'
import TeamSelectModal from './team-select-modal'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface Props {
  numSeeds: number
  participants: Participant[]
  stageId: string
  seeds: any
}

interface Participant {
  id: string
  name: string
  created_at: Date
  started?: boolean
}

export default function SeedForm({
  numSeeds,
  participants,
  stageId,
  seeds,
}: Props) {
  const {
    formState: { isSubmitting, isSubmitSuccessful },
    handleSubmit,
    reset,
  } = useForm()
  const onSubmit = async (seeding: any) => {
    try {
      const body = { stageId, seeding }
      const res = await fetch(`/api/matches/generate-matches`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const result = await res.json()
      console.log(result)
    } catch (error) {
      console.error('Error submitting seeding data: ', error)
    }
  }

  const [seededParticipants, setSeededParticipants] = useState<
    Array<Participant | null>
  >(Array(numSeeds).fill(null))
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [currentSeedIndex, setCurrentSeedIndex] = useState<number | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<Participant | null>(null)
  const [isHovering, setIsHovering] = useState<number | null>(null)

  const formRef = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    setSeededParticipants(seeds)
  }, [seeds])

  const handleOpenModal = (index: number) => {
    setCurrentSeedIndex(index)
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedTeam(null)
  }

  const handleSelectTeam = (team: Participant) => {
    setSelectedTeam(team)
  }

  const handleAdd = () => {
    if (currentSeedIndex !== null && selectedTeam) {
      const newSeededParticipants = [...seededParticipants]
      const index = newSeededParticipants.findIndex(
        (p) => p && p.id === selectedTeam.id,
      )
      if (index !== -1) {
        newSeededParticipants[index] = null
      }
      newSeededParticipants[currentSeedIndex] = selectedTeam
      setSeededParticipants(newSeededParticipants)
      handleCloseModal()
    }
  }

  const handleRemove = (index: number) => {
    const newSeededParticipants = [...seededParticipants]
    newSeededParticipants[index] = null
    setSeededParticipants(newSeededParticipants)
  }

  // console.log(seededParticipants);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(async () =>
        // onSubmit(seededParticipants.filter(Boolean) as Participant[])
        {
          await onSubmit(seededParticipants)
        },
      )}
      className='relative h-full box-border flex flex-col m-0 overflow-hidden text-start'
    >
      {/* CARD CONTENT */}
      <div className='flex-1 p-5 overflow-auto break-words border-b h-full'>
        <div className='flex flex-wrap flex-col m-0 text-sm cursor-pointer'>
          <div className='block min-w-[7rem]'>
            <div className='flex items-center min-h-[1rem] p-1 cursor-pointer border-b text-neutral-500'>
              <div className='text-center w-8'>#</div>
              <div className='ml-1 w-8'></div>
              <div className='flex-[10_1_0%] text-left w-0 ml-1 overflow-ellipsis whitespace-nowrap'>
                Nombre
              </div>
              <div className='w-14'></div>
            </div>

            {seededParticipants.map((seededParticipant, index) => (
              <div
                key={index}
                // className="flex items-center min-h-[35px] p-1 border-b hover:bg-neutral-100"
                className={classNames(
                  seededParticipant?.started !== true
                    ? 'text-black'
                    : 'text-neutral-300 cursor-not-allowed',
                  'flex items-center min-h-[35px] p-1 border-b hover:bg-neutral-100',
                )}
                onMouseEnter={() => {
                  setIsHovering(index)
                }}
                onMouseLeave={() => {
                  setIsHovering(null)
                }}
              >
                <div className='box-content ml-0 w-8 text-center'>
                  {index + 1}
                </div>
                {seededParticipant ? (
                  <>
                    {seededParticipant.started !== true && (
                      <div className='block box-content ml-1'>
                        <button
                          type='button'
                          className='py-0 text-center w-8 align-middle'
                          onClick={() => {
                            handleOpenModal(index)
                          }}
                        >
                          <TbPencil className='h-5 w-5 ml-2 text-blue-500 stroke-2' />
                        </button>
                      </div>
                    )}
                    <div className='flex-[10_1_0%] text-left w-0 ml-1 overflow-ellipsis whitespace-nowrap box-content'>
                      {seededParticipant.name}
                    </div>
                    {isHovering === index &&
                      seededParticipant.started !== true && (
                        <div className='box-content ml-1'>
                          <button
                            type='button'
                            className='py-0 text-center align-middle'
                            onClick={() => {
                              handleRemove(index)
                            }}
                          >
                            <TbX className='h-5 w-5 ml-2 stroke-2' />
                          </button>
                        </div>
                      )}
                  </>
                ) : (
                  <div className='block box-content ml-1'>
                    <button
                      type='button'
                      className='py-0 text-center w-8 align-middle'
                      onClick={() => {
                        handleOpenModal(index)
                      }}
                    >
                      <TbPlus className='h-5 w-5 ml-2 text-green-500 stroke-2' />
                    </button>
                  </div>
                )}
              </div>
            ))}
            {/* <button type="submit">Seed Teams</button> */}
            {isSubmitting && <div className='mt-4'>(...guardando)</div>}
            {isSubmitSuccessful && (
              <div className='mt-4'>
                <div className='text-green-500 font-bold'>GUARDADO!</div>
                {/* <div className="ml-4">OK</div> */}
                <button
                  className=''
                  onClick={() => {
                    reset()
                  }}
                >
                  OK
                </button>
              </div>
            )}

            {modalVisible && (
              <TeamSelectModal
                participants={participants}
                handleAdd={handleAdd}
                handleCloseModal={handleCloseModal}
                selectedTeam={selectedTeam}
                handleSelectTeam={handleSelectTeam}
                open={modalVisible}
                setOpen={setModalVisible}
                seededParticipants={seededParticipants}
              />
            )}
          </div>
        </div>
      </div>
      {/* FOOTER */}
      <div className='block p-4'>
        <div className='flex flex-wrap box-border justify-end'>
          <button
            type='submit'
            className='flex justify-center rounded-md bg-[#111] px-3 py-2 text-white shadow-sm hover:bg-[#333]'
          >
            <div className='flex items-center gap-2'>
              <TbCheck className='h-5 w-5' />
              Guardar
            </div>
          </button>
        </div>
      </div>
    </form>
  )
}
