import { useState } from 'react';
import { Card } from './types';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { MdFormatBold, MdFormatListBulleted, MdFormatListNumbered } from 'react-icons/md';

interface BoardCardProps {
  card: Card;
  onEdit?: (id: string, title: string, content: string) => void;
  onDelete?: (id: string) => void;
  isEditing?: boolean;
  isDeleting?: boolean;
}

const BoardCard = ({ card, onEdit, onDelete, isEditing, isDeleting }: BoardCardProps) => {
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [showDelete, setShowDelete] = useState(false);

  // Tiptap 編輯器
  const editor = useEditor({
    extensions: [StarterKit],
    content: card.content || '',
    editable: editMode,
  });

  // 工具列按鈕
  const renderMenuBar = () => (
    <div className="flex gap-1 mb-1">
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
  );

  return (
    <div className="bg-white border rounded p-2 shadow-sm">
      {editMode ? (
        <form
          className="flex flex-col gap-1"
          onSubmit={(e) => {
            e.preventDefault();
            if (onEdit && editTitle.trim() && editor) {
              onEdit(card.id, editTitle.trim(), editor.getHTML());
              setEditMode(false);
            }
          }}
        >
          <input
            className="border rounded px-2 py-1 mb-1"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={isEditing}
            required
            autoFocus
          />
          {renderMenuBar()}
          <div className="prose prose-sm border rounded px-2 py-1 mb-1 min-h-[80px] bg-white">
            <EditorContent editor={editor} />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-2 py-1 rounded"
              disabled={isEditing || !editTitle.trim()}
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
          </div>
        </form>
      ) : (
        <>
          <div className="font-medium">{card.title}</div>
          <div
            className="prose prose-sm text-gray-600 text-sm"
            dangerouslySetInnerHTML={{ __html: card.content }}
          />
          {onEdit && (
            <button
              className="text-blue-600 text-xs mr-2"
              onClick={() => setEditMode(true)}
              disabled={isEditing}
            >
              編輯
            </button>
          )}
          {onDelete && (
            <button
              className="text-red-600 text-xs"
              onClick={() => setShowDelete(true)}
              disabled={isDeleting}
            >
              刪除
            </button>
          )}
        </>
      )}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow">
            <div className="mb-2">確定要刪除「{card.title}」嗎？</div>
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
                  if (onDelete) onDelete(card.id);
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

export default BoardCard;
