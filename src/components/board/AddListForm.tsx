import { useState } from 'react';
import { useBoardEditContext } from '../../hooks/BoardEditContext';

const AddListForm = () => {
  const [name, setName] = useState('');
  const { onAddList, isCreatingList } = useBoardEditContext();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddList(name.trim());
    setName('');
  };

  return (
    <form className="flex gap-2 mb-4" onSubmit={handleSubmit}>
      <input
        type="text"
        className="border rounded px-2 py-1 flex-1"
        placeholder="輸入新清單名稱"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isCreatingList}
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-1 rounded disabled:bg-indigo-300"
        disabled={isCreatingList || !name.trim()}
      >
        {isCreatingList ? '新增中...' : '新增清單'}
      </button>
    </form>
  );
};

export default AddListForm;
