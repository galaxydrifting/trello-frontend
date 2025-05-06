import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { Board } from '../components/board/types';

interface UseBoardDnDProps {
  lists: Board['lists'];
  setLists: (lists: Board['lists']) => void;
  localCards: Record<string, Board['lists'][0]['cards']>;
  setLocalCards: (cards: Record<string, Board['lists'][0]['cards']>) => void;
  moveList: (id: string, newIndex: number) => Promise<void>;
  moveCard: (cardId: string, toListId: string, toIndex: number) => Promise<void>;
  invalidateBoard: () => void;
}

export function useBoardDnD({
  lists,
  setLists,
  localCards,
  setLocalCards,
  moveList,
  moveCard,
  invalidateBoard,
}: UseBoardDnDProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeContainer, setActiveContainer] = useState<string | null>(null);

  const findContainer = (id?: string) => {
    if (!id) return null;
    if (lists.find((l) => l.id === id)) return id;
    for (const [listId, cards] of Object.entries(localCards)) {
      if (cards.find((c) => c.id === id)) return listId;
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const container = findContainer(active.id as string);
    setActiveId(active.id as string);
    setActiveContainer(container);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over || !activeId || !activeContainer) return;
    const overId = over.id as string;
    const overContainer = findContainer(overId);
    if (!overContainer || activeContainer === overContainer) return;
    const fromCards = localCards[activeContainer];
    const toCards = localCards[overContainer] || [];
    const oldIndex = fromCards.findIndex((c) => c.id === activeId);
    const overIndexInTo = toCards.findIndex((c) => c.id === overId);
    const newIndex = overIndexInTo !== -1 ? overIndexInTo : toCards.length;
    if (oldIndex !== -1) {
      const newFrom = [...fromCards];
      newFrom.splice(oldIndex, 1);
      const newTo = [...toCards];
      newTo.splice(newIndex, 0, fromCards[oldIndex]);
      setLocalCards({
        ...localCards,
        [activeContainer]: newFrom,
        [overContainer]: newTo,
      });
      setActiveContainer(overContainer);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    // Reorder lists
    if (lists.find((l) => l.id === active.id) && lists.find((l) => l.id === over.id)) {
      const oldIndex = lists.findIndex((l) => l.id === active.id);
      const newIndex = lists.findIndex((l) => l.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newLists = arrayMove(lists, oldIndex, newIndex);
        setLists(newLists); // 樂觀更新 lists
        await moveList(active.id as string, newIndex);
        invalidateBoard();
      }
    } else {
      // Move card between lists or within the same list
      const source = findContainer(active.id as string);
      const destination = findContainer(over.id as string);
      if (source && destination) {
        const srcCards = localCards[source] || [];
        const destCards = localCards[destination] || [];
        const oldIdx = srcCards.findIndex((c) => c.id === active.id);
        let newIdx = destCards.findIndex((c) => c.id === over.id);
        if (newIdx === -1) newIdx = destCards.length;
        if (oldIdx !== -1 && (source !== destination || oldIdx !== newIdx)) {
          // 樂觀更新 localCards，確保卡片不重複
          const newSrcCards = [...srcCards];
          let newDestCards = [...destCards];
          const [movedCard] = newSrcCards.splice(oldIdx, 1);
          // 避免目標清單已有同 id 卡片
          newDestCards = newDestCards.filter((c) => c.id !== movedCard.id);
          newDestCards.splice(newIdx, 0, movedCard);
          setLocalCards({
            ...localCards,
            [source]: newSrcCards,
            [destination]: newDestCards,
          });
          await moveCard(active.id as string, destination, newIdx);
          invalidateBoard();
        }
      }
    }
    setActiveId(null);
    setActiveContainer(null);
  };

  return {
    activeId,
    activeContainer,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
