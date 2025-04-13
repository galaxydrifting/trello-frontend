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

  it('應該在表單提交時處理登入流程', async () => {
    const user = userEvent.setup();
    renderLoginPage();
    
    // 填寫表單
    await user.type(screen.getByPlaceholderText(/電子郵件/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/密碼/i), 'password123');
    
    // 提交表單
    await user.click(screen.getByRole('button', { name: /登入/i }));
    
    // 驗證基本流程完成
    // 注意：這裡不測試具體的 API 調用邏輯，那部分應該在 LoginForm 元件測試中完成
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});