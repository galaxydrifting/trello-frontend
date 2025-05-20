import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import BoardList from './BoardList';
import { List } from './types';

interface BoardListWithAddCardProps {
  list: List;
}

const BoardListWithAddCard = ({ list }: BoardListWithAddCardProps) => {
  const [tempCard, setTempCard] = useState<null | { id: string; title: string; content: string }>(
    null
  );
  const [isAdding, setIsAdding] = useState(false);

  // 只負責新增卡片的暫存 UI 狀態，mutation/CRUD 交由 BoardList 內部 context 處理
  const handleAddCardClick = () => {
    if (isAdding) return;
    const tempId = 'temp-' + uuidv4();
    setTempCard({ id: tempId, title: '', content: '' });
    setIsAdding(true);
  };

  const handleSaveTempCard = (id: string, title: string) => {
    if (!title.trim()) return;
    if (tempCard && id === tempCard.id) {
      // 只負責 UI 狀態，實際新增交由 BoardList 內部 context
      setTempCard(null);
      setIsAdding(false);
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
        onAddCard={handleAddCardClick}
        tempCardId={tempCard?.id}
        onCancelTempCard={handleCancelTempCard}
        onEditCard={handleSaveTempCard}
      />
    </div>
  );
};

export default BoardListWithAddCard;
