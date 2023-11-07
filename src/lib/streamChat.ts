import { yieldStream } from "yield-stream";
import { OpenAI } from "openai-streams"
import db from "@/sdk"

type StreamChat = {
    apiKey: string
    messages: { role: "user" | "assistant", content: string }[]
    temperature?: number
    maxTokens?: number
    promptTokens: number
    appender: (text: string) => void
    onError: (error: any) => void
}


export default async function streamChat({ apiKey, temperature, maxTokens, appender, messages, onError, promptTokens }: StreamChat) {

    console.log("streamChat");

    let completionTokens = 0
    
    try {
        const stream = await OpenAI(
            "chat",
            {
                model: "gpt-4-1106-preview",
                messages,
                temperature: temperature ?? 0.7,
                max_tokens: maxTokens ?? 4100,
            },
            { apiKey }
        );

        const DECODER = new TextDecoder();
        for await (const serialized of yieldStream(stream)) {
            const token = DECODER.decode(serialized);
            appender(token);
            ++completionTokens;
        }

        // const { success } = await db.updateUsage({
        //     model: "gpt-3.5",
        //     promptTokens,
        //     completionTokens,
        // });
        // if(success === false) {
        //     throw new Error(`Unable to update usage.`)
        // }
    } catch (e) {
        onError(e)
    }
}