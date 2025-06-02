import { useState, useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './MenuBar';
import { useBoardEditContext } from '../../hooks/BoardEditContext';
import { Card } from './types';

interface BoardCardEditFormProps {
  card: Card;
  setEditMode?: (v: boolean) => void;
  onCancel?: () => void;
  titlePlaceholder?: string;
  contentPlaceholder?: string;
  onEditCard?: (id: string, title: string, content: string) => void;
}

// 單一職責：只負責編輯模式下的卡片表單
const BoardCardEditForm = ({
  card,
  setEditMode,
  onCancel,
  titlePlaceholder,
  contentPlaceholder,
  onEditCard,
}: BoardCardEditFormProps) => {
  const {
    isEditingCard,
    isDeletingCard,
    onEditCard: contextOnEditCard,
    onDeleteCard,
  } = useBoardEditContext();
  const [editTitle, setEditTitle] = useState(card.title);
  const [isBlurring, setIsBlurring] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Tiptap 編輯器
  const editor = useEditor({
    extensions: [StarterKit],
    content: card.content || '',
    editable: true,
  });

  // 進入編輯模式時重設內容
  useEffect(() => {
    setEditTitle(card.title);
    if (editor) {
      editor.commands.setContent(card.content || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.title, card.content]);

  // 失焦時直接儲存
  const handleCardBlur = async (e: React.FocusEvent<HTMLDivElement>) => {
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
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    if (setEditMode) setEditMode(false);
  };

  const handleDelete = async () => {
    if (onDeleteCard) {
      await onDeleteCard(card.listId, card.id);
    }
    if (setEditMode) setEditMode(false);
  };

  const handleSave = async () => {
    if (onEditCard && editor) {
      await onEditCard(card.id, editTitle, editor.getHTML());
    }
    if (setEditMode) setEditMode(false);
  };

  const isTempCard = card.id.startsWith('temp-');

  return (
    <div
      ref={cardRef}
      className="flex flex-col gap-1 h-full min-h-[180px]"
      tabIndex={0}
      onBlur={handleCardBlur}
    >
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
          onPointerDown={(e) => e.stopPropagation()}
        />
        {contentPlaceholder && !editor?.getText().trim() && (
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
  );
};

export default BoardCardEditForm;
