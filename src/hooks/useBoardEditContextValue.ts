import { useBoardEditState } from './useBoardEditState';

export const useBoardEditContextValue = () => {
  const {
    editingListId,
    setEditingListId,
  } = useBoardEditState();

  return { editingListId, setEditingListId };
};
