import { Card } from './types';

const BoardCard = ({ card }: { card: Card }) => (
  <li className="bg-white border rounded p-2 shadow-sm">
    <div className="font-medium">{card.title}</div>
    <div className="text-gray-600 text-sm">{card.content}</div>
  </li>
);

export default BoardCard;
