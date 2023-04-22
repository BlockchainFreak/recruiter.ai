// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../lib/prisma";

interface Usage {
    model: string,
    promptTokens: number,
    completionTokens: number,
}



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ success: boolean }>
) {

    const usage = req.body as Usage
    console.log(req.body)
    const model = usage.model
    const totalTokens = usage.promptTokens + usage.completionTokens

    try {
        // get the current usage with id
        const currentUsage = await prisma.usage.findUnique({
            where: {
                id: model
            }
        })

        if(!currentUsage) {
            // create a new usage
            await prisma.usage.create({
                data: {
                    id: model,
                    promptTokens: usage.promptTokens,
                    completionTokens: usage.completionTokens,
                    totalTokens,
                    totalRequests: 1,
                }
            })
            res.status(200).json({ success: true })
            return
        }

        // update the usage
        await prisma.usage.update({
            where: {
                id: model
            },
            data: {
                promptTokens: currentUsage.promptTokens + usage.promptTokens,
                completionTokens: currentUsage.completionTokens + usage.completionTokens,
                totalTokens: currentUsage.totalTokens + totalTokens,
                totalRequests: currentUsage.totalRequests + 1
            }
        })

        res.status(200).json({ success: true })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ success: false })
    }
}
