import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BoardCardEditForm from '../BoardCardEditForm';
import { BoardEditContext } from '../../../hooks/BoardEditContext';
import { vi } from 'vitest';

const baseCard = {
  id: 'card-1',
  title: 'Test Card',
  content: '<p>Card content</p>',
  position: 1,
  listId: 'list-1',
  boardId: 'board-1',
};

describe('BoardCardEditForm', () => {
  const fullContextValue = {
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
  };

  it('呼叫 onEditCard 當失去焦點', async () => {
    const onEditCard = vi.fn();
    render(
      <BoardEditContext.Provider
        value={{ ...fullContextValue, onEditCard }}
      >
        <BoardCardEditForm card={baseCard} onEditCard={onEditCard} titlePlaceholder="標題" />
      </BoardEditContext.Provider>
    );
    const input = screen.getByPlaceholderText('標題');
    fireEvent.change(input, { target: { value: '新標題' } });
    fireEvent.blur(input);
    await waitFor(() => {
      expect(onEditCard).toHaveBeenCalledWith('card-1', '新標題', expect.any(String));
    });
  });

  it('呼叫 onEditCard 當按下儲存', async () => {
    const onEditCard = vi.fn();
    render(
      <BoardEditContext.Provider
        value={{ ...fullContextValue, onEditCard }}
      >
        <BoardCardEditForm card={baseCard} onEditCard={onEditCard} titlePlaceholder="標題" />
      </BoardEditContext.Provider>
    );
    const input = screen.getByPlaceholderText('標題');
    fireEvent.change(input, { target: { value: '新標題2' } });
    // 點擊儲存按鈕
    const saveBtn = screen.getByRole('button', { name: /儲存|save/i });
    fireEvent.click(saveBtn);
    await waitFor(() => {
      expect(onEditCard).toHaveBeenCalledWith('card-1', '新標題2', expect.any(String));
    });
  });
});
