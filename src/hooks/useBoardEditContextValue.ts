import { useBoardEditState } from './useBoardEditState';

interface BoardEditContextValueOptions {
  isEditingList: boolean;
  isDeletingList: boolean;
  isEditingCard: boolean;
  isDeletingCard: boolean;
}

export const useBoardEditContextValue = (options: BoardEditContextValueOptions) => {
  const { editingListId, setEditingListId, editingCardId, setEditingCardId } = useBoardEditState();

  return {
    editingListId,
    setEditingListId,
    editingCardId,
    setEditingCardId,
    ...options,
  };
};
