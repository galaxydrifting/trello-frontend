interface SubmitButtonProps {
    isPending: boolean;
    isSuccess: boolean;
}

export const SubmitButton = ({ isPending, isSuccess }: SubmitButtonProps) => {
    return (
        <button
            type="submit"
            disabled={isPending || isSuccess}
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white 
        ${isPending || isSuccess
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'} 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
            {isPending && '登入中...'}
            {isSuccess && '登入成功！'}
            {!isPending && !isSuccess && '登入'}
        </button>
    );
};