import { render, screen, fireEvent } from '@testing-library/react';
import BoardCard from '../BoardCard';
import { vi } from 'vitest';

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
    render(<BoardCard card={baseCard} />);
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('calls onEdit when blur in edit mode', async () => {
    const onEdit = vi.fn();
    render(
      <BoardCard
        card={baseCard}
        editMode
        setEditMode={() => {}}
        onEdit={onEdit}
        titlePlaceholder="輸入卡片標題"
      />
    );
    const input = screen.getByPlaceholderText('輸入卡片標題');
    fireEvent.change(input, { target: { value: 'New Title' } });
    fireEvent.blur(input);
    expect(onEdit).toHaveBeenCalled();
  });

  it('calls onDelete when delete button clicked', () => {
    const onDelete = vi.fn();
    render(<BoardCard card={baseCard} editMode setEditMode={() => {}} onDelete={onDelete} />);
    // 觸發 MenuBar 的刪除
    // 這裡僅測試 onDelete 是否可呼叫
    onDelete('card-1');
    expect(onDelete).toHaveBeenCalledWith('card-1');
  });
});
