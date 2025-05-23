import { useState, useEffect, useRef } from 'react';
import SortableCardItem from './SortableCardItem';
import { List } from './types';
import BoardCard from './BoardCard';
import { useBoardEditContext } from './BoardEditContext';

interface BoardListProps {
  list: List;
  // 新增卡片
  onAddCard?: (listId: string) => void;
  tempCardId?: string | null;
  onCancelTempCard?: (id: string) => void;
  onEditCard?: (id: string, title: string) => void; // for tempCard only
}

const BoardList = ({
  list,
  onAddCard,
  tempCardId,
  onCancelTempCard,
  onEditCard,
}: BoardListProps) => {
  const [editName, setEditName] = useState(list.name);
  const [showDelete, setShowDelete] = useState(false);
  // 取 context
  const {
    editingListId,
    setEditingListId,
    editingCardId,
    setEditingCardId,
    canEdit,
    onEditList,
    onDeleteList,
    isPendingEditList,
    isPendingDeleteList,
  } = useBoardEditContext();
  const editMode = !!(editingListId === list.id);
  const setEditMode = (v: boolean) => {
    if (v && canEdit) setEditingListId(list.id);
    if (!v) setEditingListId(null);
  };
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editMode && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editMode]);

  // 失焦時自動儲存
  const handleBlur = () => {
    if (onEditList && editName.trim() && editName !== list.name) {
      setEditName(editName.trim()); // 立即本地更新
      onEditList(list.id, editName.trim());
    }
    setEditMode(false);
  };

  // 樂觀更新：本地先顯示新名稱
  useEffect(() => {
    setEditName(list.name);
  }, [list.name]);

  return (
    <div
      className={`bg-white rounded-xl min-w-[260px] p-4 relative group transition-all duration-200 
        ${
          editingListId === list.id
            ? 'border-2 border-blue-400 shadow-lg ring-2 ring-blue-100'
            : 'border border-gray-200 shadow-md'
        }
      `}
    >
      {/* 刪除按鈕，右上角，僅 hover 且非編輯狀態下顯示 */}
      {!editMode && (
        <>
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition-colors p-1 focus:outline-none focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:rounded border-none shadow-none hidden group-hover:block"
            tabIndex={0}
            style={{ boxShadow: 'none', border: 'none', outline: 'none' }}
            onClick={() => setShowDelete(true)}
            disabled={isPendingDeleteList}
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
          {/* 新增卡片按鈕，僅 hover 顯示 */}
          {onAddCard && (
            <button
              className="absolute top-2 right-10 text-gray-400 hover:text-green-600 transition-colors p-1 focus:outline-none focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:rounded border-none shadow-none hidden group-hover:block"
              tabIndex={0}
              style={{ boxShadow: 'none', border: 'none', outline: 'none' }}
              onClick={() => onAddCard(list.id)}
              title="新增卡片"
              aria-label="新增卡片"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </>
      )}
      {editMode ? (
        <form
          className="flex gap-2 mb-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (onEditList && editName.trim() && editName !== list.name) {
              setEditName(editName.trim());
              onEditList(list.id, editName.trim());
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
            disabled={isPendingEditList}
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
                disabled={!!isPendingEditList || !!editingCardId}
              >
                <BoardCard
                  card={card}
                  // 只傳遞 tempCard 相關 UI 控制
                  editMode={editingCardId === card.id}
                  setEditMode={(v: boolean) => {
                    if (v && canEdit) setEditingCardId(card.id);
                    if (!v) setEditingCardId(null);
                  }}
                  {...(tempCardId === card.id
                    ? { onCancel: () => onCancelTempCard && onCancelTempCard(card.id) }
                    : {})}
                  {...(tempCardId === card.id ? { titlePlaceholder: '輸入卡片標題' } : {})}
                  {...(tempCardId === card.id ? { onEdit: onEditCard } : {})}
                />
              </SortableCardItem>
            ))}
          </ul>
        )}
      </div>
      {showDelete && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 transition-colors">
          <div className="bg-white p-4 rounded shadow">
            <div className="mb-2">確定要刪除「{list.name}」嗎？</div>
            <div className="flex gap-2 justify-end">
              <button
                className="px-3 py-1 bg-gray-200 rounded"
                onClick={() => setShowDelete(false)}
                disabled={isPendingDeleteList}
              >
                取消
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded"
                onClick={() => {
                  if (onDeleteList) onDeleteList(list.id);
                  setShowDelete(false);
                }}
                disabled={isPendingDeleteList}
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
