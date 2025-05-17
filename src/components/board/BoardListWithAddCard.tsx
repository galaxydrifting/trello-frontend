import { useState } from 'react';
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

  return (
    <div className="min-w-[260px]">
      {/* 傳遞編輯狀態與 setter */}
      <BoardList
        list={list}
        onEdit={onEditList}
        onDelete={onDeleteList}
        isEditing={isEditingList}
        isDeleting={isDeletingList}
        onEditCard={onEditCard}
        onDeleteCard={onDeleteCard}
        isEditingCard={isEditingCard}
        isDeletingCard={isDeletingCard}
        isListEditing={isListEditing ?? isListEditingState}
        setIsListEditing={setIsListEditing ?? setIsListEditingState}
        editingCardId={editingCardId ?? editingCardIdState}
        setEditingCardId={setEditingCardId ?? setEditingCardIdState}
        disableCardDrag={!!(isListEditing ?? isListEditingState)}
        onAddCard={(listId) => {
          if (!isPending) onAddCard(listId, '', '');
        }}
      />
    </div>
  );
};

export default BoardListWithAddCard;
