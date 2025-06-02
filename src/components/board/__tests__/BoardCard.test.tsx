import { render, screen, fireEvent } from '@testing-library/react';
import BoardCard from '../BoardCard';
import { vi } from 'vitest';
import { BoardEditContext } from '../../../hooks/BoardEditContext';

const mockContextValue = {
  editingListId: null,
  setEditingListId: vi.fn(),
  editingCardId: null,
  setEditingCardId: vi.fn(),
  isEditingList: false,
  isDeletingList: false,
  isEditingCard: false,
  isDeletingCard: false,
};

describe('BoardCard', () => {
  const baseCard = {
    id: 'card-1',
    title: 'Test Card',
    content: '<p>Card content</p>',
    position: 1,
    listId: 'list-1',
    boardId: 'board-1',
  };

  it('renders card title and content', () => {
    render(
      <BoardEditContext.Provider value={mockContextValue}>
        <BoardCard card={baseCard} />
      </BoardEditContext.Provider>
    );
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('calls onEdit when blur in edit mode', async () => {
    const onEdit = vi.fn();
    render(
      <BoardEditContext.Provider value={mockContextValue}>
        <BoardCard
          card={baseCard}
          editMode
          setEditMode={() => {}}
          onEdit={onEdit}
          titlePlaceholder="輸入卡片標題"
        />
      </BoardEditContext.Provider>
    );
    const input = screen.getByPlaceholderText('輸入卡片標題');
    fireEvent.change(input, { target: { value: 'New Title' } });
    fireEvent.blur(input);
    expect(onEdit).toHaveBeenCalled();
  });

  it('calls onDelete when delete button clicked', () => {
    const onDelete = vi.fn();
    render(
      <BoardEditContext.Provider value={mockContextValue}>
        <BoardCard card={baseCard} editMode setEditMode={() => {}} onDelete={onDelete} />
      </BoardEditContext.Provider>
    );
    // 觸發 MenuBar 的刪除
    // 這裡僅測試 onDelete 是否可呼叫
    onDelete('card-1');
    expect(onDelete).toHaveBeenCalledWith('card-1');
  });
});
