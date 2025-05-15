import { useState, useEffect, useRef } from 'react';
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
  editMode?: boolean;
  setEditMode?: (v: boolean) => void;
}

const BoardCard = ({
  card,
  onEdit,
  onDelete,
  isEditing,
  isDeleting,
  editMode = false,
  setEditMode,
}: BoardCardProps) => {
  const [editTitle, setEditTitle] = useState(card.title);
  const [showDelete, setShowDelete] = useState(false);
  const [isBlurring, setIsBlurring] = useState(false); // 防止重複觸發

  // Tiptap 編輯器
  const editor = useEditor({
    extensions: [StarterKit],
    content: card.content || '',
    editable: editMode,
  });

  // 讓 editable 狀態隨 editMode 變化
  useEffect(() => {
    if (editor) {
      editor.setEditable(editMode);
    }
  }, [editMode, editor]);

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

  const cardRef = useRef<HTMLDivElement>(null);

  // 失焦時自動儲存（只要焦點離開整個卡片區塊就儲存）
  const handleCardBlur = async (e: React.FocusEvent<HTMLDivElement>) => {
    // relatedTarget 是即將獲得焦點的元素
    if (cardRef.current && !cardRef.current.contains(e.relatedTarget as Node)) {
      if (!isBlurring) {
        setIsBlurring(true);
        if (onEdit && editTitle.trim() && editor) {
          await onEdit(card.id, editTitle.trim(), editor.getHTML());
        }
        setIsBlurring(false);
        if (setEditMode) setEditMode(false);
      }
    }
  };

  return (
    <div
      ref={cardRef}
      className="bg-white border rounded p-2 shadow-sm"
      onDoubleClick={() => !editMode && setEditMode && setEditMode(true)}
      tabIndex={editMode ? 0 : -1}
      style={{ cursor: editMode ? 'auto' : 'pointer' }}
      onBlur={editMode ? handleCardBlur : undefined}
    >
      {editMode ? (
        <div className="flex flex-col gap-1">
          <input
            className="border rounded px-2 py-1 mb-1"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={isEditing}
            required
            autoFocus
          />
          {renderMenuBar()}
          <div
            className="prose prose-sm border rounded px-2 py-1 mb-1 min-h-[80px] bg-white text-left"
            tabIndex={0}
          >
            <EditorContent editor={editor} />
          </div>
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              className="text-red-600 text-xs"
              onClick={() => setShowDelete(true)}
              disabled={isDeleting}
            >
              刪除
            </button>
          </div>
        </div>
      ) : (
        <div onDoubleClick={() => setEditMode && setEditMode(true)} className="select-none">
          <div className="font-medium">{card.title}</div>
          <div
            className="prose prose-sm text-gray-600 text-sm text-left"
            dangerouslySetInnerHTML={{ __html: card.content }}
          />
        </div>
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
