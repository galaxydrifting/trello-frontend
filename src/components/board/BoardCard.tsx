import { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from './types';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './MenuBar';
import { useBoardEditContext } from './BoardEditContext';

interface BoardCardProps {
  card: Card;
  editMode?: boolean;
  setEditMode?: (v: boolean) => void;
  // 新增
  onCancel?: () => void;
  titlePlaceholder?: string;
  contentPlaceholder?: string;
}

const BoardCard = ({
  card,
  editMode,
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

  // 取 context
  const {
    editingCardId,
    setEditingCardId,
    canEdit,
    onEditCard,
    onDeleteCard,
    isPendingEditCard,
    isPendingDeleteCard,
    editingListId,
  } = useBoardEditContext();
  // 讓 editable 狀態隨 editMode/context 變化
  useEffect(() => {
    const mode = typeof editMode === 'boolean' ? editMode : editingCardId === card.id;
    if (editor) {
      editor.setEditable(mode);
    }
  }, [editMode, editingCardId, card.id, editor]);

  const cardRef = useRef<HTMLDivElement>(null);

  // 失焦時自動儲存（只要焦點離開整個卡片區塊就儲存）
  const handleCardBlur = useCallback(
    async (e: React.FocusEvent<HTMLDivElement>) => {
      if (cardRef.current && !cardRef.current.contains(e.relatedTarget as Node)) {
        if (!isBlurring) {
          setIsBlurring(true);
          if (isTempCard) {
            // 新增卡片時，交由 onEditCard 處理（只傳 id, title, content）
            if (onEditCard && editTitle.trim() && editor) {
              onEditCard(card.id, editTitle.trim(), editor.getHTML());
            }
          } else {
            // 一般卡片編輯
            if (onEditCard && editTitle.trim() && editor) {
              onEditCard(card.id, editTitle.trim(), editor.getHTML());
            }
          }
          setIsBlurring(false);
          if (setEditMode) setEditMode(false);
        }
      }
    },
    [cardRef, isBlurring, onEditCard, editTitle, editor, card.id, setEditMode, isTempCard]
  );

  // MenuBar 事件也用 useCallback 包裝
  const handleCancel = useCallback(() => {
    if (onCancel) onCancel();
    if (setEditMode) setEditMode(false);
  }, [onCancel, setEditMode]);

  const handleDelete = useCallback(async () => {
    if (onDeleteCard && editingListId) await onDeleteCard(editingListId, card.id);
    if (setEditMode) setEditMode(false);
  }, [onDeleteCard, editingListId, card.id, setEditMode]);

  // 若有傳入 editMode/setEditMode 則優先用 props，否則用 context
  const effectiveEditMode = typeof editMode === 'boolean' ? editMode : editingCardId === card.id;
  const effectiveSetEditMode = setEditMode
    ? setEditMode
    : (v: boolean) => {
        if (v && canEdit) setEditingCardId(card.id);
        if (!v) setEditingCardId(null);
      };

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-xl min-h-[60px] p-2 transition-all duration-200 
        ${
          effectiveEditMode
            ? 'border-2 border-blue-400 shadow-lg ring-2 ring-blue-100'
            : 'border border-gray-200 shadow-md'
        }
      `}
      onDoubleClick={() => !effectiveEditMode && effectiveSetEditMode(true)}
      tabIndex={effectiveEditMode ? 0 : -1}
      style={{ cursor: effectiveEditMode ? 'auto' : 'pointer' }}
      onBlur={effectiveEditMode ? handleCardBlur : undefined}
    >
      {effectiveEditMode ? (
        <div className="flex flex-col gap-1 h-full min-h-[180px]">
          <input
            className="border border-gray-300 rounded-md px-2 py-1 mb-1 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={isPendingEditCard}
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
              style={{ outline: 'none', boxShadow: 'none' }}
              {...(effectiveEditMode ? { onPointerDown: (e) => e.stopPropagation() } : {})}
            />
            {contentPlaceholder && !editor?.getText().trim() && effectiveEditMode && (
              <div className="absolute left-2 top-1 text-gray-300 pointer-events-none select-none z-10">
                {contentPlaceholder}
              </div>
            )}
          </div>
          <div className="mt-auto pt-1 flex gap-2">
            <MenuBar
              editor={editor}
              isTempCard={isTempCard}
              isDeleting={isPendingDeleteCard}
              onCancel={handleCancel}
              onDelete={handleDelete}
            />
          </div>
        </div>
      ) : (
        <div onDoubleClick={() => effectiveSetEditMode(true)} className="select-none">
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
