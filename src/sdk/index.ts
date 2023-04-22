import { z } from "zod"
import { Zodios } from "@zodios/core"

export const Usage = z.object({
    promptTokens: z.number(),
    completionTokens: z.number(),
    totalTokens: z.number(),
    totalRequests: z.number(),
})

export const UsageInput = z.object({
    model: z.string(),
    promptTokens: z.number(),
    completionTokens: z.number(),
})

export type UsageInput = z.infer<typeof UsageInput>
export type Usage = z.infer<typeof Usage>

const db = new Zodios("/api", [
    {
        method: "get",
        path: "get-usage",
        alias: "getUsage",
        parameters: [{
            name: "model",
            type: "Query",
            schema: z.string(),
        }],
        response: Usage,
    },
    {
        method: "post",
        path: "update-usage",
        alias: "updateUsage",
        parameters: [
            {
                name: "usage",
                type: "Body",
                schema: UsageInput.omit({}),
            }
        ],
        response: z.object({ success: z.boolean() }),
    },
    {
        method: "post",
        path: "query-resume",
        alias: "queryResume",
        parameters: [
            {
                name: "params",
                type: "Body",
                schema: z.object({
                    apiKey: z.string(),
                    embeddings: z.array(z.array(z.number())),
                    topK: z.number(),
                }),
            }
        ],
        response: z.object({
            result: z.object({
                matches: z.array(z.object({
                    id: z.string(),
                    score: z.number(),
                })),
            })
        }).nonstrict(),
    }
])

export default db