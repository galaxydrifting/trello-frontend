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
    onSuccess: () => {
      setNewBoardName('');
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
