import { useRef, useState, useCallback } from 'react';
import { Text, Group, Button, createStyles, rem, Accordion } from '@mantine/core';
import { Dropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';
import { useRecoilState } from 'recoil';
import { droppedFilesState } from '@/state';
const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
  },

  dropzone: {
    borderWidth: rem(1),
    maxWidth: rem(400),
  },

  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
  },
}));

export default function DropzoneButton() {
  const { classes, theme } = useStyles();
  const openRef = useRef<() => void>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [droppedFiles, setDroppedFiles] = useRecoilState(droppedFilesState)

  const handleFileDrop = useCallback(
    async (selectedFiles: FileWithPath[]) => {

      setLoading(true);

      if (selectedFiles && selectedFiles.length > 0) {
        setError("");

        selectedFiles.forEach((file) => {
          if (
            file.type.match(
              /(text\/plain|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|text\/(markdown|x-markdown))/
            ) && // AND file isn't too big
            file.size < 50 * 1024 * 1024
          ) {
            // Check if the file name already exists in the files state
            if (droppedFiles.find((f) => f.name === file.name && f.size === file.size)) {
              setLoading(false)
              return null; // Skip this file
            }
          }
        });
      }
      console.log("files dropped: ", selectedFiles)
      setDroppedFiles(selectedFiles)
      setLoading(false)
    },
    [droppedFiles, setDroppedFiles]
  );

  return (
    <div className={classes.wrapper}>
      <Dropzone
        openRef={openRef}
        onDrop={handleFileDrop}
        className={classes.dropzone}
        radius="md"
        accept={[MIME_TYPES.pdf]}
        maxSize={50 * 1024 ** 1024}
      >
        <div style={{ pointerEvents: 'none' }}>
          <Group position="center">
            <Dropzone.Accept>
              <IconDownload
                size={rem(50)}
                color={theme.colors[theme.primaryColor][6]}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={rem(50)} color={theme.colors.red[6]} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconCloudUpload
                size={rem(50)}
                color={theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black}
                stroke={1.5}
              />
            </Dropzone.Idle>
          </Group>

          <Text ta="center" fw={700} fz="lg" mt="xl">
            <Dropzone.Accept>Drop files here</Dropzone.Accept>
            <Dropzone.Reject>Pdf file less than 30mb</Dropzone.Reject>
            <Dropzone.Idle>Upload resume</Dropzone.Idle>
          </Text>
          <Text ta="center" fz="sm" mt="xs" c="dimmed">
            Drag&apos;n&apos;drop files here to upload. We can accept only <i>.pdf .doc .txt .md and plain</i> files.
          </Text>
        </div>
      </Dropzone>
    </div>
  );
}