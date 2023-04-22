import { useState, useEffect, useCallback } from 'react'
import { HoverCard, Button, Loader } from '@mantine/core';
import { FileWithPath } from '@mantine/dropzone';
import { FileLite } from '@/types';
import { compact } from 'lodash';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { droppedFilesState, processedFilesState } from '@/state';
import { notifications } from '@mantine/notifications';


export default function ProcessFileSection() {

    const [loading, setLoading] = useState(false)

    const [droppedFiles, setDroppedFiles] = useRecoilState(droppedFilesState)

    const [processedFiles, setProcessedFiles] = useRecoilState(processedFilesState)

    const handleProcessFiles = useCallback(async () => {

        if(droppedFiles.length === 0) {
            notifications.show({ title: 'Error', message: 'No files to process', color: 'red' })
            return;
        }

        setLoading(true)
        console.log(droppedFiles)

        const processedFilesLocal = await Promise.all(droppedFiles.map(async (file: FileWithPath) => {

            const formData = new FormData();

            formData.append("file", file);
            formData.append("filename", file.name);

            try {
                const processFileResponse = await axios.post(
                    "/api/process-file",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (processFileResponse.status === 200) {
                    const { text, meanEmbedding, chunks } = processFileResponse.data;

                    const fileObject: FileLite = {
                        name: file.name,
                        url: URL.createObjectURL(file),
                        type: file.type,
                        size: file.size,
                        expanded: false,
                        embedding: meanEmbedding,
                        chunks,
                        extractedText: text,
                    };
                    console.log(fileObject);
                    return fileObject;
                } else {
                    notifications.show({ title: 'Error', message: 'Error creating file embedding', color: 'red' })
                    return null;
                }
            }
            catch(e) {
                notifications.show({ title: 'Error', message: (e as any).message, color: 'red' })
            }
            return null;
        }));
        
        setLoading(false)
        // remove falsy values
        setProcessedFiles(compact(processedFilesLocal));
    }, [droppedFiles, setProcessedFiles])

    return (
        <HoverCard shadow="md" width={128} >
            <HoverCard.Target>
                <Button
                    variant="outline"
                    onClick={handleProcessFiles}
                    className='w-32'
                >
                    <div className="flex justify-center">{loading ? <Loader size="sm" color="blue" /> : 'Process Files'}</div>
                </Button>
            </HoverCard.Target>
            <HoverCard.Dropdown className="bg-gray-700">
                <div className="flex justify-center">
                    <p className="text-sm text-white">This will create embeddings of the files locally</p>
                </div>
            </HoverCard.Dropdown>
        </HoverCard>
    )
}
