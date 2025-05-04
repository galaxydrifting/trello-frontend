import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Board } from '../components/board/types';
import AddListForm from '../components/board/AddListForm';
import BoardListWithAddCard from '../components/board/BoardListWithAddCard';
import SortableListItem from '../components/board/SortableListItem';
import { fetchBoard, moveList, moveCard } from '../api/board';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useBoardDnD } from '../hooks/useBoardDnD';
import { useBoardMutations } from '../hooks/useBoardMutations';

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

  const {
    createListMutation,
    createCardMutation,
    updateListMutation,
    deleteListMutation,
    updateCardMutation,
    deleteCardMutation,
  } = useBoardMutations(boardId);

  const [lists, setLists] = useState<Board['lists']>([]);
  const [localCards, setLocalCards] = useState<Record<string, Board['lists'][0]['cards']>>({});

  const { handleDragStart, handleDragOver, handleDragEnd } = useBoardDnD({
    lists,
    setLists,
    localCards,
    setLocalCards,
    moveList,
    moveCard,
    invalidateBoard: () => queryClient.invalidateQueries({ queryKey: ['board', boardId] }),
  });

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
