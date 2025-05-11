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
        navigate('/boards'); // 登入後導轉至看板頁面
      }
    },
    onError: (error: LoginError) => {
      console.error('Login failed:', error);
    },
    retry: 1,
    retryDelay: 1000,
  });

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full space-y-6 bg-white rounded-2xl shadow-xl p-8 mx-2">
        <div className="flex flex-col items-center">
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">登入您的帳號</h2>
        </div>
        <LoginForm loginMutation={loginMutation} />
      </div>
    </div>
  );
}
