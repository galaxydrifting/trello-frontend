import { useState, useEffect } from 'react';
import { Board } from '../components/board/types';

interface UseBoardListsStateResult {
  lists: Board['lists'];
  setLists: React.Dispatch<React.SetStateAction<Board['lists']>>;
  localCards: Record<string, Board['lists'][0]['cards']>;
  setLocalCards: React.Dispatch<React.SetStateAction<Record<string, Board['lists'][0]['cards']>>>;
}

export function useBoardListsState(board?: Board): UseBoardListsStateResult {
  const [lists, setLists] = useState<Board['lists']>([]);
  const [localCards, setLocalCards] = useState<Record<string, Board['lists'][0]['cards']>>({});

  useEffect(() => {
    if (board) {
      setLists(board.lists);
      const cardsMap: Record<string, Board['lists'][0]['cards']> = {};
      board.lists.forEach((l) => {
        cardsMap[l.id] = l.cards;
      });
      setLocalCards(cardsMap);
    }
  }, [board]);

  return { lists, setLists, localCards, setLocalCards };
}
