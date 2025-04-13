import { AxiosError } from 'axios';

export interface LoginForm {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface ErrorResponse {
    message: string;
}

export type LoginError = AxiosError<ErrorResponse>;