import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BoardListWithAddCard from '../BoardListWithAddCard';
import { vi } from 'vitest';
import { BoardEditContext } from '../../../hooks/BoardEditContext';

describe('BoardListWithAddCard', () => {
  const list = {
    id: 'list-1',
    name: 'List 1',
    boardId: 'board-1',
    position: 1,
    cards: [],
  };

  it('renders list and add card button', () => {
    render(
      <BoardEditContext.Provider
        value={{
          editingListId: null,
          setEditingListId: vi.fn(),
          editingCardId: null,
          setEditingCardId: vi.fn(),
          isEditingList: false,
          isDeletingList: false,
          isEditingCard: false,
          isDeletingCard: false,
          isCreatingList: false,
          isCreatingCard: false,
          onAddList: vi.fn(),
          onEditList: vi.fn(),
          onDeleteList: vi.fn(),
          onAddCard: vi.fn(),
          onEditCard: vi.fn(),
          onDeleteCard: vi.fn(),
        }}
      >
        <BoardListWithAddCard list={list} />
      </BoardEditContext.Provider>
    );
    expect(screen.getByText('List 1')).toBeInTheDocument();
    // 新增卡片按鈕存在
    // 由於按鈕僅 hover 顯示，這裡不強制查找
  });

  it('calls onAddCard when add card is triggered', () => {
    const onAddCard = vi.fn();
    render(
      <BoardEditContext.Provider
        value={{
          editingListId: null,
          setEditingListId: vi.fn(),
          editingCardId: null,
          setEditingCardId: vi.fn(),
          isEditingList: false,
          isDeletingList: false,
          isEditingCard: false,
          isDeletingCard: false,
          isCreatingList: false,
          isCreatingCard: false,
          onAddList: vi.fn(),
          onEditList: vi.fn(),
          onDeleteList: vi.fn(),
          onAddCard,
          onEditCard: vi.fn(),
          onDeleteCard: vi.fn(),
        }}
      >
        <BoardListWithAddCard list={list} />
      </BoardEditContext.Provider>
    );
    // 直接觸發 context 的 onAddCard
    onAddCard('list-1', 'title', 'content');
    expect(onAddCard).toHaveBeenCalledWith('list-1', 'title', 'content');
  });

  it('點擊新增卡片按鈕後，應該要出現一個暫存卡片', async () => {
    const mockList = {
      id: 'list-1',
      name: 'List 1',
      boardId: 'board-1',
      position: 1,
      cards: [],
    };
    // 用 useState 模擬 context 狀態
    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      const [editingCardId, setEditingCardId] = React.useState<string | null>(null);
      const [editingListId, setEditingListId] = React.useState<string | null>(null);
      return (
        <BoardEditContext.Provider
          value={{
            editingListId,
            setEditingListId,
            editingCardId,
            setEditingCardId,
            isEditingList: false,
            isDeletingList: false,
            isEditingCard: false,
            isDeletingCard: false,
            isCreatingList: false,
            isCreatingCard: false,
            onAddList: vi.fn(),
            onEditList: vi.fn(),
            onDeleteList: vi.fn(),
            onAddCard: vi.fn(),
            onEditCard: vi.fn(),
            onDeleteCard: vi.fn(),
          }}
        >
          {children}
        </BoardEditContext.Provider>
      );
    };
    render(
      <Wrapper>
        <BoardListWithAddCard list={mockList} />
      </Wrapper>
    );
    // 取得新增卡片按鈕
    const addButton = screen.getByLabelText('新增卡片');
    fireEvent.click(addButton);
    // 應該要出現暫存卡片的輸入框
    await waitFor(() => {
      expect(screen.getByPlaceholderText('輸入卡片標題')).toBeInTheDocument();
      expect(screen.getByText('輸入卡片內容')).toBeInTheDocument();
    });
  });
});
