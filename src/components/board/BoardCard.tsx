import { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from './types';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './MenuBar';

interface BoardCardProps {
  card: Card;
  onEdit?: (id: string, title: string, content: string) => void;
  onDelete?: (id: string) => void;
  isEditing?: boolean;
  isDeleting?: boolean;
  editMode?: boolean;
  setEditMode?: (v: boolean) => void;
  // 新增
  onCancel?: () => void;
  titlePlaceholder?: string;
  contentPlaceholder?: string;
}

const BoardCard = ({
  card,
  onEdit,
  onDelete,
  isEditing,
  isDeleting,
  editMode = false,
  setEditMode,
  onCancel,
  titlePlaceholder,
  contentPlaceholder,
}: BoardCardProps) => {
  const [editTitle, setEditTitle] = useState(card.title);
  const [isBlurring, setIsBlurring] = useState(false); // 防止重複觸發

  // 判斷是否為暫存卡片（尚未送出到後端）
  const isTempCard = card.id.startsWith('temp-');

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

  const cardRef = useRef<HTMLDivElement>(null);

  // 失焦時自動儲存（只要焦點離開整個卡片區塊就儲存）
  const handleCardBlur = useCallback(
    async (e: React.FocusEvent<HTMLDivElement>) => {
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
    },
    [cardRef, isBlurring, onEdit, editTitle, editor, card.id, setEditMode]
  );

  // MenuBar 事件也用 useCallback 包裝
  const handleCancel = useCallback(() => {
    if (onCancel) onCancel();
    if (setEditMode) setEditMode(false);
  }, [onCancel, setEditMode]);

  const handleDelete = useCallback(async () => {
    if (onDelete) await onDelete(card.id);
    if (setEditMode) setEditMode(false);
  }, [onDelete, card.id, setEditMode]);

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-xl min-h-[60px] p-2 transition-all duration-200 
        ${
          editMode
            ? 'border-2 border-blue-400 shadow-lg ring-2 ring-blue-100'
            : 'border border-gray-200 shadow-md'
        }
      `}
      onDoubleClick={() => !editMode && setEditMode && setEditMode(true)}
      tabIndex={editMode ? 0 : -1}
      style={{ cursor: editMode ? 'auto' : 'pointer' }}
      onBlur={editMode ? handleCardBlur : undefined}
    >
      {editMode ? (
        <div className="flex flex-col gap-1 h-full min-h-[180px]">
          <input
            className="border border-gray-300 rounded-md px-2 py-1 mb-1 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={isEditing}
            required
            autoFocus
            placeholder={titlePlaceholder}
          />
          <div
            className="prose prose-sm border border-gray-300 rounded-md px-2 py-1 mb-1 min-h-[80px] bg-white text-left flex-1 relative focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-400 focus-within:border-2 focus-within:outline-none focus-within:outline-0 transition"
            tabIndex={0}
            style={{ outline: 'none', boxShadow: 'none', padding: 0 }}
          >
            <EditorContent
              editor={editor}
              style={{ outline: 'none', boxShadow: 'none' }} // 移除 inline padding，統一用 CSS 控制
              {...(editMode ? { onPointerDown: (e) => e.stopPropagation() } : {})}
            />
            {/* 只在內容區為空時顯示 placeholder，且不影響清單外觀 */}
            {contentPlaceholder && !editor?.getText().trim() && editMode && (
              <div className="absolute left-2 top-1 text-gray-300 pointer-events-none select-none z-10">
                {contentPlaceholder}
              </div>
            )}
          </div>
          <div className="mt-auto pt-1 flex gap-2">
            <MenuBar
              editor={editor}
              isTempCard={isTempCard}
              isDeleting={isDeleting}
              onCancel={handleCancel}
              onDelete={handleDelete}
            />
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
    </div>
  );
};

export default BoardCard;
