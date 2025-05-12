import { useNavigate } from 'react-router-dom';
import { useBoardList } from '../hooks/useBoardList';
import BoardListItem from '../components/board/BoardListItem';
import BoardCreateForm from '../components/board/BoardCreateForm';

const BoardListPage = () => {
  const navigate = useNavigate();
  const {
    boards,
    isLoading,
    isError,
    newBoardName,
    setNewBoardName,
    createBoardMutation,
    updateBoardMutation,
    deleteBoardMutation,
  } = useBoardList();

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    // 計算最大 position + 1 由 hook 處理
    createBoardMutation.mutate({ name: newBoardName.trim() });
  };

  if (isLoading) return <div>載入中...</div>;
  if (isError) return <div>無法取得看板列表</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">看板列表</h1>
      <BoardCreateForm
        newBoardName={newBoardName}
        setNewBoardName={setNewBoardName}
        onCreate={handleCreateBoard}
        isPending={createBoardMutation.isPending}
      />
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
