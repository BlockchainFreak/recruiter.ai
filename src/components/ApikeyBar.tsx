import { useRecoilState } from 'recoil'
import { openaiKeyState, pineconeApiKeyState } from '@/state'
import { Drawer, Button, TextInput, Flex, Stack, ActionIcon } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useDisclosure } from '@mantine/hooks'
import { Configuration, OpenAIApi } from 'openai'
import { useCallback, useEffect, useState } from 'react'
import { SiOpenai } from "react-icons/si"
import { MdCloudDone } from "react-icons/md"
import { IconReload } from "@tabler/icons-react"
import db, { Usage } from "@/sdk"
import { PineconeClient } from '@pinecone-database/pinecone'


export default function ApikeyBar() {

    const [opened, { open, close }] = useDisclosure()

    const [usage, setUsage] = useState<{
        embeddings: Usage, chat: Usage
    } | null>(null)

    const [openaiKey, setOpenaiKey] = useRecoilState(openaiKeyState)
    const [pineconeApiKey, setPineconeApiKey] = useRecoilState(pineconeApiKeyState)

    const Validate = useCallback(async (openaiKey: string, pineconeApiKey: string) => {

        const openaiClient = new OpenAIApi(new Configuration({ apiKey: openaiKey }))
        // check if openai key is valid
        notifications.show({ id: 'openai', title: 'OpenAI API Key', message: 'Validating...', autoClose: false, icon: <SiOpenai /> })
        openaiClient.listModels()
            .then(r => {
                // update key to local storage
                window.localStorage.setItem('openai-api-key', openaiKey)
                notifications.update({ id: 'openai', title: 'Success', message: 'OpenAI API Key is Valid', variant: 'success', color: 'green', icon: <MdCloudDone /> })
            })
            .catch(e => {
                notifications.update({ id: 'openai', title: 'Error', message: 'OpenAI API Key is Invalid', variant: 'error', color: 'red' })
            })


        // check if pinecone key is valid
        notifications.show({ id: 'pinecone', title: 'Pinecone API Key', message: 'Validating...', autoClose: false, icon: <SiOpenai /> })
        try {
            const pinecone = new PineconeClient();
            await pinecone.init({
                environment: "eu-west1-gcp",
                apiKey: pineconeApiKey,
            });
            window.localStorage.setItem('pinecone-api-key', pineconeApiKey)
            notifications.update({ id: 'pinecone', title: 'Pinecone API Key', message: 'Pinecone API key is valid', autoClose: false, icon: <SiOpenai /> })
        }
        catch (err) {
            notifications.update({ id: 'pinecone', title: 'Pinecone API Key', message: 'Pinecone API key is invalid', autoClose: false, icon: <SiOpenai /> })
        }
    }, [])

    useEffect(() => {
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

    const get = async () => {
        const embedding_usage = await db.getUsage({ queries: { model: "embeddings" } })
        const chat_usage = await db.getUsage({ queries: { model: "gpt-3.5" } })
        console.log({ embeddings: embedding_usage, chat: chat_usage })
        setUsage({ embeddings: embedding_usage, chat: chat_usage })
    }

    useEffect(() => { get() }, [])


    return (
        <>
            <Drawer
                opened={opened}
                onClose={close}
                withCloseButton={true}
                title="API Keys"
            >
                <Flex
                    direction="column"
                    gap="md"
                >
                    <TextInput
                        label="OpenAI API Key"
                        value={openaiKey}
                        onChange={(e) => setOpenaiKey(e.currentTarget.value)}
                    />
                    <TextInput
                        label="Pinecone API Key"
                        value={pineconeApiKey}
                        onChange={(e) => setPineconeApiKey(e.currentTarget.value)}
                    />
                    <Flex direction="row" gap="xl" className='items-center'>
                        <Button
                            variant="outline"
                            onClick={() => Validate(openaiKey, pineconeApiKey)}
                            className='w-32'
                        >
                            Validate Keys
                        </Button>
                        <ActionIcon
                            variant='light'
                            onClick={get}
                            color='blue'
                        >
                            <IconReload color='black' />
                        </ActionIcon>
                    </Flex>
                    <Stack>
                        <strong>Embeddings:</strong>
                        <p>Tokens: {usage?.embeddings.totalTokens}</p>
                        <p>Requests: {usage?.embeddings.totalRequests}</p>
                        <p>Price Per 1000 Token: $0.0004</p>
                        <p>Usage: ${((usage?.embeddings.totalTokens ?? 0) * 0.0004 / 1000).toFixed(5)}</p>
                        <hr />

                        <strong>Chat Usage:</strong>
                        <p>Prompt Tokens: {usage?.chat.promptTokens}</p>
                        <p>Completion Tokens: {usage?.chat.completionTokens}</p>
                        <p>Total Tokens: {usage?.chat.totalTokens}</p>
                        <p>Requests: {usage?.chat.totalRequests}</p>
                        <p>Price Per 1000 Token: $0.0004</p>
                        <p>Usage: ${((usage?.chat.totalTokens ?? 0) * 0.002 / 1000).toFixed(5)}</p>
                    </Stack>
                </Flex>
            </Drawer>
            <Button
                variant="outline"
                onClick={open}
                className='w-32'
            >
                Set API Keys
            </Button>
        </>
    )

}
