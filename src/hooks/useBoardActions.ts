import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { List, Card } from '../components/board/types';
import { QueryClient } from '@tanstack/react-query';

interface UseBoardActionsProps {
  boardId: string;
  localLists: List[];
  setLocalLists: React.Dispatch<React.SetStateAction<List[]>>;
  setLocalCards: React.Dispatch<React.SetStateAction<Record<string, Card[]>>>;
  createListMutation: (
    variables: string,
    options?: { onSuccess?: (data: List) => void; onError?: () => void }
  ) => void;
  createCardMutation: (
    variables: { listId: string; title: string; content: string },
    options?: { onSuccess?: (data: Card) => void; onError?: () => void }
  ) => void;
  updateListMutation: (
    variables: { id: string; name: string },
    options?: { onError?: () => void }
  ) => void;
  deleteListMutation: (variables: string, options?: { onError?: () => void }) => void;
  updateCardMutation: (variables: { id: string; title: string; content: string }) => void;
  deleteCardMutation: (variables: string, options?: { onError?: () => void }) => void;
  queryClient: QueryClient;
}

export const useBoardActions = ({
  boardId,
  localLists,
  setLocalLists,
  setLocalCards,
  createListMutation,
  createCardMutation,
  updateListMutation,
  deleteListMutation,
  updateCardMutation,
  deleteCardMutation,
  queryClient,
}: UseBoardActionsProps) => {
  // 新增清單
  const handleAddList = useCallback(
    (name: string) => {
      const tempId = 'temp-' + uuidv4();
      const optimisticList: List = {
        id: tempId,
        name,
        boardId,
        position: localLists.length > 0 ? Math.max(...localLists.map((l) => l.position)) + 1 : 1,
        cards: [],
      };
      setLocalLists((prev) => [...prev, optimisticList]);
      createListMutation(name, {
        onSuccess: (data: List) => {
          setLocalLists((prev) => prev.map((l) => (l.id === tempId ? { ...data, cards: [] } : l)));
        },
        onError: () => {
          setLocalLists((prev) => prev.filter((l) => l.id !== tempId));
        },
      });
    },
    [boardId, localLists, setLocalLists, createListMutation]
  );

  // 新增卡片
  const handleAddCard = useCallback(
    (listId: string, title: string, content: string) => {
      const tempId = 'temp-' + uuidv4();
      const optimisticCard: Card = {
        id: tempId,
        title,
        content,
        position: 0,
        listId,
        boardId,
      };
      setLocalCards((prev) => {
        const newCards = { ...prev };
        newCards[listId] = [optimisticCard, ...(newCards[listId] || [])];
        return newCards;
      });
      createCardMutation(
        { listId, title, content },
        {
          onSuccess: (data: Card) => {
            setLocalCards((prev) => {
              const newCards = { ...prev };
              newCards[listId] = (newCards[listId] || []).map((c) => (c.id === tempId ? data : c));
              return newCards;
            });
          },
          onError: () => {
            setLocalCards((prev) => {
              const newCards = { ...prev };
              newCards[listId] = (newCards[listId] || []).filter((c) => c.id !== tempId);
              return newCards;
            });
          },
        }
      );
    },
    [boardId, setLocalCards, createCardMutation]
  );

  // 刪除卡片
  const handleDeleteCard = useCallback(
    (listId: string, cardId: string) => {
      setLocalCards((prev) => {
        const newCards = { ...prev };
        newCards[listId] = (newCards[listId] || []).filter((c) => c.id !== cardId);
        return newCards;
      });
      deleteCardMutation(cardId, {
        onError: () => {
          queryClient.invalidateQueries({ queryKey: ['board', boardId] });
        },
      });
    },
    [setLocalCards, deleteCardMutation, queryClient, boardId]
  );

  // 刪除清單
  const handleDeleteList = useCallback(
    (listId: string) => {
      setLocalLists((prev) => prev.filter((l) => l.id !== listId));
      setLocalCards((prev) => {
        const newCards = { ...prev };
        delete newCards[listId];
        return newCards;
      });
      deleteListMutation(listId, {
        onError: () => {
          queryClient.invalidateQueries({ queryKey: ['board', boardId] });
        },
      });
    },
    [setLocalLists, setLocalCards, deleteListMutation, queryClient, boardId]
  );

  // 編輯清單名稱
  const handleEditList = useCallback(
    (id: string, name: string) => {
      setLocalLists((prev) => prev.map((l) => (l.id === id ? { ...l, name } : l)));
      updateListMutation(
        { id, name },
        {
          onError: () => {
            queryClient.invalidateQueries({ queryKey: ['board', boardId] });
          },
        }
      );
    },
    [setLocalLists, updateListMutation, queryClient, boardId]
  );

  // 編輯卡片
  const handleEditCard = useCallback(
    (id: string, title: string, content: string) => {
      setLocalCards((prev) => {
        const newCards = { ...prev };
        for (const listId in newCards) {
          newCards[listId] = newCards[listId].map((c) =>
            c.id === id ? { ...c, title, content } : c
          );
        }
        return newCards;
      });
      updateCardMutation({ id, title, content });
    },
    [setLocalCards, updateCardMutation]
  );

  return {
    handleAddList,
    handleAddCard,
    handleDeleteCard,
    handleDeleteList,
    handleEditList,
    handleEditCard,
  };
};
