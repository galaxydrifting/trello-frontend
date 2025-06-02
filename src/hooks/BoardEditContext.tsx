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
  // 新增：清單操作 handler
  onAddList: (name: string) => void;
  onEditList: (id: string, name: string) => void;
  onDeleteList: (id: string) => void;
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
