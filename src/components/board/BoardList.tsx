import { useState } from 'react';
import { List } from './types';
import BoardCard from './BoardCard';

interface BoardListProps {
  list: List;
  onEdit?: (id: string, name: string) => void;
  onDelete?: (id: string) => void;
  isEditing?: boolean;
  isDeleting?: boolean;
  onEditCard?: (id: string, title: string, content: string) => void;
  onDeleteCard?: (id: string) => void;
  isEditingCard?: boolean;
  isDeletingCard?: boolean;
}

const BoardList = ({
  list,
  onEdit,
  onDelete,
  isEditing,
  isDeleting,
  onEditCard,
  onDeleteCard,
  isEditingCard,
  isDeletingCard,
}: BoardListProps) => {
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(list.name);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="bg-white rounded shadow p-4 min-w-[260px]">
      {editMode ? (
        <form
          className="flex gap-2 mb-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (onEdit && editName.trim()) {
              onEdit(list.id, editName.trim());
              setEditMode(false);
            }
          }}
        >
          <input
            className="border rounded px-2 py-1 flex-1"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            disabled={isEditing}
            autoFocus
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-2 py-1 rounded"
            disabled={isEditing || !editName.trim()}
          >
            儲存
          </button>
          <button
            type="button"
            className="px-2 py-1"
            onClick={() => setEditMode(false)}
            disabled={isEditing}
          >
            取消
          </button>
        </form>
      ) : (
        <div className="flex items-center mb-2 gap-2">
          <h2 className="font-semibold flex-1 cursor-pointer" onClick={() => setEditMode(true)}>
            {list.name}
          </h2>
          <button
            className="text-blue-600 px-2 py-1"
            onClick={() => setEditMode(true)}
            disabled={isEditing}
          >
            編輯
          </button>
          <button
            className="text-red-600 px-2 py-1"
            onClick={() => setShowDelete(true)}
            disabled={isDeleting}
          >
            刪除
          </button>
        </div>
      )}
      <div className="min-h-[40px] bg-gray-50 rounded p-2">
        {list.cards.length === 0 ? (
          <div className="text-gray-400 text-sm">尚無卡片</div>
        ) : (
          <ul className="space-y-2">
            {list.cards.map((card) => (
              <BoardCard
                key={card.id}
                card={card}
                onEdit={onEditCard}
                onDelete={onDeleteCard}
                isEditing={isEditingCard}
                isDeleting={isDeletingCard}
              />
            ))}
          </ul>
        )}
      </div>
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow">
            <div className="mb-2">確定要刪除「{list.name}」嗎？</div>
            <div className="flex gap-2 justify-end">
              <button
                className="px-3 py-1 bg-gray-200 rounded"
                onClick={() => setShowDelete(false)}
                disabled={isDeleting}
              >
                取消
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded"
                onClick={() => {
                  if (onDelete) onDelete(list.id);
                  setShowDelete(false);
                }}
                disabled={isDeleting}
              >
                確定刪除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardList;
