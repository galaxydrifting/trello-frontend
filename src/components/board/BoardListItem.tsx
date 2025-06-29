import { useState } from 'react';
import { Board } from './types';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import DeleteBoardModal from './DeleteBoardModal';

type BoardListItemProps = {
  board: Board;
  onClick: (id: string) => void;
  onEdit?: (id: string, name: string) => void;
  onDelete?: (id: string) => void;
  isEditing?: boolean;
  isDeleting?: boolean;
};

const BoardListItem = ({
  board,
  onClick,
  onEdit,
  onDelete,
  isEditing,
  isDeleting,
}: BoardListItemProps) => {
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(board.name);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <li className="p-4 bg-blue-50 rounded-xl shadow-md flex items-center gap-2 hover:bg-blue-100 transition group">
      {editMode ? (
        <form
          className="flex-1 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (onEdit && editName.trim()) {
              onEdit(board.id, editName.trim());
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
        <>
          <span
            className="flex-1 cursor-pointer font-bold text-lg text-blue-900 group-hover:text-blue-800 transition"
            onClick={() => onClick(board.id)}
          >
            {board.name}
          </span>
          <div className="flex gap-2 items-center ml-auto">
            <button
              className="text-gray-400 hover:text-blue-600 transition-colors p-1 outline-none focus:outline-none border-none shadow-none"
              style={{ boxShadow: 'none', border: 'none' }}
              onClick={() => setEditMode(true)}
              disabled={isEditing}
              title="編輯"
              aria-label="編輯"
            >
              <FaRegEdit size={20} />
            </button>
            <button
              className="text-gray-400 hover:text-red-600 transition-colors p-1 outline-none focus:outline-none border-none shadow-none"
              style={{ boxShadow: 'none', border: 'none' }}
              onClick={() => setShowDelete(true)}
              disabled={isDeleting}
              title="刪除"
              aria-label="刪除"
            >
              <FaRegTrashAlt size={20} />
            </button>
          </div>
        </>
      )}
      {showDelete &&
        createPortal(
          <DeleteBoardModal
            boardName={board.name}
            isOpen={showDelete}
            isDeleting={isDeleting}
            onCancel={() => setShowDelete(false)}
            onConfirm={() => {
              if (onDelete) onDelete(board.id);
              setShowDelete(false);
            }}
          />,
          document.body
        )}
    </li>
  );
};

export default BoardListItem;
