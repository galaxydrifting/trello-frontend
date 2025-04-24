import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/config';

interface Board {
  id: string;
  name: string;
}

const fetchBoards = async () => {
  const res = await apiClient.post('/graphql/query', {
    query: `query { boards { id name } }`,
  });
  return res.data.data.boards;
};

const BoardListPage = () => {
  const navigate = useNavigate();
  const {
    data: boards = [],
    isLoading,
    isError,
  } = useQuery<Board[], Error>({
    queryKey: ['boards'],
    queryFn: fetchBoards,
    retry: 1,
  });

  if (isLoading) return <div>載入中...</div>;
  if (isError) return <div>無法取得看板列表</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">看板列表</h1>
      <ul className="space-y-2">
        {boards.map((board) => (
          <li
            key={board.id}
            className="p-4 bg-white rounded shadow cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/boards/${board.id}`)}
          >
            {board.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoardListPage;
