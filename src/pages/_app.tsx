import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <MantineProvider>
        <Notifications />
        <Component {...pageProps} />
      </MantineProvider>
    </RecoilRoot>
  )
}
