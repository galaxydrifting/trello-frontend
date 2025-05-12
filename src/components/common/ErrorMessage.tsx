import React from 'react';

interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message = '發生錯誤' }) => (
  <div className="flex justify-center items-center h-32 text-lg text-red-500 bg-red-50 rounded-md">
    {message}
  </div>
);

export default ErrorMessage;
