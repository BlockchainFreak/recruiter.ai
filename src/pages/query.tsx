import { useEffect, useState, useRef } from "react"
import { useClipboard } from '@mantine/hooks'
import Link from "next/link"
import db from "@/sdk"
import { TextInput, Button, Menu, Loader, Table, Slider } from "@mantine/core"
import roles from "@/job_roles.json"
import { embedding } from "@/lib/getEmbeddingsForText"
import { useRecoilState, useRecoilValue } from "recoil"
import { pineconeApiKeyState, openaiKeyState } from "@/state"
import { notifications } from "@mantine/notifications";


export default function QueryPage() {

    const [role, setRole] = useState("")

    const [topK, setTopK] = useState(10)

    const [query, setQuery] = useState("")

    const [loading, setLoading] = useState(false)

    const [disturb, setDisturb] = useState(false)

    const clipboard = useClipboard({ timeout: 1000 })

    const [results, setResults] = useState([] as { id: string, score: number }[])

    const [targetDirectory, setTargetDirectory] = useState("")

    const [openaiKey, setOpenaiKey] = useRecoilState(openaiKeyState)
    const [pineconeApiKey, setPineconeApiKey] = useRecoilState(pineconeApiKeyState)

    const filtered_roles = Object.keys(roles).filter((_role: any) => _role.toLowerCase().includes(role?.toLowerCase()))

    const queryStr = `Job Role: ${role}\n\n${query}`

    const handleQuery = async () => {
        setLoading(true)
        try {
            const embeddings = await embedding({ input: queryStr, apiKey: openaiKey })
            notifications.show({ title: "OpenAI", message: "Embeddings generated" })

            const response = await db.queryResume({ embeddings, apiKey: pineconeApiKey, topK })

            console.log("response:", response?.result?.matches)

            setResults(response?.result?.matches ?? [])

            notifications.show({ title: "Pinecone", message: "Query successful" })

        }
        catch (err) {
            console.error(err)
            notifications.show({ title: "Error", message: "Something went wrong" })
        }
        setLoading(false)
    }

    console.log(roles)

    useEffect(() => {
        const keywords = (roles as any)[role]
        if (keywords)
            setQuery(keywords.join(", "))
    }, [role])

    useEffect(() => {

        const targetDir = localStorage.getItem("targetDirectory")
        if (targetDir && targetDir !== targetDirectory) {
            setTargetDirectory(targetDir)
        }

        const alreadyStoredOpenaiKey = window.localStorage.getItem('openai-api-key')
        if (alreadyStoredOpenaiKey && alreadyStoredOpenaiKey !== openaiKey) {
            setOpenaiKey(alreadyStoredOpenaiKey)
        }
        const alreadyStoredPineconeKey = window.localStorage.getItem('pinecone-api-key')
        if (alreadyStoredPineconeKey && alreadyStoredPineconeKey !== pineconeApiKey) {
            setPineconeApiKey(alreadyStoredPineconeKey)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="flex flex-row gap-8 bg-slate-100 absolute h-full">
            <div className="w-96 flex flex-col gap-4 p-4 h-full">
                <Menu shadow="md" width={200} opened={filtered_roles.length > 0 && disturb && role.length > 0}>
                    <Menu.Target>
                        <TextInput
                            label="Job role"
                            placeholder="Select job role"
                            value={role}
                            onChange={(e) => { setRole(e.currentTarget.value); setDisturb(true) }}
                            multiple
                        />
                    </Menu.Target>
                    <Menu.Dropdown>
                        {
                            filtered_roles.map((role: any) => (
                                <Menu.Item
                                    onClick={() => { setRole(role); setDisturb(false); setQuery(((roles as any)[role] ?? []).join(", ")) }}
                                    key={role}>{role}</Menu.Item>
                            ))
                        }
                    </Menu.Dropdown>
                </Menu>

                <textarea
                    placeholder="Enter query"
                    value={query}
                    onChange={(e) => setQuery(e.currentTarget.value)}
                    rows={6}
                />

                <h6>Top K Results: <strong>{topK}</strong></h6>
                <Slider
                    label="Top K"
                    value={topK}
                    onChange={setTopK}
                    min={1}
                    max={40}
                />

                <TextInput
                    label="Target Directory"
                    placeholder="Enter target directory"
                    value={targetDirectory}
                    onChange={(e) => {setTargetDirectory(e.currentTarget.value); localStorage.setItem("targetDirectory", e.currentTarget.value)}}
                />

                <Button
                    className="w-full bg-blue-500"
                    onClick={handleQuery}
                    disabled={loading}
                >{loading ? <Loader /> : "Query"}</Button>
            </div>

            <div className="flex flex-col p-4 overflow-y-auto" style={{ width: '600px', height: '100%' }}>
                <strong> Results: </strong>
                <br className="my-2" />
                <Table striped highlightOnHover withBorder withColumnBorders>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Resume</th>
                            <th>Match Score</th>
                            <th>Copy Path</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            results.map((result, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        {result.id.replace(".txt", "").replace(".pdf", "")}
                                    </td>
                                    <td>{(result.score * 100).toFixed(2)} %</td>
                                    <td>
                                        <Button
                                            onClick={() => {
                                                clipboard.copy(`file:///${targetDirectory}/${result.id.replace(".txt", "").replace(".pdf", "")}.pdf`)
                                                notifications.show({ title: "Copied", message: "Copied to clipboard" })
                                            }}
                                            className="w-full border border-blue-500 text-blue-500 hover:text-white"
                                        >{clipboard.copied ? "Copied" : "Copy"}
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
        </div>
    )

}