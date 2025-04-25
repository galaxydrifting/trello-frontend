import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ErrorMessage } from '../ErrorMessage';
import { AxiosError, AxiosResponse } from 'axios';
import type { ErrorResponse } from '../types';

// 調整 networkError, authError 型別為 AxiosError<ErrorResponse, any>
describe('ErrorMessage 元件', () => {
  // 測試案例 1: 沒有錯誤時不應該顯示任何內容
  it('沒有錯誤時不應該顯示任何內容', () => {
    render(<ErrorMessage error={null} />);
    // screen.queryByText 如果找不到元素會返回 null，適合用於測試元素不存在的情況
    expect(screen.queryByText(/錯誤/)).not.toBeInTheDocument();
  });

  // 測試案例 2: 網路連線錯誤的情況
  it('應該顯示網路連線錯誤訊息', () => {
    const networkError: AxiosError<ErrorResponse, unknown> = new AxiosError();
    render(<ErrorMessage error={networkError} />);
    expect(screen.getByText(/無法連接到伺服器/)).toBeInTheDocument();
  });

  it('應該顯示驗證失敗訊息', () => {
    const response = {
      data: { message: '帳號或密碼錯誤' },
      status: 401,
      statusText: 'Unauthorized',
      headers: {},
      config: {},
    } as AxiosResponse<ErrorResponse>;
    const authError: AxiosError<ErrorResponse, unknown> = new AxiosError(
      '認證失敗',
      '401',
      undefined,
      undefined,
      response
    );
    render(<ErrorMessage error={authError} />);
    expect(screen.getByText(/帳號或密碼錯誤/)).toBeInTheDocument();
  });
});
