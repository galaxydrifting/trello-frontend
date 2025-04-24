import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/config';

interface Card {
  id: string;
  name: string;
}

interface List {
  id: string;
  name: string;
  cards: Card[];
}

interface Board {
  id: string;
  name: string;
  lists: List[];
}

const fetchBoard = async (boardId: string) => {
  const res = await apiClient.post('/graphql/query', {
    query: `query { board(id: "${boardId}") { id name lists { id name cards { id title } } } }`,
  });
  return res.data.data.board;
};

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {board.lists.map((list) => (
          <div key={list.id} className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-2">{list.name}</h2>
            {/* 預留 cards 區塊 */}
            <div className="min-h-[40px] bg-gray-50 rounded p-2">
              {/* 之後可在這裡顯示 cards */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardDetailPage;
