import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import LoginPage from '../pages/LoginPage';
import BoardListPage from '../pages/BoardListPage';
import BoardDetailPage from '../pages/BoardDetailPage';

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
        path: '/boards',
        element: <BoardListPage />,
      },
      {
        path: '/boards/:boardId',
        element: <BoardDetailPage />,
      },
    ],
  },
]);

export default router;
