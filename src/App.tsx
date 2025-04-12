import { Outlet } from 'react-router-dom'
import './App.css'

function App() {
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
