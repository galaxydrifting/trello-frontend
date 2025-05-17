import { useState, useEffect, useRef } from 'react';
import SortableCardItem from './SortableCardItem';
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
  isListEditing?: boolean;
  setIsListEditing?: (v: boolean) => void;
  editingCardId?: string | null;
  setEditingCardId?: (id: string | null) => void;
  disableCardDrag?: boolean;
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
  isListEditing,
  setIsListEditing,
  editingCardId,
  setEditingCardId,
  disableCardDrag = false,
}: BoardListProps) => {
  const [editName, setEditName] = useState(list.name);
  const [showDelete, setShowDelete] = useState(false);
  const editMode = !!isListEditing;
  const setEditMode = setIsListEditing || (() => {});
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editMode && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editMode]);

  // 失焦時自動儲存
  const handleBlur = () => {
    if (onEdit && editName.trim() && editName !== list.name) {
      setEditName(editName.trim()); // 立即本地更新
      onEdit(list.id, editName.trim());
    }
    setEditMode(false);
  };

  // 樂觀更新：本地先顯示新名稱
  useEffect(() => {
    setEditName(list.name);
  }, [list.name]);

  return (
    <div className="bg-white rounded shadow p-4 min-w-[260px] relative group">
      {/* 刪除按鈕，右上角，僅 hover 顯示 */}
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition-colors p-1 outline-none focus:outline-none border-none shadow-none hidden group-hover:block"
        style={{ boxShadow: 'none', border: 'none' }}
        onClick={() => setShowDelete(true)}
        disabled={isDeleting}
        title="刪除清單"
        aria-label="刪除清單"
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {editMode ? (
        <form
          className="flex gap-2 mb-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (onEdit && editName.trim() && editName !== list.name) {
              setEditName(editName.trim()); // 立即本地更新
              onEdit(list.id, editName.trim());
            }
            setEditMode(false);
          }}
        >
          <input
            ref={inputRef}
            className="border rounded px-2 py-1 flex-1"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleBlur}
            disabled={isEditing}
            autoFocus
          />
        </form>
      ) : (
        <div className="flex items-center mb-2 gap-2 select-none">
          <h2
            className="font-semibold flex-1 cursor-pointer text-lg"
            onDoubleClick={() => setEditMode(true)}
            title="雙擊編輯清單名稱"
          >
            {list.name}
          </h2>
        </div>
      )}
      <div className="min-h-[40px] bg-gray-50 rounded p-2">
        {list.cards.length === 0 ? (
          <div className="text-gray-400 text-sm">尚無卡片</div>
        ) : (
          <ul className="space-y-2">
            {list.cards.map((card) => (
              <SortableCardItem
                key={card.id}
                id={card.id}
                disabled={disableCardDrag || !!editingCardId}
              >
                <BoardCard
                  card={card}
                  onEdit={onEditCard}
                  onDelete={onDeleteCard}
                  isEditing={isEditingCard}
                  isDeleting={isDeletingCard}
                  editMode={editingCardId === card.id}
                  setEditMode={(v: boolean) =>
                    setEditingCardId && setEditingCardId(v ? card.id : null)
                  }
                />
              </SortableCardItem>
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
