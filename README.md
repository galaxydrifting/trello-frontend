# Trello-Frontend

## 專案簡介

一個以 React 19 + TypeScript 打造的 Trello 類看板管理前端專案，支援多看板、清單、卡片拖拉排序，並整合現代前端最佳實踐。

## 技術棧

- React 19.x（Function Component + Hooks）
- TypeScript
- Tailwind CSS
- @tanstack/react-query 5.x
- redux toolkit（狀態管理）
- react-hook-form + yup（表單驗證）
- Vite
- Vitest + React Testing Library（單元測試）
- Playwright（E2E 測試）

## 主要功能

1. 註冊新帳號
2. 使用者登入
3. 登入後進入看板列表頁，可新增/刪除/編輯看板
4. 點擊看板進入詳情頁，可新增/刪除/編輯清單
5. 清單內可新增/刪除/編輯卡片
6. 支援拖拉排序（看板 > 清單 > 卡片）
7. 表單皆有 yup 驗證與錯誤提示
8. 僅登入狀態可操作，未登入會自動導向登入頁

## 專案結構簡述

- `src/pages/`：頁面元件（登入、註冊、看板列表、看板詳情）
- `src/components/`：共用元件、看板/清單/卡片元件
- `src/hooks/`：自訂 hooks
- `src/api/`：API 請求封裝
- `src/router/`：路由設定
- `src/store/`：Redux 狀態管理（user 狀態）
- `e2e/`：E2E 測試
- `src/__tests__/`：單元測試

## 狀態管理（Redux）

本專案使用 Redux Toolkit 管理全域狀態，主要用於保存登入使用者資訊（email、name），協助元件間共享登入狀態。token 僅儲存在 localStorage，僅於 API 請求時取用，不會進入 Redux 狀態。

Redux 相關檔案位於 `src/store/`，主要結構如下：

- `src/store/index.ts`：Redux store 建立與設定
- `src/store/userSlice.ts`：使用者狀態（user）slice，僅保存 email、name，包含登入、登出、還原狀態等 reducer

登入、註冊、初始化等流程會自動同步 Redux 狀態與 localStorage，確保頁面刷新後仍可還原登入資訊。

## 安裝與啟動

```bash
npm install
npm run dev
```

- 啟動後預設於 http://localhost:5173
- 本專案無預設假資料，請先註冊帳號再登入
- 請確認已建立 `.env.development` 檔案，內容如下：
  ```env
  VITE_API_URL=/api
  ```
- 若於 Dev Container（Codespaces/VS Code Remote）開發，已預設安裝 Node.js、TypeScript、Vitest、Playwright、Tailwind CSS 等相關擴充套件，建議直接使用 devcontainer 啟動開發環境，相關設定請見 `.devcontainer/devcontainer.json`

## API 與後端說明

- 本專案為前後端分離，需搭配後端 API 服務一同運作
- 後端原始碼與說明請參考：[trello-backend GitHub](https://github.com/galaxydrifting/trello-backend)
- 所有資料皆透過 GraphQL API 取得與操作，API 代理設定於 `vite.config.ts`，預設代理 `/api` 至 `http://host.docker.internal:8080`
- API 請求封裝於 `src/api/`，主要檔案：
  - `config.ts`：axios 設定與 token 攔截
  - `postGraphQL.ts`：通用 GraphQL 請求 function
  - `board.ts`：看板、清單、卡片相關 API 操作
- 請依後端專案說明啟動 API 服務，或依據上述 API 檔案格式串接

## 測試

### 單元測試

```bash
npm run test
```

### E2E 測試

```bash
npx playwright test
```

## 開發規範

- 請參考專案內部註解與命名規則
- 新增功能請附上對應測試
- PR 前請執行 `npm run lint`、`npm run build` 並修正所有警告與錯誤

## 其他

- 本專案尚未部署雲端，僅支援本地端開發
- 若需自訂 API 端點，請調整 `vite.config.ts` 內 proxy 設定
- Dev Container 會自動安裝常用 VS Code 擴充套件，提升開發體驗

---

如需協助或有建議，歡迎提出 Issue 或 PR！
