import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { useBoardActions } from '../hooks/useBoardActions';
import { BoardEditContext } from '../hooks/BoardEditContext';
import { useBoardEditContextValue } from '../hooks/useBoardEditContextValue';

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
  const { localLists, setLocalLists, localCards, setLocalCards } = useBoardListsState(board);

  // 將 mutation handler 集中於 useBoardActions
  const {
    handleAddList,
    handleAddCard,
    handleDeleteCard,
    handleDeleteList,
    handleEditList,
    handleEditCard,
  } = useBoardActions({
    boardId: boardId!,
    localLists,
    setLocalLists,
    setLocalCards,
    createListMutation: createListMutation.mutate,
    createCardMutation: createCardMutation.mutate,
    updateListMutation: updateListMutation.mutate,
    deleteListMutation: deleteListMutation.mutate,
    updateCardMutation: updateCardMutation.mutate,
    deleteCardMutation: deleteCardMutation.mutate,
    queryClient,
  });

  const { handleDragStart, handleDragOver, handleDragEnd } = useBoardDnD({
    localLists,
    setLocalLists,
    localCards,
    setLocalCards,
    moveList: async (id, newIndex) => {
      await moveList(id, newIndex);
    },
    moveCard: async (cardId, toListId, toIndex) => {
      await moveCard(cardId, toListId, toIndex);
    },
    invalidateBoard: () => queryClient.invalidateQueries({ queryKey: ['board', boardId] }),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  // 集中管理所有清單與卡片的編輯狀態（改用自訂 hook）
  const boardEditContextValue = useBoardEditContextValue({
    isEditingList: updateListMutation.isPending,
    isDeletingList: deleteListMutation.isPending,
    isEditingCard: updateCardMutation.isPending,
    isDeletingCard: deleteCardMutation.isPending,
    isCreatingList: createListMutation.isPending, // 新增
    isCreatingCard: createCardMutation.isPending, // 新增
    onAddList: handleAddList,
    onEditList: handleEditList,
    onDeleteList: handleDeleteList,
    onAddCard: handleAddCard,
    onEditCard: handleEditCard,
    onDeleteCard: handleDeleteCard,
  });

  if (isLoading) return <Loading />;
  if (isError || !board) return <ErrorMessage message="無法取得看板資料" />;

  return (
    <BoardEditContext.Provider value={boardEditContextValue}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">{board.name}</h1>
        <AddListForm />
        {localLists.length === 0 ? (
          <div className="text-gray-400 text-center py-8">尚無清單</div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={localLists.map((l) => l.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {localLists.map((list) => (
                  <SortableListItem
                    key={list.id}
                    id={list.id}
                    disabled={
                      boardEditContextValue.editingListId === list.id ||
                      !!boardEditContextValue.editingCardId
                    }
                  >
                    <SortableContext items={(localCards[list.id] || list.cards).map((c) => c.id)}>
                      <BoardListWithAddCard
                        list={{ ...list, cards: localCards[list.id] || list.cards }}
                      />
                    </SortableContext>
                  </SortableListItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </BoardEditContext.Provider>
  );
};

export default BoardDetailPage;
