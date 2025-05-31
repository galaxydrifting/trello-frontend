import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock hooks & API
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
vi.mock('../../hooks/useBoardMutations', () => ({
  useBoardMutations: () => ({
    createListMutation: { mutate: vi.fn(), isPending: false },
    createCardMutation: { mutate: vi.fn(), isPending: false },
    updateListMutation: { mutate: vi.fn(), isPending: false },
    deleteListMutation: { mutate: vi.fn(), isPending: false },
    updateCardMutation: { mutate: vi.fn(), isPending: false },
    deleteCardMutation: { mutate: vi.fn(), isPending: false },
  }),
}));
vi.mock('../../hooks/useBoardListsState', () => ({
  useBoardListsState: () => ({
    lists: [],
    setLists: vi.fn(),
    localCards: {},
    setLocalCards: vi.fn(),
  }),
}));
vi.mock('../../components/board/BoardListWithAddCard', () => ({
  __esModule: true,
  default: () => <div data-testid="board-list-with-add-card" />,
}));
vi.mock('../../components/board/AddListForm', () => ({
  __esModule: true,
  default: () => <div data-testid="add-list-form" />,
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

describe('BoardDetailPage', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('顯示載入中', async () => {
    vi.doMock('@tanstack/react-query', async () => {
      const actual =
        await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query');
      return {
        ...actual,
        useQuery: () => ({ isLoading: true }),
      };
    });
    // 重新 import 以套用 mock
    const { default: BoardDetailPage } = await import('../BoardDetailPage');
    renderWithProviders(<BoardDetailPage />);
    expect(screen.getByText('載入中...')).toBeInTheDocument();
  });

  it('顯示載入失敗', async () => {
    vi.doMock('@tanstack/react-query', async () => {
      const actual =
        await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query');
      return {
        ...actual,
        useQuery: () => ({ isLoading: false, isError: true }),
      };
    });
    const { default: BoardDetailPage } = await import('../BoardDetailPage');
    renderWithProviders(<BoardDetailPage />);
    expect(screen.getByText('無法取得看板資料')).toBeInTheDocument();
  });

  it('顯示正常資料', async () => {
    vi.doMock('@tanstack/react-query', async () => {
      const actual =
        await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query');
      return {
        ...actual,
        useQuery: () => ({
          isLoading: false,
          isError: false,
          data: { id: '1', name: 'Demo Board', lists: [] },
        }),
      };
    });
    const { default: BoardDetailPage } = await import('../BoardDetailPage');
    renderWithProviders(<BoardDetailPage />);
    expect(screen.getByText('Demo Board')).toBeInTheDocument();
    expect(screen.getByText('尚無清單')).toBeInTheDocument();
  });

  it('有清單時正確渲染 BoardListWithAddCard', async () => {
    // mock lists 有資料
    vi.doMock('../../hooks/useBoardListsState', () => ({
      useBoardListsState: () => ({
        lists: [
          { id: 'l1', name: '清單1', boardId: '1', position: 1, cards: [] },
          { id: 'l2', name: '清單2', boardId: '1', position: 2, cards: [] },
        ],
        setLists: vi.fn(),
        localCards: {},
        setLocalCards: vi.fn(),
      }),
    }));
    vi.doMock('@tanstack/react-query', async () => {
      const actual =
        await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query');
      return {
        ...actual,
        useQuery: () => ({
          isLoading: false,
          isError: false,
          data: { id: '1', name: 'Demo Board', lists: [] },
        }),
      };
    });
    // 重新 import 以套用 mock
    const { default: BoardDetailPage } = await import('../BoardDetailPage');
    renderWithProviders(<BoardDetailPage />);
    // 應該會有兩個 BoardListWithAddCard
    expect(screen.getAllByTestId('board-list-with-add-card').length).toBe(2);
    // AddListForm 仍然存在
    expect(screen.getByTestId('add-list-form')).toBeInTheDocument();
  });
});
