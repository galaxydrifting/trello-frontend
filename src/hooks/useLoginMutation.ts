import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { useDispatch } from 'react-redux';
import apiClient from '../api/config';
import type { AuthResponse, LoginError, LoginForm } from '../components/auth/types';
import { setUser } from '../store/userSlice';

export function useLoginMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<AxiosResponse<AuthResponse>, LoginError, LoginForm>({
    mutationFn: (data: LoginForm) => {
      return apiClient.post<AuthResponse>('/auth/login', data);
    },
    onSuccess: (response) => {
      if (response.data.token && response.data.email && response.data.name) {
        localStorage.setItem('token', response.data.token);
        dispatch(
          setUser({
            token: response.data.token,
            email: response.data.email,
            name: response.data.name,
          })
        );
        queryClient.invalidateQueries({ queryKey: ['user'] });
        navigate('/boards');
      }
    },
    retry: 1,
    retryDelay: 1000,
  });
}
