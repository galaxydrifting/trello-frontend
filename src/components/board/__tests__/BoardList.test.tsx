import { render, screen, fireEvent } from '@testing-library/react';
import BoardList from '../BoardList';
import { BoardEditContext } from '../../../hooks/BoardEditContext';
import type { BoardEditContextProps } from '../../../hooks/BoardEditContext';
import { vi } from 'vitest';

describe('BoardList', () => {
  const list = {
    id: 'list-1',
    name: 'List 1',
    boardId: 'board-1',
    position: 1,
    cards: [
      {
        id: 'card-1',
        title: 'Card 1',
        content: 'Content 1',
        position: 1,
        listId: 'list-1',
        boardId: 'board-1',
      },
    ],
  };

  const renderWithContext = (ui: React.ReactElement, ctx?: Partial<BoardEditContextProps>) =>
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
          onAddList: vi.fn(),
          onEditList: vi.fn(),
          onDeleteList: vi.fn(),
          onAddCard: vi.fn(),
          onEditCard: vi.fn(),
          onDeleteCard: vi.fn(),
          ...ctx,
        }}
      >
        {ui}
      </BoardEditContext.Provider>
    );

  it('renders list name and cards', () => {
    renderWithContext(<BoardList list={list} />);
    expect(screen.getByText('List 1')).toBeInTheDocument();
    expect(screen.getByText('Card 1')).toBeInTheDocument();
  });

  it('calls onEdit when list name edited', () => {
    const onEdit = vi.fn();
    renderWithContext(<BoardList list={list} isListEditing setIsListEditing={() => {}} />, {
      onEditList: onEdit,
    });
    const input = screen.getByDisplayValue('List 1');
    fireEvent.change(input, { target: { value: 'New List' } });
    fireEvent.blur(input);
    expect(onEdit).toHaveBeenCalledWith('list-1', 'New List');
  });

  it('calls onDelete when delete button clicked', () => {
    const onDelete = vi.fn();
    renderWithContext(<BoardList list={list} />, { onDeleteList: onDelete });
    const deleteBtn = screen.getByLabelText('刪除清單');
    fireEvent.click(deleteBtn);
    // 彈窗出現後，點擊確定刪除
    const confirmBtn = screen.getByText('確定刪除');
    fireEvent.click(confirmBtn);
    expect(onDelete).toHaveBeenCalledWith('list-1');
  });
});
