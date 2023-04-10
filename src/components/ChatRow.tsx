import { useCallback, useState } from "react";
import { Textarea, Flex } from '@mantine/core';
import { AiOutlineMinusCircle } from "react-icons/ai";
import { UseFormReturnType } from '@mantine/form';


interface formValues {
    role: ("ASSISTANT" | "USER")[]
    content: string[]
}

export interface RowProps {
    index: number,
    loading: boolean,
    form: UseFormReturnType<formValues>,
}

export default function ChatRow({ form, index, loading }: RowProps) {

    const [focus, setIsFocus] = useState(false);

    const toggle = useCallback(() => {
        const newRole = form.values.role[index] === 'ASSISTANT' ? 'USER' : 'ASSISTANT';
        form.setFieldValue(`role.${index}`, newRole);
    }, [form, index]);


    return (
        <Flex
            className="hover:bg-gray-100 border-b border-gray-200"
            direction="row"
            mih={64}
        >
            <div className="flex-none w-32 h-16 p-4 font-sans">
                <p
                    onClick={() => !loading && toggle()}
                    className="place-text-center p-2 hover:bg-gray-200 rounded-md text-slate-700 font-semibold">
                    {form.values.role[index]}
                </p>
            </div>
            <div className="flex-grow min-h-16 py-4">
                <Textarea
                    className="border-black"
                    placeholder="Type your message here"
                    wrapperProps={{ className: "border-none" }}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    // value={form.values[index].content}
                    styles={focus ? {} : { input: { border: '1px solid transparent' } }}
                    autosize
                    minRows={1}
                    {...form.getInputProps(`content.${index}`)} />
            </div>
            <div className="flex-none w-16 h-16 flex justify-end pt-6 pr-4">
                <AiOutlineMinusCircle size={18} className="hover:text-gray-700"
                    onClick={() => {
                        if (loading)
                            return;
                        form.removeListItem('content', index);
                        form.removeListItem('role', index);
                    }} />
            </div>
        </Flex>
    );

}
