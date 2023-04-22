import { Chatbar, ApikeyBar, DropzoneButton, ChatSettings, UploadEmbeddingsSection, ProcessFileSection } from "@/components"
import { useEffect } from "react"
import { SimpleGrid } from "@mantine/core"
// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })



export default function Home() {

  return (
    <main className="flex min-h-screen flex-row p-4 gap-4">
      <Chatbar />
      <div className="flex flex-col gap-4">
        {/* <DropzoneButton /> */}
        <div className="flex flex-col gap-4">
          <ChatSettings />
          <div className="flex flex-row gap-4">
            <ApikeyBar />
          </div>
        </div>

      </div>
    </main>
  )
}
