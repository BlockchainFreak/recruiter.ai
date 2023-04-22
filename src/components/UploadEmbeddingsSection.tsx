import { PineconeClient } from "@pinecone-database/pinecone";
import { useRecoilState } from "recoil";
import { pineconeApiKeyState, droppedFilesState, processedFilesState } from "@/state";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";


export default function UploadEmbeddingsSection() {

    const [pineconeKey] = useRecoilState(pineconeApiKeyState)
    const [processedFiles, setProcessedFiles] = useRecoilState(processedFilesState)

    const onClick = async () => {
        const pinecone = new PineconeClient();
        await pinecone.init({
            environment: "eu-west1-gcp",
            apiKey: pineconeKey,
        });

        const index = pinecone.Index("resumes")

        const upsert = "";
    }

    return (
        <Button
            variant="contained"
            color="blue"
        >
            Upload Embeddings <br/> to Vector Database
        </Button>
    )
}