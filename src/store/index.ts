import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

// 建立 Redux store，集中管理 user 狀態
const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
