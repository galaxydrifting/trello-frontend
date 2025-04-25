import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginForm } from '../LoginForm';
import { UseMutationResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import type { LoginForm as ILoginForm, LoginResponse, LoginError } from '../types';

describe('LoginForm', () => {
  const mockLoginMutation: UseMutationResult<
    AxiosResponse<LoginResponse>,
    LoginError,
    ILoginForm,
    unknown
  > = {
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
    isIdle: true,
    status: 'idle',
    data: undefined,
    error: null,
    variables: undefined,
    reset: vi.fn(),
    context: undefined,
    failureCount: 0,
    failureReason: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('應該正確渲染表單欄位', () => {
    render(<LoginForm loginMutation={mockLoginMutation} />);

    expect(screen.getByLabelText(/電子郵件/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/密碼/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('應該允許使用者輸入電子郵件和密碼', async () => {
    const user = userEvent.setup();
    render(<LoginForm loginMutation={mockLoginMutation} />);

    const emailInput = screen.getByLabelText(/電子郵件/i);
    const passwordInput = screen.getByLabelText(/密碼/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('應該在提交表單時呼叫 mutation', async () => {
    const user = userEvent.setup();
    render(<LoginForm loginMutation={mockLoginMutation} />);

    const emailInput = screen.getByLabelText(/電子郵件/i);
    const passwordInput = screen.getByLabelText(/密碼/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button');
    await user.click(submitButton);

    expect(mockLoginMutation.mutate).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('不應該在表單無效時提交', async () => {
    const user = userEvent.setup();
    render(<LoginForm loginMutation={mockLoginMutation} />);

    // 不輸入任何值直接提交
    const submitButton = screen.getByRole('button');
    await user.click(submitButton);

    expect(mockLoginMutation.mutate).not.toHaveBeenCalled();
  });

  it('應該在有錯誤時顯示錯誤訊息', () => {
    const mockMutationWithError: UseMutationResult<
      AxiosResponse<LoginResponse>,
      LoginError,
      ILoginForm,
      unknown
    > = {
      ...mockLoginMutation,
      error: {
        response: {
          status: 401,
          data: { message: '帳號或密碼錯誤' },
        },
      } as LoginError,
      variables: undefined,
    };
    render(<LoginForm loginMutation={mockMutationWithError} />);
    expect(screen.getByText(/帳號或密碼錯誤/)).toBeInTheDocument();
  });
});
