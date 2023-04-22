import { OpenAIApi, Configuration, CreateCompletionRequest, CreateCompletionResponse } from "openai"
import { TextEmbedding } from "../types";
import { chunkText } from "./chunkText";
import db from "@/sdk"

type EmbeddingOptions = {
    input: string | string[];
    apiKey?: string;
    model?: string;
};

export async function embedding({
    input,
    model = "text-embedding-ada-002",
    apiKey, // = process.env.OPENAI_API_KEY,
}: EmbeddingOptions) {

    const openai = new OpenAIApi(new Configuration({ apiKey }));

    const result = await openai.createEmbedding({
        model,
        input,
    });

    if (!result.data.data[0].embedding) {
        throw new Error("No embedding returned from the completions endpoint");
    }

    const promptTokens = result.data.usage.prompt_tokens;

    // Update the usage
    db.updateUsage({ model: "embeddings" , promptTokens, completionTokens: 0 });

    // Otherwise, return the embeddings
    return result.data.data.map((d) => d.embedding)
}


// There isn't a good JS tokenizer at the moment, so we are using this approximation of 4 characters per token instead. This might break for some languages.
const MAX_CHAR_LENGTH = 250 * 4;

// This function takes a text and returns an array of embeddings for each chunk of the text
// The text is split into chunks of a given maximum charcter length
// The embeddings are computed in batches of a given size
export async function getEmbeddingsForText({
    text,
    maxCharLength = MAX_CHAR_LENGTH,
    batchSize = 20,
}: {
    text: string;
    maxCharLength?: number;
    batchSize?: number;
}): Promise<TextEmbedding[]> {
    const textChunks = chunkText({ text, maxCharLength });

    const batches = [];
    for (let i = 0; i < textChunks.length; i += batchSize) {
        batches.push(textChunks.slice(i, i + batchSize));
    }

    try {
        const batchPromises = batches.map((batch) => embedding({ input: batch }));

        const embeddings = (await Promise.all(batchPromises)).flat();

        const textEmbeddings = embeddings.map((embedding, index) => ({
            embedding,
            text: textChunks[index],
        }));

        return textEmbeddings;
    } catch (error: any) {
        console.log("Error: ", error);
        return [];
    }
}
