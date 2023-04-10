import { atom, selector } from 'recoil';

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