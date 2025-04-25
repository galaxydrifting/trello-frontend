import { Board } from './types';

type BoardListItemProps = {
  board: Board;
  onClick: (id: string) => void;
};

const BoardListItem = ({ board, onClick }: BoardListItemProps) => (
  <li
    className="p-4 bg-white rounded shadow cursor-pointer hover:bg-gray-100"
    onClick={() => onClick(board.id)}
  >
    {board.name}
  </li>
);

export default BoardListItem;
