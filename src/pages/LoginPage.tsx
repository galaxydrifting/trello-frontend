import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import apiClient from '../api/config';
import { LoginForm } from '../components/auth/LoginForm';
import { LoginForm as ILoginForm, LoginResponse, LoginError } from '../components/auth/types';

export default function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginMutation = useMutation<AxiosResponse<LoginResponse>, LoginError, ILoginForm>({
    mutationFn: (data: ILoginForm) => {
      return apiClient.post<LoginResponse>('/auth/login', data);
    },
    onSuccess: (response) => {
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        queryClient.invalidateQueries({ queryKey: ['user'] });
        navigate('/success');
      }
    },
    onError: (error: LoginError) => {
      console.error('Login failed:', error);
    },
    retry: 1,
    retryDelay: 1000,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">登入您的帳號</h2>
        </div>

        <LoginForm loginMutation={loginMutation} />
      </div>
    </div>
  );
}
