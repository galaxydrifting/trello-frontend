import { useBoardEditState } from './useBoardEditState';

interface BoardEditContextValueOptions {
  isEditingList: boolean;
  isDeletingList: boolean;
  isEditingCard: boolean;
  isDeletingCard: boolean;
  isCreatingList: boolean; // 新增
  isCreatingCard: boolean; // 新增
  // 新增：清單操作 handler
  onAddList: (name: string) => void;
  onEditList: (id: string, name: string) => void;
  onDeleteList: (id: string) => void;
  // 新增：卡片操作 handler
  onAddCard: (listId: string, title: string, content: string) => void;
  onEditCard: (id: string, title: string, content: string) => void;
  onDeleteCard: (listId: string, cardId: string) => void;
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
    isCreatingList: options.isCreatingList, // 新增
    isCreatingCard: options.isCreatingCard, // 新增
    onAddList: options.onAddList,
    onEditList: options.onEditList,
    onDeleteList: options.onDeleteList,
    onAddCard: options.onAddCard,
    onEditCard: options.onEditCard,
    onDeleteCard: options.onDeleteCard,
  };
};
