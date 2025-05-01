import { useState } from 'react';

interface AddListFormProps {
  onAdd: (name: string) => void;
  isPending: boolean;
}

const AddListForm = ({ onAdd, isPending }: AddListFormProps) => {
  const [name, setName] = useState('');

  return (
    <form
      className="flex gap-2 mb-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onAdd(name.trim());
        setName('');
      }}
    >
      <input
        type="text"
        className="border rounded px-2 py-1 flex-1"
        placeholder="輸入新清單名稱"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isPending}
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-1 rounded disabled:bg-indigo-300"
        disabled={isPending || !name.trim()}
      >
        {isPending ? '新增中...' : '新增清單'}
      </button>
    </form>
  );
};

export default AddListForm;
