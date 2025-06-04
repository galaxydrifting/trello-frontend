// src/hooks/useAuthInit.ts
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import apiClient from '../api/config';

/**
 * 初始化時自動從 localStorage 取得 token 並還原 user 狀態
 */
const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    // 嘗試取得用戶資訊
    (async () => {
      try {
        const res = await apiClient.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data && res.data.email && res.data.name) {
          dispatch(
            setUser({
              token,
              email: res.data.email,
              name: res.data.name,
            })
          );
        }
      } catch {
        // token 失效或請求失敗時，移除 token
        localStorage.removeItem('token');
      }
    })();
  }, [dispatch]);
};

export default useAuthInit;
