import { createPortal } from 'react-dom';

interface DeleteListModalProps {
  listName: string;
  open: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteListModal = ({
  listName,
  open,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteListModalProps) => {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 transition-colors">
      <div className="bg-white p-4 rounded shadow">
        <div className="mb-2">確定要刪除「{listName}」嗎？</div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-gray-200 rounded"
            onClick={onCancel}
            disabled={isDeleting}
          >
            取消
          </button>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            確定刪除
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteListModal;
