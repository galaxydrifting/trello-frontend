# Trello-Frontend Copilot Instructions

## 一般規範

- 使用 TypeScript 撰寫所有新程式碼。
- 變數、函式、方法名稱使用 camelCase。
- 元件、型別、介面名稱使用 PascalCase。
- 常數使用 ALL_CAPS。
- 私有成員以底線（\_）開頭。
- 優先使用 const 與 readonly，避免可變資料。
- 非同步操作請加上 try/catch 處理錯誤，並記錄錯誤資訊。
- 註解請簡潔明確，必要時補充型別說明。

## React 與相關函式庫規範

- React 版本：請使用 React 19.x。
- React Query：請統一使用 @tanstack/react-query 5.x 進行資料請求與快取管理，優先使用 hooks API（如 useQuery、useMutation），必要時搭配 queryClient 操作快取。
- 一律使用函式型元件（Function Component）與 hooks。
- 遵循 React hooks 規則（不可在條件式中呼叫 hooks）。
- 一律優先使用箭頭函式（arrow function）撰寫元件，並避免使用 React.FC。
- 僅在箭頭函式無法達成需求時（如需使用 this 或特殊情境）才使用 function 宣告。
- 元件保持單一職責，避免過大。
- 元件 props 與狀態請明確定義 TypeScript 型別。
- 非同步操作請加上 try/catch 處理錯誤，並記錄錯誤資訊。

## 樣式規範

- 優先使用 Tailwind CSS 撰寫樣式，僅於特殊需求下才使用 CSS Modules。
- Tailwind class 命名請遵循官方建議，並保持語意清晰。

## 表單管理

- 表單管理請使用 react-hook-form。
- 表單驗證請使用 yup，驗證 schema 請獨立檔案管理。
- 若 react-hook-form 新版支援 React 19 特性，請優先採用。

## 測試規範

- 單元測試請使用 Vitest 與 React Testing Library，測試檔案放在 `__tests__` 目錄。
- 端對端（E2E）測試請使用 Playwright，測試檔案放在 `e2e/` 目錄。
- 產生測試時，請根據元件或功能建立對應的測試檔案，並覆蓋主要功能流程。

## 開發流程

- 請使用 `npm run lint` 以及 `npm run build`，修正警告與錯誤後，請再次執行確保完成。
