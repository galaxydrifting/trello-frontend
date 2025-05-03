import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Board } from '../components/board/types';
import AddListForm from '../components/board/AddListForm';
import BoardListWithAddCard from '../components/board/BoardListWithAddCard';
import SortableListItem from '../components/board/SortableListItem';
import {
  fetchBoard,
  createList,
  createCard,
  updateList,
  deleteList,
  updateCard,
  deleteCard,
  moveList,
  moveCard,
} from '../api/board';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

const BoardDetailPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const queryClient = useQueryClient();

  const {
    data: board,
    isLoading,
    isError,
  } = useQuery<Board, Error>({
    queryKey: ['board', boardId],
    queryFn: () => fetchBoard(boardId!),
    enabled: !!boardId,
    retry: 1,
  });

  const createListMutation = useMutation({
    mutationFn: (name: string) => createList(boardId!, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });

  const createCardMutation = useMutation({
    mutationFn: async ({
      listId,
      title,
      content,
    }: {
      listId: string;
      title: string;
      content: string;
    }) => createCard(listId, title, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });

  const updateListMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateList(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });

  const deleteListMutation = useMutation({
    mutationFn: (id: string) => deleteList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });

  const updateCardMutation = useMutation({
    mutationFn: ({ id, title, content }: { id: string; title: string; content: string }) =>
      updateCard(id, title, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: (id: string) => deleteCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });

  const [lists, setLists] = useState<Board['lists']>([]);
  const [localCards, setLocalCards] = useState<Record<string, Board['lists'][0]['cards']>>({});
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
      const newLists = arrayMove(lists, oldIndex, newIndex);
      setLists(newLists);
      await moveList(active.id as string, newIndex);
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    } else {
      // Move card between lists
      const source = findContainer(active.id as string);
      const destination = findContainer(over.id as string);
      if (source && destination) {
        const srcCards = localCards[source];
        const destCards = localCards[destination];
        const oldIdx = srcCards.findIndex((c) => c.id === active.id);
        const newIdx = destCards.findIndex((c) => c.id === over.id);
        if (oldIdx !== -1 && newIdx !== -1) {
          await moveCard(active.id as string, destination, newIdx);
          queryClient.invalidateQueries({ queryKey: ['board', boardId] });
        }
      }
    }
    setActiveId(null);
    setActiveContainer(null);
  };

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  if (isLoading) return <div>載入中...</div>;
  if (isError || !board) return <div>無法取得看板資料</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{board.name}</h1>
      <AddListForm
        onAdd={(name) => createListMutation.mutate(name)}
        isPending={createListMutation.isPending}
      />
      {lists.length === 0 ? (
        <div className="text-gray-400 text-center py-8">尚無清單</div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={lists.map((l) => l.id)} strategy={horizontalListSortingStrategy}>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {lists.map((list) => (
                <SortableListItem key={list.id} id={list.id}>
                  <SortableContext items={(localCards[list.id] || list.cards).map((c) => c.id)}>
                    <BoardListWithAddCard
                      list={{ ...list, cards: localCards[list.id] || list.cards }}
                      onAddCard={(listId, title, content) =>
                        createCardMutation.mutate({ listId, title, content })
                      }
                      isPending={createCardMutation.isPending}
                      onEditList={(id, name) => updateListMutation.mutate({ id, name })}
                      onDeleteList={(id) => deleteListMutation.mutate(id)}
                      isEditingList={updateListMutation.isPending}
                      isDeletingList={deleteListMutation.isPending}
                      onEditCard={(id, title, content) =>
                        updateCardMutation.mutate({ id, title, content })
                      }
                      onDeleteCard={(id) => deleteCardMutation.mutate(id)}
                      isEditingCard={updateCardMutation.isPending}
                      isDeletingCard={deleteCardMutation.isPending}
                    />
                  </SortableContext>
                </SortableListItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default BoardDetailPage;
