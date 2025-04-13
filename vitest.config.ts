/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        globals: true,                    // 允許在測試中使用全域函式（如 describe, it, expect）
        environment: 'jsdom',             // 使用 jsdom 模擬瀏覽器環境
        setupFiles: ['./src/test/setup.ts'], // 指定測試設定檔
        include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], // 測試檔案匹配規則
        coverage: {
            provider: 'v8',                 // 使用 V8 引擎的程式碼覆蓋率工具
            reporter: ['text', 'html'],     // 產生文字和 HTML 格式的覆蓋率報告
            exclude: [
                'node_modules/',
                'src/test/setup.ts',
            ],
        },
    },
});