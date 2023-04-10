import { useRecoilState } from 'recoil'
import { openaiKeyState, pineconeApiKeyState } from '@/state'
import { Drawer, Button, TextInput, Flex } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useDisclosure } from '@mantine/hooks'
import { Configuration, OpenAIApi } from 'openai'
import { useCallback, useEffect } from 'react'
import { SiOpenai } from "react-icons/si"
import { MdCloudDone } from "react-icons/md"


export default function ApikeyBar() {

    const [opened, { open, close }] = useDisclosure()

    const [openaiKey, setOpenaiKey] = useRecoilState(openaiKeyState)
    const [pineconeApiKey, setPineconeApiKey] = useRecoilState(pineconeApiKeyState)

    const Validate = useCallback((openaiKey: string, pineconeKey: string) => {

        // update key to local storage
        window.localStorage.setItem('openai-api-key', openaiKey)

        const openaiClient = new OpenAIApi(new Configuration({ apiKey: openaiKey }))
        // check if openai key is valid
        notifications.show({ id: 'openai', title: 'OpenAI API Key', message: 'Validating...', autoClose: false, icon: <SiOpenai/> })
        openaiClient.listModels()
            .then(r => {
                notifications.update({ id: 'openai', title: 'Success', message: 'OpenAI API Key is Valid', variant: 'success', color: 'green', icon: <MdCloudDone/> })
            })
            .catch(e => {
                notifications.update({ id: 'openai', title: 'Error', message: 'OpenAI API Key is Invalid', variant: 'error', color: 'red' })
            })
    }, [])

    useEffect(() => {
        const alreadyStoredKey = window.localStorage.getItem('openai-api-key')
        if (alreadyStoredKey && alreadyStoredKey !== openaiKey) {
            setOpenaiKey(alreadyStoredKey)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


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
                    <Button
                        variant="outline"
                        onClick={() => Validate(openaiKey, pineconeApiKey)}
                        className='w-32'
                    >
                        Validate Keys
                    </Button>
                </Flex>
            </Drawer>
            <Button
                variant="outline"
                onClick={open}
            >
                Set API Keys 
            </Button>
        </>
    )

}
