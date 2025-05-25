import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import LoginPage from '../LoginPage';

// Mock 路由 hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock API client
vi.mock('../../api/config', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('LoginPage 整合測試', () => {
  const queryClient = new QueryClient();

  const renderLoginPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('應該成功渲染登入頁面的主要元素', () => {
    renderLoginPage();

    // 只測試重要元素
    expect(screen.getByText('登入您的帳號')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /登入/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/電子郵件/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/密碼/i)).toBeInTheDocument();
  });

  it('登入成功時應該導向 /boards', async () => {
    vi.resetModules();
    localStorage.clear();
    const user = userEvent.setup();
    const mockNavigate = vi.fn();
    vi.doMock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
      };
    });
    const mockToken = 'mock-token';
    const mockPost = vi.fn().mockResolvedValue({ data: { token: mockToken } });
    vi.doMock('../../api/config', () => ({
      default: { post: mockPost },
    }));
    const { default: LoginPage } = await import('../LoginPage');
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </QueryClientProvider>
    );
    await user.type(screen.getByPlaceholderText(/電子郵件/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/密碼/i), 'password123');
    await user.click(screen.getByRole('button', { name: /登入/i }));
    expect(mockPost).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password123',
    });
    expect(mockNavigate).toHaveBeenCalledWith('/boards');
    expect(localStorage.getItem('token')).toBe(mockToken);
  });

  it('登入失敗時應該顯示錯誤訊息', async () => {
    vi.resetModules();
    localStorage.clear();
    const user = userEvent.setup();
    vi.doMock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => vi.fn(),
      };
    });
    // 使用 AxiosError 產生 error，補齊 config 屬性
    const { AxiosError, AxiosHeaders } = await import('axios');
    const error = new AxiosError(
      '認證失敗',
      '401',
      { url: '/auth/login', method: 'post', headers: new AxiosHeaders() },
      undefined,
      {
        status: 401,
        data: { message: '帳號或密碼錯誤' },
        statusText: 'Unauthorized',
        headers: {},
        config: { headers: new AxiosHeaders() },
      }
    );
    const mockPost = vi.fn().mockRejectedValue(error);
    vi.doMock('../../api/config', () => ({
      default: { post: mockPost },
    }));
    const { default: LoginPage } = await import('../LoginPage');
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </QueryClientProvider>
    );
    await user.type(screen.getByPlaceholderText(/電子郵件/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/密碼/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /登入/i }));
    expect(await screen.findByText('帳號或密碼錯誤')).toBeInTheDocument();
  });
});
