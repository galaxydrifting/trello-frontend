import axios, { type AxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 請求攔截器
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 只有在有 token 且非登入 API 時才自動導向登入頁
    // 例如：
    // 有 token 時呼叫 /api/boards（非登入 API）回傳 401，才會自動導向登入頁
    // 但呼叫 /auth/login 回傳 401 則不會導向
    const token = localStorage.getItem('token');
    const isLoginApi = error.config && error.config.url && error.config.url.includes('/auth/login');
    if (error.response && error.response.status === 401 && token && !isLoginApi) {
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// 匯出 attachToken 供測試直接調用
export function attachToken(config: AxiosRequestConfig): AxiosRequestConfig {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}

export default apiClient;
