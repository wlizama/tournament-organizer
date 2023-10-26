'use client'

import { SessionProvider } from 'next-auth/react'
import { SWRConfig } from 'swr'

interface Props {
  children?: React.ReactNode
}

export default function Providers({ children }: Props) {
  const options = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0,
    fetcher: async (url: RequestInfo | URL) =>
      await fetch(url).then(async (res) => await res.json()),
  }

  return (
    <SessionProvider>
      <SWRConfig value={options}>{children}</SWRConfig>
    </SessionProvider>
  )
}
