import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import BoardList from './BoardList';
import { List } from './types';

interface BoardListWithAddCardProps {
  list: List;
  onAddCard: (listId: string, title: string, content: string) => void;
  isPending: boolean;
  onEditList?: (id: string, name: string) => void;
  onDeleteList?: (id: string) => void;
  isEditingList?: boolean;
  isDeletingList?: boolean;
  onEditCard?: (id: string, title: string, content: string) => void;
  onDeleteCard?: (id: string) => void;
  isEditingCard?: boolean;
  isDeletingCard?: boolean;
}

const BoardListWithAddCard = ({
  list,
  onAddCard,
  isPending,
  onEditList,
  onDeleteList,
  isEditingList,
  isDeletingList,
  onEditCard,
  onDeleteCard,
  isEditingCard,
  isDeletingCard,
}: BoardListWithAddCardProps) => {
  const [tempCard, setTempCard] = useState<null | { id: string; title: string; content: string }>(
    null
  );
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCardClick = () => {
    if (isPending || isAdding) return;
    const tempId = 'temp-' + uuidv4();
    setTempCard({ id: tempId, title: '', content: '' });
    setIsAdding(true);
  };

  const handleSaveTempCard = (id: string, title: string, content: string) => {
    if (!title.trim()) return;
    if (tempCard && id === tempCard.id) {
      onAddCard(list.id, title, content);
      setTempCard(null);
      setIsAdding(false);
    } else if (onEditCard) {
      onEditCard(id, title, content);
    }
  };

  const handleCancelTempCard = (id: string) => {
    if (tempCard && id === tempCard.id) {
      setTempCard(null);
      setIsAdding(false);
    }
  };

  const cards = tempCard ? [tempCard, ...list.cards] : list.cards;

  return (
    <div className="min-w-[260px]">
      <BoardList
        list={{ ...list, cards }}
        onEdit={onEditList}
        onDelete={onDeleteList}
        onEditCard={handleSaveTempCard}
        onDeleteCard={onDeleteCard}
        isEditing={isEditingList}
        isDeleting={isDeletingList}
        isEditingCard={isEditingCard}
        isDeletingCard={isDeletingCard}
        disableCardDrag={!!isEditingList}
        onAddCard={handleAddCardClick}
        tempCardId={tempCard?.id}
        onCancelTempCard={handleCancelTempCard}
      />
    </div>
  );
};

export default BoardListWithAddCard;
