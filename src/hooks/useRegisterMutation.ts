import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import apiClient from '../api/config';
import { RegisterForm, RegisterResponse, LoginError } from '../components/auth/types';

export function useRegisterMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<RegisterResponse>, LoginError, RegisterForm>({
    mutationFn: (data: RegisterForm) => {
      return apiClient.post<RegisterResponse>('/auth/register', data);
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

export default useRegisterMutation;
