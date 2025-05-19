import { MdFormatBold, MdFormatListBulleted, MdFormatListNumbered, MdCancel } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import React from 'react';
import { Editor } from '@tiptap/react';

interface MenuBarProps {
  editor: Editor | null;
  isTempCard: boolean;
  isDeleting?: boolean;
  onCancel?: () => void;
  onDelete?: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({
  editor,
  isTempCard,
  isDeleting,
  onCancel,
  onDelete,
}) => (
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
    {isTempCard ? (
      <button
        type="button"
        className="text-gray-400 hover:text-red-600 transition-colors p-1 outline-none focus-visible:outline-blue-400 focus-visible:rounded border-none shadow-none"
        style={{ boxShadow: 'none', border: 'none' }}
        onClick={onCancel}
        disabled={isDeleting}
        title="取消新增卡片"
        aria-label="取消新增卡片"
      >
        <MdCancel size={22} />
      </button>
    ) : (
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
);

export default MenuBar;
