import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://host.docker.internal:8080',  // 使用 host.docker.internal 訪問主機
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('代理錯誤詳情:', {
              message: err.message,
              code: err.code,
              stack: err.stack
            });
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('發送請求詳情:', {
              method: req.method,
              url: req.url,
              headers: proxyReq.getHeaders(),
              path: proxyReq.path
            });
          });
        },
      }
    }
  }
})
