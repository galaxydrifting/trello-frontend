import { useRef } from 'react';
import { Card } from './types';
import BoardCardEditForm from './BoardCardEditForm';
import BoardCardDisplay from './BoardCardDisplay';

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
  const cardRef = useRef<HTMLDivElement>(null);

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
    >
      {editMode ? (
        <BoardCardEditForm
          card={card}
          setEditMode={setEditMode}
          onCancel={onCancel}
          titlePlaceholder={titlePlaceholder}
          contentPlaceholder={contentPlaceholder}
          onEditCard={onEditCard}
        />
      ) : (
        <BoardCardDisplay card={card} setEditMode={setEditMode} />
      )}
    </div>
  );
};

export default BoardCard;
