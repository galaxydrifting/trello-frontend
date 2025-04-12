import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // 可以在這裡添加更多 axios 配置
    timeout: 10000,  // 10 秒超時
});

// 請求攔截器
apiClient.interceptors.request.use(
    (config) => {
        // 這裡可以添加認證 token 等邏輯
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
        // 這裡可以統一處理錯誤
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default apiClient;