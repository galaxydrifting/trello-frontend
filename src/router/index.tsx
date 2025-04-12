import { createBrowserRouter } from 'react-router-dom';
import App from '../App';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            // 這裡可以添加子路由
            // {
            //   path: 'boards',
            //   element: <Boards />
            // }
        ]
    }
]);

export default router;