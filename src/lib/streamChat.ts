import { OpenAIApi, Configuration } from "openai"
import { yieldStream } from "yield-stream";
import { OpenAI } from "openai-streams"

type StreamChat = {
    apiKey: string
    messages: { role: "user" | "assistant", content: string }[]
    temperature?: number
    maxTokens?: number
    appender: (text: string) => void
}
export default async function streamChat({ apiKey, temperature, maxTokens, appender, messages }: StreamChat) {

    console.log("streamChat");

    try {
        const stream = await OpenAI(
            "chat",
            {
                model: "gpt-3.5-turbo",
                messages,
                temperature: temperature ?? 0.7,
                max_tokens: maxTokens ?? 900,
            },
            { apiKey }
        );

        const DECODER = new TextDecoder();
        for await (const serialized of yieldStream(stream)) {
            const token = DECODER.decode(serialized);
            appender(token);
            console.log(token);
        }
    } catch (e) {
        console.error(e);
    }

    // const apiUrl = 'https://api.openai.com/v1/chat/completions';

    // const fetchOptions = {
    //     method: 'POST',
    //     headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${apiKey}`,
    //     },
    //     body: JSON.stringify({
    //         model: 'gpt-3.5-turbo',
    //         //queues the model to return a summary, works fine.
    //         messages: [{"role": "user", "content": "Count from 1 to 10 separated by commas"}],
    //         temperature: 0.5,
    //         max_tokens: 100,
    //         presence_penalty: 0.0,
    //         stream: true,
    //         //    stop: ['\n'],
    //     }),
    // };

    // fetch(apiUrl, fetchOptions).then(async (response) => {
    //     const r = response.body;
    //     if (!r) throw new Error('No response body');

    //     const d = new TextDecoder('utf8');
    //     const reader = await r.getReader();
    //     let fullText = ''
    //     while (true) {
    //         const { value, done } = await reader.read();
    //         if (done) {
    //             console.log('done');
    //             break;
    //         } else {
    //             const decodedString = d.decode(value);
    //             // console.log(decodedString)
    //             try {
    //                 //fixes string not json-parseable otherwise
    //                 const choice = JSON.parse(decodedString.slice(6)).choices[0]
    //                 console.log("choice:\n",choice)
    //                 if(choice.finish_reason){
    //                     break
    //                 }
    //                 if(!choice.delta.content){
    //                     continue
    //                 }
    //                 fullText += choice.delta.content;
    //                 console.log(fullText)
    //             } catch (e) {
    //                 // the last line is data: [DONE] which is not parseable either, so we catch that.
    //                 console.log("son");
    //                 console.log("json:\n",decodedString.slice(6));
    //             }
    //         }

    //         console.log(fullText);
    //     }
    // });

    //   https://api.openai.com/v1/chat/completions
    //   response['choices'][0]['message']['content']
}