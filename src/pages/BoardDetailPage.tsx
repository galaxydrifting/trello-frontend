import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Board } from '../components/board/types';
import BoardList from '../components/board/BoardList';
import { fetchBoard, createList, createCard } from '../api/board';

const BoardDetailPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const queryClient = useQueryClient();
  const [newListName, setNewListName] = useState('');
  const [cardInputs, setCardInputs] = useState<Record<string, { title: string; content: string }>>(
    {}
  );

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
      setNewListName('');
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
    onSuccess: (_data, variables) => {
      setCardInputs((prev) => ({ ...prev, [variables.listId]: { title: '', content: '' } }));
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });

  if (isLoading) return <div>載入中...</div>;
  if (isError || !board) return <div>無法取得看板資料</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{board.name}</h1>
      <form
        className="flex gap-2 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!newListName.trim()) return;
          createListMutation.mutate(newListName.trim());
        }}
      >
        <input
          type="text"
          className="border rounded px-2 py-1 flex-1"
          placeholder="輸入新清單名稱"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          disabled={createListMutation.isPending}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-1 rounded disabled:bg-indigo-300"
          disabled={createListMutation.isPending || !newListName.trim()}
        >
          {createListMutation.isPending ? '新增中...' : '新增清單'}
        </button>
      </form>
      {board.lists.length === 0 ? (
        <div className="text-gray-400 text-center py-8">尚無清單</div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {board.lists.map((list) => (
            <div key={list.id} className="min-w-[260px]">
              <BoardList list={list} />
              <form
                className="mt-2 flex flex-col gap-1 bg-gray-50 rounded p-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const title = cardInputs[list.id]?.title?.trim() || '';
                  const content = cardInputs[list.id]?.content?.trim() || '';
                  if (!title) return;
                  createCardMutation.mutate({ listId: list.id, title, content });
                }}
              >
                <input
                  type="text"
                  className="border rounded px-2 py-1 mb-1"
                  placeholder="卡片標題 (必填)"
                  value={cardInputs[list.id]?.title || ''}
                  onChange={(e) =>
                    setCardInputs((prev) => ({
                      ...prev,
                      [list.id]: { ...prev[list.id], title: e.target.value },
                    }))
                  }
                  disabled={createCardMutation.isPending}
                  required
                />
                <input
                  type="text"
                  className="border rounded px-2 py-1 mb-1"
                  placeholder="卡片內容 (可選)"
                  value={cardInputs[list.id]?.content || ''}
                  onChange={(e) =>
                    setCardInputs((prev) => ({
                      ...prev,
                      [list.id]: { ...prev[list.id], content: e.target.value },
                    }))
                  }
                  disabled={createCardMutation.isPending}
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-2 py-1 rounded disabled:bg-green-300"
                  disabled={createCardMutation.isPending || !cardInputs[list.id]?.title?.trim()}
                >
                  {createCardMutation.isPending ? '新增中...' : '新增卡片'}
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardDetailPage;
