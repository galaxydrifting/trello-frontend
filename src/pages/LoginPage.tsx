import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/config';
import { AxiosError, AxiosResponse } from 'axios';

interface LoginForm {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

interface ErrorResponse {
  message: string;
}

const getErrorMessage = (error: AxiosError<ErrorResponse>): string => {
  if (!error.response) {
    return '無法連接到伺服器，請檢查網路連線';
  }

  const status = error.response.status;
  switch (status) {
    case 400:
      return '請求格式錯誤';
    case 401:
      return '帳號或密碼錯誤';
    case 422:
      return error.response.data?.message || '輸入資料格式不正確';
    case 429:
      return '請求次數過多，請稍後再試';
    case 500:
    case 502:
    case 503:
    case 504:
      return '伺服器暫時無法處理請求，請稍後再試';
    default:
      return '登入失敗，請稍後再試';
  }
};

export default function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const loginMutation = useMutation<AxiosResponse<LoginResponse>, AxiosError<ErrorResponse>, LoginForm>({
    mutationFn: (data: LoginForm) => {
      return apiClient.post<LoginResponse>('/auth/login', data);
    },
    onSuccess: (response) => {
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        queryClient.invalidateQueries({ queryKey: ['user'] });
        navigate('/success');
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error('Login failed:', getErrorMessage(error));
    },
    retry: 1,
    retryDelay: 1000,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            登入您的帳號
          </h2>
        </div>
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
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          {loginMutation.isError && (
            <div className="text-red-500 text-sm text-center">
              {getErrorMessage(loginMutation.error)}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loginMutation.isPending || loginMutation.isSuccess}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white 
                ${loginMutation.isPending || loginMutation.isSuccess
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loginMutation.isPending && '登入中...'}
              {loginMutation.isSuccess && '登入成功！'}
              {!loginMutation.isPending && !loginMutation.isSuccess && '登入'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}