import { useState, useRef } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { Board } from '../components/board/types';

interface UseBoardDnDProps {
  localLists: Board['lists'];
  setLocalLists: (lists: Board['lists']) => void;
  localCards: Record<string, Board['lists'][0]['cards']>;
  setLocalCards: (cards: Record<string, Board['lists'][0]['cards']>) => void;
  moveList: (id: string, newIndex: number) => Promise<void>;
  moveCard: (cardId: string, toListId: string, toIndex: number) => Promise<void>;
  invalidateBoard: () => void;
}

export function useBoardDnD({
  localLists,
  setLocalLists,
  localCards,
  setLocalCards,
  moveList,
  moveCard,
  invalidateBoard,
}: UseBoardDnDProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeContainer, setActiveContainer] = useState<string | null>(null);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const DEBOUNCE_DELAY = 5000; // ms

  // debounce invalidateBoard，拖拉結束後延遲觸發
  const debounceInvalidate = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      invalidateBoard();
    }, DEBOUNCE_DELAY);
  };

  const findContainer = (id?: string) => {
    if (!id) return null;
    if (localLists.find((l) => l.id === id)) return id;
    for (const [listId, cards] of Object.entries(localCards)) {
      if (cards.find((c) => c.id === id)) return listId;
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const container = findContainer(active.id as string);
    console.log('[DnD] handleDragStart', {
      activeId: active.id,
      container,
      localLists,
      localCards,
    });
    setActiveId(active.id as string);
    setActiveContainer(container);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    console.log('[DnD] handleDragOver: triggered', {
      activeId,
      activeContainer,
      overId: over?.id,
      overContainer: over ? findContainer(over.id as string) : null,
      localCards,
    });
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
      console.log('[DnD] handleDragOver: setLocalCards', {
        from: activeContainer,
        to: overContainer,
        oldIndex,
        newIndex,
        newFrom,
        newTo,
      });
      setLocalCards({
        ...localCards,
        [activeContainer]: newFrom,
        [overContainer]: newTo,
      });
      setActiveContainer(overContainer);
      console.log('[DnD] handleDragOver: setActiveContainer', overContainer);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    console.log('[DnD] handleDragEnd: triggered', {
      activeId,
      activeContainer,
      eventActiveId: active.id,
      eventOverId: over?.id,
      localLists,
      localCards,
    });
    if (!over) return;
    // Reorder lists
    if (localLists.find((l) => l.id === active.id) && localLists.find((l) => l.id === over.id)) {
      const oldIndex = localLists.findIndex((l) => l.id === active.id);
      const newIndex = localLists.findIndex((l) => l.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newLists = arrayMove(localLists, oldIndex, newIndex);
        console.log('[DnD] handleDragEnd: setLocalLists', { oldIndex, newIndex, newLists });
        setLocalLists(newLists); // 樂觀更新 lists
        await moveList(active.id as string, newIndex);
        debounceInvalidate();
      }
    } else {
      // Move card between lists or within the same list
      const source = findContainer(active.id as string);
      const destination = findContainer(over.id as string);
      console.log('[DnD] handleDragEnd: card move', { source, destination });
      if (source && destination) {
        const srcCards = localCards[source] || [];
        const destCards = localCards[destination] || [];
        const oldIdx = srcCards.findIndex((c) => c.id === active.id);
        let newIdx = destCards.findIndex((c) => c.id === over.id);
        if (newIdx === -1) newIdx = destCards.length;
        if (
          oldIdx !== -1 &&
          (source !== destination || oldIdx !== newIdx || active.id !== over.id)
        ) {
          const newSrcCards = [...srcCards];
          let newDestCards = [...destCards];
          const [movedCard] = newSrcCards.splice(oldIdx, 1);
          newDestCards = newDestCards.filter((c) => c.id !== movedCard.id);
          newDestCards.splice(newIdx, 0, movedCard);
          console.log('[DnD] handleDragEnd: setLocalCards', {
            source,
            destination,
            oldIdx,
            newIdx,
            newSrcCards,
            newDestCards,
          });
          setLocalCards({
            ...localCards,
            [source]: newSrcCards,
            [destination]: newDestCards,
          });
        }
        await moveCard(active.id as string, destination, newIdx);
        debounceInvalidate();
      }
    }
    setActiveId(null);
    setActiveContainer(null);
    console.log('[DnD] handleDragEnd: reset activeId & activeContainer');
  };

  return {
    activeId,
    activeContainer,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
