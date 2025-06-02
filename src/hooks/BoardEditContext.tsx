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
}

export const BoardEditContext = createContext<BoardEditContextProps | undefined>(undefined);

export const useBoardEditContext = () => {
  const context = useContext(BoardEditContext);
  if (!context) {
    throw new Error('useBoardEditContext 必須在 BoardEditContext.Provider 內使用');
  }
  return context;
};
