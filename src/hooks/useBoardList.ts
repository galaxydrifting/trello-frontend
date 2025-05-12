import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Board } from '../components/board/types';
import { fetchBoards, createBoard, updateBoard, deleteBoard } from '../api/board';

export function useBoardList() {
  const queryClient = useQueryClient();
  const [newBoardName, setNewBoardName] = useState('');

  const {
    data: boards = [],
    isLoading,
    isError,
  } = useQuery<Board[], Error>({
    queryKey: ['boards'],
    queryFn: fetchBoards,
    retry: 1,
  });

  // 依 position 排序
  const sortedBoards = [...boards].sort((a, b) => a.position - b.position);

  const createBoardMutation = useMutation({
    mutationFn: ({ name }: { name: string; position?: number }) => {
      const boardsData = queryClient.getQueryData<Board[]>(['boards']) || [];
      const nextPosition =
        boardsData.length > 0 ? Math.max(...boardsData.map((b) => b.position)) + 1 : 1;
      return createBoard(name, nextPosition);
    },
    // 樂觀更新
    onMutate: async ({ name }) => {
      await queryClient.cancelQueries({ queryKey: ['boards'] });
      const previousBoards = queryClient.getQueryData<Board[]>(['boards']) || [];
      // 產生暫時 id
      const tempId = `temp-${Date.now()}`;
      const boardsWithOptimistic = [
        ...previousBoards,
        {
          id: tempId,
          name,
          position:
            previousBoards.length > 0 ? Math.max(...previousBoards.map((b) => b.position)) + 1 : 1,
          lists: [],
        },
      ];
      queryClient.setQueryData<Board[]>(['boards'], boardsWithOptimistic);
      setNewBoardName('');
      return { previousBoards, tempId };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousBoards) {
        queryClient.setQueryData(['boards'], context.previousBoards);
      }
    },
    onSuccess: (data, _variables, context) => {
      // 用 API 回傳的資料取代暫時資料
      if (context?.tempId) {
        const boards = queryClient.getQueryData<Board[]>(['boards']) || [];
        queryClient.setQueryData<Board[]>(
          ['boards'],
          boards.map((b) => (b.id === context.tempId ? data : b))
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const updateBoardMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateBoard(id, name),
    // 樂觀更新
    onMutate: async ({ id, name }) => {
      await queryClient.cancelQueries({ queryKey: ['boards'] });
      const previousBoards = queryClient.getQueryData<Board[]>(['boards']);
      if (previousBoards) {
        queryClient.setQueryData<Board[]>(
          ['boards'],
          previousBoards.map((b) => (b.id === id ? { ...b, name } : b))
        );
      }
      return { previousBoards };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousBoards) {
        queryClient.setQueryData(['boards'], context.previousBoards);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: (id: string) => deleteBoard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  return {
    boards: sortedBoards,
    isLoading,
    isError,
    newBoardName,
    setNewBoardName,
    createBoardMutation,
    updateBoardMutation,
    deleteBoardMutation,
  };
}
