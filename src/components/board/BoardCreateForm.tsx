import React from 'react';
import { FaPlus } from 'react-icons/fa';

interface BoardCreateFormProps {
  newBoardName: string;
  setNewBoardName: (name: string) => void;
  onCreate: (e: React.FormEvent) => void;
  isPending: boolean;
}

const BoardCreateForm = ({
  newBoardName,
  setNewBoardName,
  onCreate,
  isPending,
}: BoardCreateFormProps) => (
  <form
    className="flex gap-2 mb-8 bg-white rounded-xl shadow-md p-4 items-center"
    onSubmit={onCreate}
  >
    <input
      type="text"
      className="border border-indigo-200 rounded-lg px-3 py-2 flex-1 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
      placeholder="輸入新看板名稱"
      value={newBoardName}
      onChange={(e) => setNewBoardName(e.target.value)}
      disabled={isPending}
    />
    <button
      type="submit"
      className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 disabled:bg-indigo-300 transition font-semibold text-base"
      disabled={isPending || !newBoardName.trim()}
    >
      <FaPlus />
      {isPending ? '新增中...' : '新增看板'}
    </button>
  </form>
);

export default BoardCreateForm;
