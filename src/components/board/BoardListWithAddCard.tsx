import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import BoardList from './BoardList';
import { List } from './types';
import { useBoardEditContext } from '../../hooks/BoardEditContext';

interface BoardListWithAddCardProps {
  list: List;
}

const BoardListWithAddCard = ({ list }: BoardListWithAddCardProps) => {
  const { editingListId, setEditingListId, setEditingCardId, onAddCard, isCreatingCard } =
    useBoardEditContext();
  const [tempCard, setTempCard] = useState<null | import('./types').Card>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCardClick = () => {
    if (isCreatingCard || isAdding) return;
    const tempId = 'temp-' + uuidv4();
    setTempCard({
      id: tempId,
      title: '',
      content: '',
      position: 0, // 暫存卡片預設 0
      listId: list.id,
      boardId: list.boardId,
    });
    setEditingListId(null); // 確保不會有清單在編輯
    setEditingCardId(tempId); // 直接呼叫，不用 setTimeout
    setIsAdding(true);
  };

  // 無論內容是否為空都要送出
  const handleSaveTempCard = (id: string, title: string, content: string) => {
    if (tempCard && id === tempCard.id) {
      onAddCard(list.id, title, content);
      setTempCard(null);
      setEditingListId(null);
      setIsAdding(false);
    }
  };

  const handleCancelTempCard = (id: string) => {
    if (tempCard && id === tempCard.id) {
      setTempCard(null);
      setEditingListId(null);
      setIsAdding(false);
    }
  };

  const cards = tempCard ? [tempCard, ...list.cards] : list.cards;

  return (
    <div className="min-w-[260px]">
      <BoardList
        list={{ ...list, cards }}
        isListEditing={editingListId === list.id}
        setIsListEditing={(v: boolean) => setEditingListId(v ? list.id : null)}
        disableCardDrag={!!(editingListId === list.id)}
        onAddCard={handleAddCardClick}
        onEditCard={handleSaveTempCard}
        tempCardId={tempCard?.id}
        onCancelTempCard={handleCancelTempCard}
      />
    </div>
  );
};

export default BoardListWithAddCard;
