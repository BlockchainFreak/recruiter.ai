// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../lib/prisma";

interface Usage {
  promptTokens: number
  completionTokens: number
  totalTokens?: number
  totalRequests?: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Usage | { err: any }>
) {

  // default id
  const model = req.query.model as string

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
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
          totalRequests: 0
        }
      })
      res.status(200).json({ promptTokens: 0, completionTokens: 0, totalTokens: 0, totalRequests: 0 })
      return
    }

    res.status(200).json(currentUsage)
  }
  catch (err) {
    console.error(err)
    res.status(500).json({ err })
  }
}


