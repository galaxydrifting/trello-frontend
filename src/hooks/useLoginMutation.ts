import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import apiClient from '../api/config';
import { LoginForm as ILoginForm, LoginResponse, LoginError } from '../components/auth/types';

export function useLoginMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<LoginResponse>, LoginError, ILoginForm>({
    mutationFn: (data: ILoginForm) => {
      return apiClient.post<LoginResponse>('/auth/login', data);
    },
    onSuccess: (response) => {
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        queryClient.invalidateQueries({ queryKey: ['user'] });
        navigate('/boards');
      }
    },
    retry: 1,
    retryDelay: 1000,
  });
}
