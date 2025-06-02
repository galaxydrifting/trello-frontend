import { useState, useEffect, useRef } from 'react';
import SortableCardItem from './SortableCardItem';
import { List } from './types';
import BoardCard from './BoardCard';
import { useBoardEditContext } from '../../hooks/BoardEditContext';
import DeleteListModal from './DeleteListModal';

interface BoardListProps {
  list: List;
  isListEditing?: boolean;
  setIsListEditing?: (v: boolean) => void;
  disableCardDrag?: boolean;
  onAddCard?: (listId: string) => void;
  onEditCard?: (id: string, title: string, content: string) => void;
  tempCardId?: string | null;
  onCancelTempCard?: (id: string) => void;
}

const BoardList = (props: BoardListProps) => {
  const {
    editingCardId,
    setEditingCardId,
    isEditingList,
    isDeletingList,
    onEditList,
    onDeleteList,
  } = useBoardEditContext();
  const {
    list,
    isListEditing,
    setIsListEditing,
    disableCardDrag = false,
    onAddCard,
    onEditCard,
    tempCardId,
    onCancelTempCard,
  } = props;
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
    if (onEditList && editName.trim() && editName !== list.name) {
      setEditName(editName.trim());
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
          editMode
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
            disabled={isDeletingList}
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
            disabled={isEditingList}
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
                  editMode={editingCardId === card.id}
                  setEditMode={(v: boolean) => setEditingCardId(v ? card.id : null)}
                  {...(tempCardId === card.id && onEditCard
                    ? { onCancel: () => onCancelTempCard && onCancelTempCard(card.id), onEditCard }
                    : {})}
                  {...(tempCardId === card.id
                    ? { titlePlaceholder: '輸入卡片標題', contentPlaceholder: '輸入卡片內容' }
                    : {})}
                />
              </SortableCardItem>
            ))}
          </ul>
        )}
      </div>
      {showDelete && (
        <DeleteListModal
          listName={list.name}
          open={showDelete}
          isDeleting={isDeletingList}
          onCancel={() => setShowDelete(false)}
          onConfirm={() => {
            if (onDeleteList) onDeleteList(list.id);
            setShowDelete(false);
          }}
        />
      )}
    </div>
  );
};

export default BoardList;
