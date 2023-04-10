import { useEffect } from "react";
import { Loader, HoverCard } from '@mantine/core';

interface SubmitButtonProps {
    submitHandler: () => Promise<void>;
    loading: boolean;
}
export default function SubmitButton({ loading, submitHandler }: SubmitButtonProps) {

    useEffect(() => {
        const listenForSubmit = (e: KeyboardEvent) => e.ctrlKey && e.key === 'Enter' && submitHandler();
        window.addEventListener('keydown', listenForSubmit);
        return () => window.removeEventListener('keydown', listenForSubmit);
    }, [submitHandler]);

    return (
        <HoverCard shadow="md" width={128} >
            <HoverCard.Target>
                <button
                    className='w-20 text-green-600 border border-green-600 hover:bg-green-600 disabled:bg-green-900 disabled:border-green-900 hover:text-white font-bold py-1 px-4 rounded relative my-4 bg-white'
                    disabled={loading}
                    onClick={submitHandler}
                >
                    <div className="flex justify-center">{loading ? <Loader size="sm" color="white" /> : 'Submit'}</div>
                </button>
            </HoverCard.Target>
            <HoverCard.Dropdown className="bg-gray-700">
                <div className="flex justify-center">
                    <p className="text-sm text-white">Ctrl + Enter</p>
                </div>
            </HoverCard.Dropdown>
        </HoverCard>
    );
}
