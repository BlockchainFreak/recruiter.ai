import { useState } from "react"
import { useRecoilValue } from "recoil"
import { openaiKeyState } from "@/state"
import { Flex } from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { AiOutlinePlusCircle, AiOutlineLoading } from "react-icons/ai";
import { streamChat } from "@/lib";
import SubmitButton from "./SubmitChatButton";
import Row from "./ChatRow"

export default function ChatBar({ width }: { width: number }) {

    const openaiKey = useRecoilValue(openaiKeyState)

    const [loading, setLoading] = useState(false)

    const form = useForm({
        initialValues: {
            role: ['USER'] as ("ASSISTANT" | "USER")[],
            content: [''],
        }
    })

    const len = form.values.role.length
    const lastRole = form.values.role[len - 1]
    const newRole = lastRole === 'USER' ? 'ASSISTANT' : 'USER'

    const messages = form.values.content.map((val, index) => ({
        role: form.values.role[index].toLocaleLowerCase() as 'user' | 'assistant',
        content: val,
    }))

    return (
        <Flex
            className="border-dashed border border-black p-4 m-10"
            style={{ width }}
            direction="column"
        >
            {
                form.values.role.map((val, index) => (
                    <Row
                        key={index}
                        index={index}
                        form={form}
                        loading={loading}
                    />
                ))
            }
            <Flex
                direction="row"
                gap="md"
                justify="flex-start"
                align="center"
                className="py-3 px-4 hover:bg-slate-100"
                onClick={() => {
                    if (loading) return
                    form.insertListItem('role', newRole, len)
                    form.insertListItem('content', '', len)
                }}
            >
                <AiOutlinePlusCircle />
                <p>
                    Add Message
                </p>
            </Flex>
            <div className="flex flex-row-reverse">
                <SubmitButton loading={loading} submitHandler={async () => {
                    setLoading(true)
                    const itr = { first: true }
                    await streamChat({
                        apiKey: openaiKey,
                        messages,
                        appender: token => {
                            if (itr.first) {
                                const len = form.values.role.length
                                form.insertListItem('role', "ASSISTANT", len)
                                form.insertListItem('content', '', len)
                                itr.first = false
                            }
                            // append token to content of the last message's content
                            form.setValues((oldState) => {
                                if (oldState.content) {
                                    oldState.content[len] += token
                                }
                                return ({ ...oldState, content: [...oldState.content as any] })
                            })
                        }
                    })
                    setLoading(false)
                }} />
            </div>
        </Flex>
    )
}
