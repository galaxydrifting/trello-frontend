import { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from './types';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './MenuBar';
import { useBoardEditContext } from '../../hooks/BoardEditContext';

interface BoardCardProps {
  card: Card;
  editMode?: boolean;
  setEditMode?: (v: boolean) => void;
  onCancel?: () => void;
  titlePlaceholder?: string;
  contentPlaceholder?: string;
  onEditCard?: (id: string, title: string, content: string) => void;
}

const BoardCard = ({
  card,
  editMode = false,
  setEditMode,
  onCancel,
  titlePlaceholder,
  contentPlaceholder,
  onEditCard,
}: BoardCardProps) => {
  const {
    isEditingCard,
    isDeletingCard,
    onEditCard: contextOnEditCard,
    onDeleteCard,
  } = useBoardEditContext();
  const [editTitle, setEditTitle] = useState(card.title);
  const [isBlurring, setIsBlurring] = useState(false); // 防止重複觸發
  const cardRef = useRef<HTMLDivElement>(null);

  // 新增：每次進入編輯模式時重設暫存內容
  useEffect(() => {
    if (editMode) {
      setEditTitle(card.title);
      if (editor) {
        editor.commands.setContent(card.content || '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, card.title, card.content]);

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

  // 失焦時直接儲存
  const handleCardBlur = useCallback(
    async (e: React.FocusEvent<HTMLDivElement>) => {
      if (cardRef.current && !cardRef.current.contains(e.relatedTarget as Node)) {
        if (!isBlurring) {
          setIsBlurring(true);
          if ((onEditCard || contextOnEditCard) && editor) {
            await (onEditCard || contextOnEditCard)?.(card.id, editTitle, editor.getHTML());
          }
          setIsBlurring(false);
          if (setEditMode) setEditMode(false);
        }
      }
    },
    [cardRef, isBlurring, onEditCard, contextOnEditCard, editTitle, editor, card.id, setEditMode]
  );

  // MenuBar 事件也用 useCallback 包裝
  const handleCancel = useCallback(() => {
    if (onCancel) onCancel();
    if (setEditMode) setEditMode(false);
  }, [onCancel, setEditMode]);

  const handleDelete = useCallback(async () => {
    if (onDeleteCard) await onDeleteCard(card.listId, card.id);
    if (setEditMode) setEditMode(false);
  }, [onDeleteCard, card.listId, card.id, setEditMode]);

  // 儲存按鈕事件
  const handleSave = async () => {
    if (onEditCard && editor) {
      await onEditCard(card.id, editTitle, editor.getHTML());
    }
    if (setEditMode) setEditMode(false);
  };

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
            className="border rounded-md px-2 py-1 mb-1 focus:ring-2 focus:ring-blue-200 focus:outline-none transition border-gray-300"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={isEditingCard}
            autoFocus
            placeholder={titlePlaceholder}
          />
          <div
            className="prose prose-sm border rounded-md px-2 py-1 mb-1 min-h-[80px] bg-white text-left flex-1 relative focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-400 focus-within:border-2 focus-within:outline-none focus-within:outline-0 transition border-gray-300"
            tabIndex={0}
            style={{ outline: 'none', boxShadow: 'none', padding: 0 }}
          >
            <EditorContent
              editor={editor}
              style={{ outline: 'none', boxShadow: 'none' }}
              {...(editMode ? { onPointerDown: (e) => e.stopPropagation() } : {})}
            />
            {contentPlaceholder && !editor?.getText().trim() && editMode && (
              <div className="absolute left-2 top-1 text-gray-300 pointer-events-none select-none z-10">
                {contentPlaceholder}
              </div>
            )}
          </div>
          <div className="mt-auto pt-1 flex gap-2 items-center">
            <MenuBar
              editor={editor}
              isDeleting={isDeletingCard}
              isTempCard={isTempCard}
              onDelete={handleDelete}
              onSave={handleSave}
              onCancel={isTempCard ? handleCancel : () => setEditMode && setEditMode(false)}
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
