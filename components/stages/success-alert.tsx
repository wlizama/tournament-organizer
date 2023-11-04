'use client'

import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'

export function StageSuccessAlert() {
  const [createSuccess, setCreateSuccess] = useState<boolean>(false)
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false)
  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false)

  useEffect(() => {
    const isCreated = localStorage.getItem('created')
    const isUpdated = localStorage.getItem('updated')
    const isDeleted = localStorage.getItem('deleted')

    if (isCreated) {
      setCreateSuccess(true)
      localStorage.removeItem('created')
    }
    if (isUpdated) {
      setUpdateSuccess(true)
      localStorage.removeItem('updated')
    }
    if (isDeleted) {
      setDeleteSuccess(true)
      localStorage.removeItem('deleted')
    }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (createSuccess) {
    return (
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
              Creada con éxito una etapa
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (updateSuccess) {
    return (
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
              Actualizada con éxito la etapa
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (deleteSuccess) {
    return (
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
              Se ha eliminado la etapa
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <></>
}
