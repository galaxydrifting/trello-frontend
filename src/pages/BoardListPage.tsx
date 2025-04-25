import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Board } from '../components/board/types';
import { fetchBoards } from '../api/board';
import BoardListItem from '../components/board/BoardListItem';

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
          <BoardListItem key={board.id} board={board} onClick={(id) => navigate(`/boards/${id}`)} />
        ))}
      </ul>
    </div>
  );
};

export default BoardListPage;
