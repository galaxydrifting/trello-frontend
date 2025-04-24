import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import LoginPage from '../pages/LoginPage';
import SuccessPage from '../pages/SuccessPage';
import BoardListPage from '../pages/BoardListPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <LoginPage />,
      },
      {
        path: '/success',
        element: <SuccessPage />,
      },
      {
        path: '/boards',
        element: <BoardListPage />, // 新增 BoardListPage 路由
      },
    ],
  },
]);

export default router;
