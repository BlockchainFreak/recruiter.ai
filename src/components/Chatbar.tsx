import { useCallback, useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { openaiKeyState, settingsState } from "@/state"
import { Flex } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useForm, UseFormReturnType } from '@mantine/form';
import { AiOutlinePlusCircle, AiOutlineLoading } from "react-icons/ai";
import { streamChat } from "@/lib";
import SubmitButton from "./SubmitChatButton";
import Row from "./ChatRow"
import { notifications } from "@mantine/notifications";
import getEncoder from "@/lib/gptEncoder" 

export default function ChatBar({ width }: { width?: number }) {

    const openaiKey = useRecoilValue(openaiKeyState)

    const { temperature, maxTokenLimit } = useRecoilValue(settingsState)

    const [loading, setLoading] = useState(false)

    const [promptTokens, setPromptTokens] = useState(0)

    const form = useForm({
        initialValues: {
            role: ['USER'] as ("ASSISTANT" | "USER")[], 
            content: [''],
        }
    })

    const [debouncedFormContent] = useDebouncedValue(form.values.content, 1000)

    const len = form.values.role.length
    const lastRole = form.values.role[len - 1]
    const newRole = lastRole === 'USER' ? 'ASSISTANT' : 'USER'

    const messages = form.values.content.map((val, index) => ({
        role: form.values.role[index].toLocaleLowerCase() as 'user' | 'assistant',
        content: val,
    }))

    const handleSubmit = useCallback(async () => {
        setLoading(true)
        const itr = { first: true }
        await streamChat({
            apiKey: openaiKey,
            messages,
            temperature,
            maxTokens: maxTokenLimit,
            promptTokens,
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
            },
            onError: (err) => notifications.show({ title: "Error", message: err.message, color: "red" })
        })
        setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openaiKey, messages, temperature, maxTokenLimit, form])

    useEffect(() => {
        const encoder = getEncoder()
        const tokenArr = debouncedFormContent.map((val) => encoder.encode(val).length)
        const contentTokens = tokenArr.reduce((a, b) => a + b, 0)
        const offset = 3 + (5 * debouncedFormContent.length)
        setPromptTokens(contentTokens + offset)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedFormContent])

    return (
        <Flex
            className="border-dashed border border-slate-300 p-4 rounded-md"
            style={{ width: '70vw' }}
            direction="column"
        >
            <div className="overflow-y-scroll max-h-80" style={{ minHeight: "70vh" }}>
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
            </div>
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
                <div className="flex-grow" />
                <div className="bg-gray-200 py-2 px-4 h-8 my-auto rounded-lg">
                    <p className="text-xs text-gray-700">
                        <strong>{promptTokens}</strong>
                    </p>
                </div>
                <SubmitButton loading={loading} submitHandler={handleSubmit} />
            </Flex>
        </Flex>
    )
}
