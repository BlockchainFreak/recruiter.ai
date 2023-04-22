// import type { NextApiRequest, NextApiResponse } from "next";
// import formidable, { Fields, Files } from "formidable"; // to handle file uploads
// import { Mim }

// import { FileWithPath } from "@mantine/dropzone";
// import { TextEmbedding } from "../types";
// import extractTextFromFile from "./extractTextFromFile";
// import { createEmbeddings } from "./createEmbeddings";

// // Disable the default body parser to handle file uploads
// export const config = { api: { bodyParser: false } };

// type Data = {
//     text?: string;
//     meanEmbedding?: number[];
//     chunks?: TextEmbedding[];
//     error?: string;
// };

// // This function receives a file as a multipart form and returns the text extracted fom the file and the OpenAI embedding for that text
// export default async function getEmbeddingsForFiles ({file}: {file: FileWithPath}) {
    

//         const text = await extractTextFromFile({
//             filepath: file.path,
//             filetype: file.mimetype ?? "",
//         });

//         const { meanEmbedding, chunks } = await createEmbeddings({
//             text,
//         });
//     }
