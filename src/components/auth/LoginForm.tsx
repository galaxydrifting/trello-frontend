import { useState } from 'react';
import { AxiosResponse } from 'axios';
import { UseMutationResult } from '@tanstack/react-query';
import { ErrorMessage } from './ErrorMessage';
import { SubmitButton } from './SubmitButton';
import { LoginForm as ILoginForm, AuthResponse, LoginError } from './types';

interface LoginFormProps {
  loginMutation: UseMutationResult<AxiosResponse<AuthResponse>, LoginError, ILoginForm, unknown>;
}

export const LoginForm = ({ loginMutation }: LoginFormProps) => {
  const [formData, setFormData] = useState<ILoginForm>({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email" className="sr-only">
            電子郵件
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="電子郵件"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            密碼
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="密碼"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
      </div>

      <ErrorMessage error={loginMutation.error} />

      <div>
        <SubmitButton isPending={loginMutation.isPending} isSuccess={loginMutation.isSuccess} />
      </div>
    </form>
  );
};
