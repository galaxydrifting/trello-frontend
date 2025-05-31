import {
  MdFormatBold,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdCancel,
  MdCheckCircle,
} from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import { Editor } from '@tiptap/react';

interface MenuBarProps {
  editor: Editor | null;
  isDeleting?: boolean;
  onCancel?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  isTempCard?: boolean;
}

const MenuBar = ({ editor, isDeleting, onCancel, onDelete, onSave, isTempCard }: MenuBarProps) => (
  <div className="flex gap-1 items-center w-full justify-between">
    <div className="flex gap-1">
      <button
        type="button"
        className="px-1 border rounded text-lg flex items-center justify-center"
        onClick={() => editor?.chain().focus().toggleBold().run()}
        disabled={!editor}
        aria-label="粗體"
      >
        <MdFormatBold />
      </button>
      <button
        type="button"
        className="px-1 border rounded text-lg flex items-center justify-center"
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        disabled={!editor}
        aria-label="無序清單"
      >
        <MdFormatListBulleted />
      </button>
      <button
        type="button"
        className="px-1 border rounded text-lg flex items-center justify-center"
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        disabled={!editor}
        aria-label="有序清單"
      >
        <MdFormatListNumbered />
      </button>
    </div>
    <div className="flex gap-1 items-center">
      <button
        type="button"
        className="text-green-500 hover:text-green-600 transition-colors p-1 outline-none focus-visible:outline-green-400 focus-visible:rounded border-none shadow-none"
        style={{ boxShadow: 'none', border: 'none' }}
        onClick={onSave}
        disabled={isDeleting}
        title="儲存卡片"
        aria-label="儲存卡片"
      >
        <MdCheckCircle size={22} />
      </button>
      {onCancel && (
        <button
          type="button"
          className="text-gray-400 hover:text-red-600 transition-colors p-1 outline-none focus-visible:outline-blue-400 focus-visible:rounded border-none shadow-none"
          style={{ boxShadow: 'none', border: 'none' }}
          onClick={onCancel}
          disabled={isDeleting}
          title="取消編輯"
          aria-label="取消編輯"
        >
          <MdCancel size={22} />
        </button>
      )}
      {/* 僅非暫存卡片才顯示刪除按鈕 */}
      {onDelete && !isTempCard && (
        <button
          type="button"
          className="text-gray-400 hover:text-red-600 transition-colors p-1 outline-none focus-visible:outline-blue-400 focus-visible:rounded border-none shadow-none"
          style={{ boxShadow: 'none', border: 'none' }}
          onClick={onDelete}
          disabled={isDeleting}
          title="刪除卡片"
          aria-label="刪除卡片"
        >
          <FaRegTrashAlt size={20} />
        </button>
      )}
    </div>
  </div>
);

export default MenuBar;
