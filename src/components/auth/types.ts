import { AxiosError } from 'axios';

export interface LoginForm {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
}

export interface ErrorResponse {
  message: string;
}

export type LoginError = AxiosError<ErrorResponse>;

export interface RegisterForm {
  email: string;
  password: string;
  name: string;
}
