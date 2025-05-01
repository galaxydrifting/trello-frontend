import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Board } from '../components/board/types';
import BoardList from '../components/board/BoardList';
import { fetchBoard, createList } from '../api/board';

const BoardDetailPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const queryClient = useQueryClient();
  const [newListName, setNewListName] = useState('');

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

  const createListMutation = useMutation({
    mutationFn: (name: string) => createList(boardId!, name),
    onSuccess: () => {
      setNewListName('');
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });

  if (isLoading) return <div>載入中...</div>;
  if (isError || !board) return <div>無法取得看板資料</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{board.name}</h1>
      <form
        className="flex gap-2 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!newListName.trim()) return;
          createListMutation.mutate(newListName.trim());
        }}
      >
        <input
          type="text"
          className="border rounded px-2 py-1 flex-1"
          placeholder="輸入新清單名稱"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          disabled={createListMutation.isPending}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-1 rounded disabled:bg-indigo-300"
          disabled={createListMutation.isPending || !newListName.trim()}
        >
          {createListMutation.isPending ? '新增中...' : '新增清單'}
        </button>
      </form>
      {board.lists.length === 0 ? (
        <div className="text-gray-400 text-center py-8">尚無清單</div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {board.lists.map((list) => (
            <BoardList key={list.id} list={list} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardDetailPage;
