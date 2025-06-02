import { createContext, useContext } from 'react';

interface BoardEditContextProps {
  editingListId: string | null;
  setEditingListId: (id: string | null) => void;
  editingCardId: string | null;
  setEditingCardId: (id: string | null) => void;
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

export const BoardEditContext = createContext<BoardEditContextProps | undefined>(undefined);

export const useBoardEditContext = () => {
  const context = useContext(BoardEditContext);
  if (!context) {
    throw new Error('useBoardEditContext 必須在 BoardEditContext.Provider 內使用');
  }
  return context;
};

export type { BoardEditContextProps };
