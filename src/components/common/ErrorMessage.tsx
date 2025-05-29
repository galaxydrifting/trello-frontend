interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage = ({ message = '發生錯誤' }: ErrorMessageProps) => (
  <div className="flex justify-center items-center h-32 text-lg text-red-500 bg-red-50 rounded-md">
    {message}
  </div>
);

export default ErrorMessage;
