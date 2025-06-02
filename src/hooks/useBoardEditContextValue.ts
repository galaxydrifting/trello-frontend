import { useBoardEditState } from './useBoardEditState';

interface BoardEditContextValueOptions {
  isEditingList: boolean;
  isDeletingList: boolean;
  isEditingCard: boolean;
  isDeletingCard: boolean;
  // 新增：清單操作 handler
  onAddList: (name: string) => void;
  onEditList: (id: string, name: string) => void;
  onDeleteList: (id: string) => void;
}

export const useBoardEditContextValue = (options: BoardEditContextValueOptions) => {
  const { editingListId, setEditingListId, editingCardId, setEditingCardId } = useBoardEditState();

  return {
    editingListId,
    setEditingListId,
    editingCardId,
    setEditingCardId,
    isEditingList: options.isEditingList,
    isDeletingList: options.isDeletingList,
    isEditingCard: options.isEditingCard,
    isDeletingCard: options.isDeletingCard,
    onAddList: options.onAddList,
    onEditList: options.onEditList,
    onDeleteList: options.onDeleteList,
  };
};
