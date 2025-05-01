import { useState } from 'react';
import BoardList from './BoardList';
import { List } from './types';

interface BoardListWithAddCardProps {
  list: List;
  onAddCard: (listId: string, title: string, content: string) => void;
  isPending: boolean;
  onEditList?: (id: string, name: string) => void;
  onDeleteList?: (id: string) => void;
  isEditingList?: boolean;
  isDeletingList?: boolean;
  onEditCard?: (id: string, title: string, content: string) => void;
  onDeleteCard?: (id: string) => void;
  isEditingCard?: boolean;
  isDeletingCard?: boolean;
}

const BoardListWithAddCard = ({
  list,
  onAddCard,
  isPending,
  onEditList,
  onDeleteList,
  isEditingList,
  isDeletingList,
  onEditCard,
  onDeleteCard,
  isEditingCard,
  isDeletingCard,
}: BoardListWithAddCardProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <div className="min-w-[260px]">
      <BoardList
        list={list}
        onEdit={onEditList}
        onDelete={onDeleteList}
        isEditing={isEditingList}
        isDeleting={isDeletingList}
        onEditCard={onEditCard}
        onDeleteCard={onDeleteCard}
        isEditingCard={isEditingCard}
        isDeletingCard={isDeletingCard}
      />
      <form
        className="mt-2 flex flex-col gap-1 bg-gray-50 rounded p-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          onAddCard(list.id, title.trim(), content.trim());
          setTitle('');
          setContent('');
        }}
      >
        <input
          type="text"
          className="border rounded px-2 py-1 mb-1"
          placeholder="卡片標題 (必填)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPending}
          required
        />
        <input
          type="text"
          className="border rounded px-2 py-1 mb-1"
          placeholder="卡片內容 (可選)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPending}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-2 py-1 rounded disabled:bg-green-300"
          disabled={isPending || !title.trim()}
        >
          {isPending ? '新增中...' : '新增卡片'}
        </button>
      </form>
    </div>
  );
};

export default BoardListWithAddCard;
