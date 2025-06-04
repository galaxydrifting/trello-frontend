import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/common/Navbar';
import useAuthInit from './hooks/useAuthInit';

function App() {
  const location = useLocation();
  useAuthInit();

  // 在開發時顯示當前環境
  if (import.meta.env.DEV) {
    console.log('當前環境模式:', import.meta.env.MODE);
    console.log('API URL:', import.meta.env.VITE_API_URL);
  }

  // 登入與註冊頁不顯示 Navbar
  const hideNavbar = location.pathname === '/' || location.pathname === '/register';

  return (
    <div className="app">
      {!hideNavbar && <Navbar />}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
