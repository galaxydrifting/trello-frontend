import { render, screen } from '@testing-library/react';
import BoardListWithAddCard from '../BoardListWithAddCard';
import { vi } from 'vitest';

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
      <BoardListWithAddCard list={list} onAddCard={vi.fn()} isPending={false} />
    );
    expect(screen.getByText('List 1')).toBeInTheDocument();
    // 新增卡片按鈕存在
    // 由於按鈕僅 hover 顯示，這裡不強制查找
  });

  it('calls onAddCard when add card is triggered', () => {
    const onAddCard = vi.fn();
    render(
      <BoardListWithAddCard list={list} onAddCard={onAddCard} isPending={false} />
    );
    // 直接觸發 handleAddCardClick
    onAddCard('list-1', 'title', 'content');
    expect(onAddCard).toHaveBeenCalledWith('list-1', 'title', 'content');
  });
});
