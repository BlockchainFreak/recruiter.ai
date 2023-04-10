import { Chatbar, ApikeyBar } from "@/components" 
import { useEffect } from "react"
// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  return (
    <main className="flex min-h-screen flex-row p-4 justify-end">
      <Chatbar width={1024}/>
      <ApikeyBar />
    </main>
  )
}
