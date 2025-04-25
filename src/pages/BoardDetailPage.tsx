import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Board } from '../components/board/types';
import BoardList from '../components/board/BoardList';
import { fetchBoard } from '../api/board';

const BoardDetailPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const {
    data: board,
    isLoading,
    isError,
  } = useQuery<Board, Error>({
    queryKey: ['board', boardId],
    queryFn: () => fetchBoard(boardId!),
    enabled: !!boardId,
    retry: 1,
  });

  if (isLoading) return <div>載入中...</div>;
  if (isError || !board) return <div>無法取得看板資料</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{board.name}</h1>
      {board.lists.length === 0 ? (
        <div className="text-gray-400 text-center py-8">尚無清單</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {board.lists.map((list) => (
            <BoardList key={list.id} list={list} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardDetailPage;
