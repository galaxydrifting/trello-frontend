import { useBoardEditState } from './useBoardEditState';

export const useBoardEditContextValue = () => {
  const { editingListId, setEditingListId, editingCardId, setEditingCardId } = useBoardEditState();

  return { editingListId, setEditingListId, editingCardId, setEditingCardId };
};
