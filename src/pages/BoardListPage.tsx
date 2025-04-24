import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/config';

interface Board {
  id: string;
  name: string;
}

const BoardListPage = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await apiClient.post('/graphql/query', {
          query: `query { boards { id name } }`,
        });
        setBoards(res.data.data.boards);
      } catch {
        setError('無法取得看板列表');
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, []);

  if (loading) return <div>載入中...</div>;
  if (error) return <div>{error}</div>;

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
