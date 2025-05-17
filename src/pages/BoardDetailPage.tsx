import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Board } from '../components/board/types';
import AddListForm from '../components/board/AddListForm';
import BoardListWithAddCard from '../components/board/BoardListWithAddCard';
import SortableListItem from '../components/board/SortableListItem';
import { fetchBoard, moveList, moveCard } from '../api/board';
import { DndContext, pointerWithin, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useBoardDnD } from '../hooks/useBoardDnD';
import { useBoardMutations } from '../hooks/useBoardMutations';
import { useBoardListsState } from '../hooks/useBoardListsState';
import { v4 as uuidv4 } from 'uuid';

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

  // 使用自訂 hook 管理 lists 與 localCards 狀態
  const { lists, setLists, localCards, setLocalCards } = useBoardListsState(board);

  const { handleDragStart, handleDragOver, handleDragEnd } = useBoardDnD({
    lists,
    setLists,
    localCards,
    setLocalCards,
    moveList,
    moveCard,
    invalidateBoard: () => queryClient.invalidateQueries({ queryKey: ['board', boardId] }),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  // 集中管理所有清單與卡片的編輯狀態
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  // 只允許同時一個清單或一張卡片進入編輯模式
  const canEdit = !editingListId && !editingCardId;

  const handleAddList = (name: string) => {
    const tempId = 'temp-' + uuidv4();
    const optimisticList = { id: tempId, name, cards: [] };
    setLists((prev) => [...prev, optimisticList]);
    createListMutation.mutate(name, {
      onSuccess: (data) => {
        setLists((prev) =>
          prev.map((l) => (l.id === tempId ? data : l))
        );
      },
      onError: () => {
        setLists((prev) => prev.filter((l) => l.id !== tempId));
      },
    });
  };

  if (isLoading) return <div>載入中...</div>;
  if (isError || !board) return <div>無法取得看板資料</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{board.name}</h1>
      <AddListForm
        onAdd={handleAddList}
        isPending={createListMutation.isPending}
      />
      {lists.length === 0 ? (
        <div className="text-gray-400 text-center py-8">尚無清單</div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={lists.map((l) => l.id)} strategy={horizontalListSortingStrategy}>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {lists.map((list) => (
                <SortableListItem
                  key={list.id}
                  id={list.id}
                  disabled={editingListId === list.id || !!editingCardId}
                >
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
                      onEditCard={(id, title, content) => {
                        setLocalCards((prev) => {
                          const newCards = { ...prev };
                          for (const listId in newCards) {
                            newCards[listId] = newCards[listId].map((c) =>
                              c.id === id ? { ...c, title, content } : c
                            );
                          }
                          return newCards;
                        });
                        updateCardMutation.mutate({ id, title, content });
                      }}
                      onDeleteCard={(id) => deleteCardMutation.mutate(id)}
                      isEditingCard={updateCardMutation.isPending}
                      isDeletingCard={deleteCardMutation.isPending}
                      isListEditing={editingListId === list.id}
                      setIsListEditing={(v: boolean) => {
                        if (v && canEdit) setEditingListId(list.id);
                        if (!v) setEditingListId(null);
                      }}
                      editingCardId={editingCardId}
                      setEditingCardId={(id) => {
                        if (id && canEdit) setEditingCardId(id);
                        if (!id) setEditingCardId(null);
                      }}
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
