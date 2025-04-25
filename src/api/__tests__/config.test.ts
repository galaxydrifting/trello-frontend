import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient, { attachToken } from '../config';

vi.mock('axios');

describe('API Client 配置', () => {
  beforeEach(() => {
    // 清除 localStorage
    localStorage.clear();
    // 清除所有 mock
    vi.clearAllMocks();
  });

  it('應該有正確的基礎 URL 配置', () => {
    expect(apiClient.defaults.baseURL).toBe(import.meta.env.VITE_API_URL || '');
  });

  it('應該在請求時自動添加 token', () => {
    const token = 'test-token';
    localStorage.setItem('token', token);

    // 攔截器測試改為模擬請求
    const config = { headers: {} };
    const result = attachToken(config);
    expect(result.headers?.Authorization).toBe(`Bearer ${token}`);
  });

  it('應該在 token 不存在時不添加 Authorization header', () => {
    localStorage.clear();
    const config = { headers: {} };
    const result = attachToken(config);
    expect(result.headers?.Authorization).toBeUndefined();
  });
});
