import './globals.css'
import { type Metadata } from 'next'
// import { Inter } from 'next/font/google'
// import Head from 'next/head'
import Providers from './providers'

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | Tournament Organizer Platform',
    default: 'Tournament Organizer Platform',
  },
  description:
    'Tournament Organizer Platform is a platform for organizing eSports tournaments.',
  themeColor: '#317EFB',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en' className='h-full bg-neutral-100'>
      <body className='h-full'>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
