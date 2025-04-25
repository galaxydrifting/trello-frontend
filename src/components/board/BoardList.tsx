import { List } from './types';
import BoardCard from './BoardCard';

const BoardList = ({ list }: { list: List }) => (
  <div className="bg-white rounded shadow p-4">
    <h2 className="font-semibold mb-2">{list.name}</h2>
    <div className="min-h-[40px] bg-gray-50 rounded p-2">
      {list.cards.length === 0 ? (
        <div className="text-gray-400 text-sm">尚無卡片</div>
      ) : (
        <ul className="space-y-2">
          {list.cards.map((card) => (
            <BoardCard key={card.id} card={card} />
          ))}
        </ul>
      )}
    </div>
  </div>
);

export default BoardList;
