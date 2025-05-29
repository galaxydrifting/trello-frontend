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

## React 規範

- 一律使用函式型元件（Function Component）與 hooks。
- 遵循 React hooks 規則（不可在條件式中呼叫 hooks）。
- 有 children 的元件型別使用 React.FC。
- 元件保持單一職責，避免過大。
- 樣式優先使用 CSS Modules。
- 表單管理請使用 react-hook-form。
- 表單驗證請使用 yup，驗證 schema 請獨立檔案管理。
- 元件 props 與狀態請明確定義 TypeScript 型別。

## 測試規範

- 單元測試請使用 Vitest 與 React Testing Library，測試檔案放在 `__tests__` 目錄。
- 端對端（E2E）測試請使用 Playwright，測試檔案放在 `e2e/` 目錄。
- 產生測試時，請根據元件或功能建立對應的測試檔案，並覆蓋主要功能流程。

## 開發流程

- 請使用 `npm run lint` 以及 `npm run build`，修正警告與錯誤後，請再次執行確保完成。
