import { Card } from './types';

interface BoardCardDisplayProps {
  card: Card;
  setEditMode?: (v: boolean) => void;
}

// 單一職責：只負責顯示模式下的卡片內容
const BoardCardDisplay = ({ card, setEditMode }: BoardCardDisplayProps) => (
  <div onDoubleClick={() => setEditMode && setEditMode(true)} className="select-none">
    <div className="font-medium">{card.title}</div>
    <div
      className="prose prose-sm text-gray-600 text-sm text-left"
      dangerouslySetInnerHTML={{ __html: card.content }}
    />
  </div>
);

export default BoardCardDisplay;
