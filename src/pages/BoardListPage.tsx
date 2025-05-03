import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Board } from '../components/board/types';
import { fetchBoards, createBoard, updateBoard, deleteBoard } from '../api/board';
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

  const updateBoardMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateBoard(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: (id: string) => deleteBoard(id),
    onSuccess: () => {
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
      <h1 className="text-2xl font-bold mb-6">看板列表</h1>
      <form
        className="flex gap-2 mb-8 bg-white rounded-xl shadow-md p-4 items-center"
        onSubmit={handleCreateBoard}
      >
        <input
          type="text"
          className="border border-indigo-200 rounded-lg px-3 py-2 flex-1 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
          placeholder="輸入新看板名稱"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          disabled={createBoardMutation.isPending}
        />
        <button
          type="submit"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 disabled:bg-indigo-300 transition font-semibold text-base"
          disabled={createBoardMutation.isPending || !newBoardName.trim()}
        >
          <FaPlus />
          {createBoardMutation.isPending ? '新增中...' : '新增看板'}
        </button>
      </form>
      <ul className="space-y-4">
        {boards.map((board) => (
          <BoardListItem
            key={board.id}
            board={board}
            onClick={(id) => navigate(`/boards/${id}`)}
            onEdit={(id, name) => updateBoardMutation.mutate({ id, name })}
            onDelete={(id) => deleteBoardMutation.mutate(id)}
            isEditing={updateBoardMutation.isPending}
            isDeleting={deleteBoardMutation.isPending}
          />
        ))}
      </ul>
    </div>
  );
};

export default BoardListPage;
