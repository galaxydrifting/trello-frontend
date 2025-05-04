import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createList,
  createCard,
  updateList,
  deleteList,
  updateCard,
  deleteCard,
} from '../api/board';

export function useBoardMutations(boardId?: string) {
  const queryClient = useQueryClient();
  const invalidate = () => {
    if (boardId) {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    }
  };

  const createListMutation = useMutation({
    mutationFn: (name: string) => createList(boardId!, name),
    onSuccess: invalidate,
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
    }) => createCard(boardId!, listId, title, content),
    onSuccess: invalidate,
  });

  const updateListMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateList(id, name),
    onSuccess: invalidate,
  });

  const deleteListMutation = useMutation({
    mutationFn: (id: string) => deleteList(id),
    onSuccess: invalidate,
  });

  const updateCardMutation = useMutation({
    mutationFn: ({ id, title, content }: { id: string; title: string; content: string }) =>
      updateCard(id, title, content),
    onSuccess: invalidate,
  });

  const deleteCardMutation = useMutation({
    mutationFn: (id: string) => deleteCard(id),
    onSuccess: invalidate,
  });

  return {
    createListMutation,
    createCardMutation,
    updateListMutation,
    deleteListMutation,
    updateCardMutation,
    deleteCardMutation,
  };
}
