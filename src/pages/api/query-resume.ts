import Cors from 'nextjs-cors';
import { NextApiRequest, NextApiResponse } from 'next';
import { PineconeClient } from "@pinecone-database/pinecone"

async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Your API logic here

    try {
        const apiKey = req.body.apiKey
        const embeddings = req.body.embeddings
        const topK = req.body.topK

        const pinecone = new PineconeClient();
        await pinecone.init({
            environment: "eu-west1-gcp",
            apiKey: apiKey,
        });

        const index = pinecone.Index("resumes")
        const queryRequest = {
            vector: embeddings[0],
            topK,
        };
        const result = await index.query({ queryRequest })

        res.status(200).json({ result });
    }
    catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export default async function wrapperHandler(req: NextApiRequest, res: NextApiResponse) {
    // Run cors middleware
    await Cors(req, res);

    // Call your API logic
    await handler(req, res);
}