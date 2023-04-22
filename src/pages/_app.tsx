import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { Header } from '@/components'

const links = [
  { link: '/', label: 'Chat' },
  { link: '/query', label: 'Search' },
]

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <MantineProvider>
        <div>
          <div className='fixed top-0 w-full z-50 border h-0 border-black'>
            <Header links={links} />
          </div>
          <div className='mt-16'>
            <Component {...pageProps} />
          </div>
        </div>
        <Notifications />
      </MantineProvider>
    </RecoilRoot>
  )
}
