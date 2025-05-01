import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Board } from '../components/board/types';
import { fetchBoards, createBoard } from '../api/board';
import BoardListItem from '../components/board/BoardListItem';

const BoardListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newBoardName, setNewBoardName] = useState('');

  const {
    data: boards = [],
    isLoading,
    isError,
  } = useQuery<Board[], Error>({
    queryKey: ['boards'],
    queryFn: fetchBoards,
    retry: 1,
  });

  const createBoardMutation = useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      setNewBoardName('');
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    createBoardMutation.mutate(newBoardName.trim());
  };

  if (isLoading) return <div>載入中...</div>;
  if (isError) return <div>無法取得看板列表</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">看板列表</h1>
      <form className="flex gap-2 mb-4" onSubmit={handleCreateBoard}>
        <input
          type="text"
          className="border rounded px-2 py-1 flex-1"
          placeholder="輸入新看板名稱"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          disabled={createBoardMutation.isPending}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-1 rounded disabled:bg-indigo-300"
          disabled={createBoardMutation.isPending || !newBoardName.trim()}
        >
          {createBoardMutation.isPending ? '新增中...' : '新增看板'}
        </button>
      </form>
      <ul className="space-y-2">
        {boards.map((board) => (
          <BoardListItem key={board.id} board={board} onClick={(id) => navigate(`/boards/${id}`)} />
        ))}
      </ul>
    </div>
  );
};

export default BoardListPage;
