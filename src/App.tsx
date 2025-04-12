import { Outlet } from 'react-router-dom'
import './App.css'

function App() {
  // 在開發時顯示當前環境
  if (import.meta.env.DEV) {
    console.log('當前環境模式:', import.meta.env.MODE);
    console.log('API URL:', import.meta.env.VITE_API_URL);
  }

  return (
    <div className="app">
      {/* 這裡可以放置導航欄或側邊欄等固定元件 */}
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
