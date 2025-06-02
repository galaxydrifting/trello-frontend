import { FC } from 'react';

export type DeleteBoardModalProps = {
  boardName: string;
  isOpen: boolean;
  isDeleting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * 刪除看板確認 Modal，需搭配 createPortal 使用
 */
const DeleteBoardModal: FC<DeleteBoardModalProps> = ({
  boardName,
  isOpen,
  isDeleting = false,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-label="刪除看板確認"
    >
      <div className="bg-white p-4 rounded shadow min-w-[260px]">
        <div className="mb-2">確定要刪除「{boardName}」嗎？</div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-gray-200 rounded"
            onClick={onCancel}
            disabled={isDeleting}
            aria-label="取消刪除"
            type="button"
          >
            取消
          </button>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded"
            onClick={onConfirm}
            disabled={isDeleting}
            aria-label="確定刪除"
            type="button"
          >
            確定刪除
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBoardModal;
