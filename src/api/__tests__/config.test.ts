import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import apiClient from '../config';

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

    // 觸發請求攔截器
    const config = apiClient.interceptors.request.handlers[0].fulfilled({
      headers: {},
    });

    expect(config.headers.Authorization).toBe(`Bearer ${token}`);
  });

  it('應該在 token 不存在時不添加 Authorization header', () => {
    // 確保沒有 token
    localStorage.clear();

    // 觸發請求攔截器
    const config = apiClient.interceptors.request.handlers[0].fulfilled({
      headers: {},
    });

    expect(config.headers.Authorization).toBeUndefined();
  });
});
