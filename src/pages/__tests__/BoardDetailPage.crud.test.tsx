import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock hooks & API
vi.mock('@tanstack/react-query', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actual = (await importOriginal()) as any;
  return Object.assign({}, actual, {
    useQuery: () => ({
      isLoading: false,
      isError: false,
      data: {
        id: '1',
        name: 'Demo Board',
        lists: [
          {
            id: 'list-1',
            name: 'List 1',
            boardId: '1',
            position: 1,
            cards: [
              {
                id: 'card-1',
                title: 'Card 1',
                content: 'Content 1',
                position: 1,
                listId: 'list-1',
                boardId: '1',
              },
            ],
          },
        ],
      },
    }),
    useQueryClient: () => ({
      invalidateQueries: vi.fn(),
    }),
  });
});
vi.mock('../../api/board', () => ({
  fetchBoard: vi.fn(),
  moveList: vi.fn(),
  moveCard: vi.fn(),
}));
vi.mock('../../hooks/useBoardDnD', () => ({
  useBoardDnD: () => ({
    handleDragStart: vi.fn(),
    handleDragOver: vi.fn(),
    handleDragEnd: vi.fn(),
  }),
}));

const mockSetLists = vi.fn();
const mockSetLocalCards = vi.fn();
const mockMutate = vi.fn();

vi.mock('../../hooks/useBoardMutations', () => ({
  useBoardMutations: () => ({
    createListMutation: { mutate: mockMutate, isPending: false },
    createCardMutation: { mutate: mockMutate, isPending: false },
    updateListMutation: { mutate: mockMutate, isPending: false },
    deleteListMutation: { mutate: mockMutate, isPending: false },
    updateCardMutation: { mutate: mockMutate, isPending: false },
    deleteCardMutation: { mutate: mockMutate, isPending: false },
  }),
}));
vi.mock('../../hooks/useBoardListsState', () => ({
  useBoardListsState: () => ({
    lists: [
      {
        id: 'list-1',
        name: 'List 1',
        boardId: '1',
        position: 1,
        cards: [
          {
            id: 'card-1',
            title: 'Card 1',
            content: 'Content 1',
            position: 1,
            listId: 'list-1',
            boardId: '1',
          },
        ],
      },
    ],
    setLists: mockSetLists,
    localCards: {
      'list-1': [
        {
          id: 'card-1',
          title: 'Card 1',
          content: 'Content 1',
          position: 1,
          listId: 'list-1',
          boardId: '1',
        },
      ],
    },
    setLocalCards: mockSetLocalCards,
  }),
}));

const renderWithProviders = (ui: React.ReactElement, { route = '/board/1' } = {}) => {
  const queryClient = new QueryClient();
  window.history.pushState({}, 'Test page', route);
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/board/:boardId" element={ui} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('BoardDetailPage CRUD/Callback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('呼叫 handleAddList 時會觸發 setLists 及 createListMutation.mutate', async () => {
    const { default: BoardDetailPage } = await import('../BoardDetailPage');
    renderWithProviders(<BoardDetailPage />);
    // 模擬 AddListForm 輸入與送出
    const input = screen.getByPlaceholderText('輸入新清單名稱');
    fireEvent.change(input, { target: { value: '新清單' } });
    const addBtn = screen.getByText('新增清單');
    fireEvent.click(addBtn);
    await waitFor(() => {
      expect(mockSetLists).toHaveBeenCalled();
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  it('呼叫 handleAddCard 時會觸發 setLocalCards 及 createCardMutation.mutate', async () => {
    const { default: BoardDetailPage } = await import('../BoardDetailPage');
    renderWithProviders(<BoardDetailPage />);
    // 模擬 BoardListWithAddCard 新增卡片流程
    const addCardBtn = screen.getAllByLabelText('新增卡片')[0];
    fireEvent.click(addCardBtn);
    const titleInput = screen.getByPlaceholderText('輸入卡片標題');
    fireEvent.change(titleInput, { target: { value: '新卡片' } });
    // 內容區可略過，直接 blur title 觸發儲存
    fireEvent.blur(titleInput);
    await waitFor(() => {
      expect(mockSetLocalCards).toHaveBeenCalled();
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  it('handleEditList 會觸發 setLists 及 updateListMutation.mutate', async () => {
    const { default: BoardDetailPage } = await import('../BoardDetailPage');
    renderWithProviders(<BoardDetailPage />);
    // 進入編輯模式
    const listTitle = screen.getByText('List 1');
    fireEvent.doubleClick(listTitle);
    const editInput = screen.getByDisplayValue('List 1');
    fireEvent.change(editInput, { target: { value: 'List 1 編輯' } });
    fireEvent.blur(editInput);
    await waitFor(() => {
      expect(mockSetLists).toHaveBeenCalled();
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  it('handleDeleteCard 會觸發 setLocalCards 及 deleteCardMutation.mutate', async () => {
    const { default: BoardDetailPage } = await import('../BoardDetailPage');
    renderWithProviders(<BoardDetailPage />);
    // 先讓卡片進入編輯模式（雙擊卡片）
    const cardTitle = screen.getByText('Card 1');
    fireEvent.doubleClick(cardTitle);
    // 再點擊刪除卡片按鈕
    const deleteBtns = screen.getAllByLabelText('刪除卡片');
    fireEvent.click(deleteBtns[0]);
    await waitFor(() => {
      expect(mockSetLocalCards).toHaveBeenCalled();
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  it('handleDeleteList 會觸發 setLists、setLocalCards 及 deleteListMutation.mutate', async () => {
    const { default: BoardDetailPage } = await import('../BoardDetailPage');
    renderWithProviders(<BoardDetailPage />);
    // 模擬 BoardList 刪除清單流程
    const deleteBtns = screen.getAllByLabelText('刪除清單');
    fireEvent.click(deleteBtns[0]);
    // 確認彈窗出現
    const confirmBtn = screen.getByText('確定刪除');
    fireEvent.click(confirmBtn);
    await waitFor(() => {
      expect(mockSetLists).toHaveBeenCalled();
      expect(mockSetLocalCards).toHaveBeenCalled();
      expect(mockMutate).toHaveBeenCalled();
    });
  });
});
