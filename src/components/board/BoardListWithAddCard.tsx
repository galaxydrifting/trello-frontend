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
  isListEditing?: boolean;
  setIsListEditing?: (v: boolean) => void;
  editingCardId?: string | null;
  setEditingCardId?: (id: string | null) => void;
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
  isListEditing,
  setIsListEditing,
  editingCardId,
  setEditingCardId,
}: BoardListWithAddCardProps) => {
  const [isListEditingState, setIsListEditingState] = useState(false);
  const [editingCardIdState, setEditingCardIdState] = useState<string | null>(null);
  const [tempCard, setTempCard] = useState<null | { id: string; title: string; content: string }>(
    null
  );
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCardClick = () => {
    if (isPending || isAdding) return;
    const tempId = 'temp-' + uuidv4();
    setTempCard({ id: tempId, title: '', content: '' });
    setEditingCardIdState(tempId);
    setIsAdding(true);
  };

  const handleSaveTempCard = (id: string, title: string, content: string) => {
    if (!title.trim()) return;
    if (tempCard && id === tempCard.id) {
      onAddCard(list.id, title, content);
      setTempCard(null);
      setEditingCardIdState(null);
      setIsAdding(false);
    } else if (onEditCard) {
      onEditCard(id, title, content);
    }
  };

  const handleCancelTempCard = (id: string) => {
    if (tempCard && id === tempCard.id) {
      setTempCard(null);
      setEditingCardIdState(null);
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
        isListEditing={isListEditing ?? isListEditingState}
        setIsListEditing={setIsListEditing ?? setIsListEditingState}
        editingCardId={editingCardId ?? editingCardIdState}
        setEditingCardId={setEditingCardId ?? setEditingCardIdState}
        disableCardDrag={!!(isListEditing ?? isListEditingState)}
        onAddCard={handleAddCardClick}
        tempCardId={tempCard?.id}
        onCancelTempCard={handleCancelTempCard}
      />
    </div>
  );
};

export default BoardListWithAddCard;
