import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Board } from '../components/board/types';
import AddListForm from '../components/board/AddListForm';
import BoardListWithAddCard from '../components/board/BoardListWithAddCard';
import {
  fetchBoard,
  createList,
  createCard,
  updateList,
  deleteList,
  updateCard,
  deleteCard,
} from '../api/board';

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

  if (isLoading) return <div>載入中...</div>;
  if (isError || !board) return <div>無法取得看板資料</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{board.name}</h1>
      <AddListForm
        onAdd={(name) => createListMutation.mutate(name)}
        isPending={createListMutation.isPending}
      />
      {board.lists.length === 0 ? (
        <div className="text-gray-400 text-center py-8">尚無清單</div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {board.lists.map((list) => (
            <BoardListWithAddCard
              key={list.id}
              list={list}
              onAddCard={(listId, title, content) =>
                createCardMutation.mutate({ listId, title, content })
              }
              isPending={createCardMutation.isPending}
              onEditList={(id, name) => updateListMutation.mutate({ id, name })}
              onDeleteList={(id) => deleteListMutation.mutate(id)}
              isEditingList={updateListMutation.isPending}
              isDeletingList={deleteListMutation.isPending}
              onEditCard={(id, title, content) => updateCardMutation.mutate({ id, title, content })}
              onDeleteCard={(id) => deleteCardMutation.mutate(id)}
              isEditingCard={updateCardMutation.isPending}
              isDeletingCard={deleteCardMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardDetailPage;
