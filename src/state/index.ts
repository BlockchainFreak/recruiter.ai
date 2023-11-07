import { atom, selector } from 'recoil';
import { FileWithPath } from '@mantine/dropzone';
import { FileLite } from '@/types';


export type APIKEYS = {
    openai: string,
    pinecone: string,
}

export const apiKeysState = atom<APIKEYS>({
    key: 'apiKeysState',
    default: {
        pinecone: '',
        openai: '',
    }
})

export const openaiKeyState = selector({
    key: 'openaiKeyState',
    get: ({ get }) => get(apiKeysState).openai,
    set: ({ set }, newValue) => {
        set(apiKeysState, (oldValue: any) => ({
            ...oldValue,
            openai: newValue,
        }))
    }
})

export const pineconeApiKeyState = selector({
    key: 'pineconeApiKeyState',
    get: ({ get }) => get(apiKeysState).pinecone,
    set: ({ set }, newValue) => {
        set(apiKeysState, (oldValue: any) => ({
            ...oldValue,
            pinecone: newValue,
        }))
    }
})

export const droppedFilesState = atom({
    key: 'droppedFiles',
    default: [] as FileWithPath[],
})

export const processedFilesState = atom({
    key: 'processedFiles',
    default: [] as FileLite[],
})

export const temperatureState = atom({
    key: 'temperature',
    default: 0.2,
})

export const maxTokenLimitState = atom({
    key: 'maxTokens',
    default: 2000,
})

export const settingsState = selector({
    key: 'settingsState',
    get: ({ get }) => ({
        temperature: get(temperatureState),
        maxTokenLimit: get(maxTokenLimitState),
    }),
})