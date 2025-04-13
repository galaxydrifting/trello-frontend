import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from '../LoginForm';

describe('LoginForm', () => {
  const mockLoginMutation = {
    mutate: vi.fn(),
    isPending: false,
    isSuccess: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('應該正確渲染表單欄位', () => {
    render(<LoginForm loginMutation={mockLoginMutation as any} />);
    
    expect(screen.getByLabelText(/電子郵件/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/密碼/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('應該允許使用者輸入電子郵件和密碼', async () => {
    const user = userEvent.setup();
    render(<LoginForm loginMutation={mockLoginMutation as any} />);
    
    const emailInput = screen.getByLabelText(/電子郵件/i);
    const passwordInput = screen.getByLabelText(/密碼/i);
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('應該在提交表單時呼叫 mutation', async () => {
    const user = userEvent.setup();
    render(<LoginForm loginMutation={mockLoginMutation as any} />);
    
    const emailInput = screen.getByLabelText(/電子郵件/i);
    const passwordInput = screen.getByLabelText(/密碼/i);
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    const submitButton = screen.getByRole('button');
    await user.click(submitButton);
    
    expect(mockLoginMutation.mutate).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  it('不應該在表單無效時提交', async () => {
    const user = userEvent.setup();
    render(<LoginForm loginMutation={mockLoginMutation as any} />);
    
    // 不輸入任何值直接提交
    const submitButton = screen.getByRole('button');
    await user.click(submitButton);
    
    expect(mockLoginMutation.mutate).not.toHaveBeenCalled();
  });

  it('應該在有錯誤時顯示錯誤訊息', () => {
    const mockMutationWithError = {
      ...mockLoginMutation,
      error: {
        response: {
          status: 401,
          data: { message: '帳號或密碼錯誤' }
        }
      }
    };
    
    render(<LoginForm loginMutation={mockMutationWithError as any} />);
    expect(screen.getByText(/帳號或密碼錯誤/)).toBeInTheDocument();
  });
});