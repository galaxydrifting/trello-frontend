import { render, screen, fireEvent } from '@testing-library/react';
import AddListForm from '../AddListForm';
import { vi } from 'vitest';
import { BoardEditContext } from '../../../hooks/BoardEditContext';

describe('AddListForm', () => {
  it('renders input and button', () => {
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
        }}
      >
        <AddListForm isPending={false} />
      </BoardEditContext.Provider>
    );
    expect(screen.getByPlaceholderText('輸入新清單名稱')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onAdd when form submitted', () => {
    const onAdd = vi.fn();
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
          onAddList: onAdd,
          onEditList: vi.fn(),
          onDeleteList: vi.fn(),
          onAddCard: vi.fn(),
          onEditCard: vi.fn(),
          onDeleteCard: vi.fn(),
        }}
      >
        <AddListForm isPending={false} />
      </BoardEditContext.Provider>
    );
    const input = screen.getByPlaceholderText('輸入新清單名稱');
    fireEvent.change(input, { target: { value: 'New List' } });
    fireEvent.submit(input.closest('form')!);
    expect(onAdd).toHaveBeenCalledWith('New List');
  });
});
