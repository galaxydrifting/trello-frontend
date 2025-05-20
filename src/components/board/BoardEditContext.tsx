import { createContext, useContext } from 'react';

export interface BoardEditContextProps {
  editingListId: string | null;
  setEditingListId: (id: string | null) => void;
  editingCardId: string | null;
  setEditingCardId: (id: string | null) => void;
  canEdit: boolean;
}

export const BoardEditContext = createContext<BoardEditContextProps | undefined>(undefined);

export function useBoardEditContext() {
  const ctx = useContext(BoardEditContext);
  if (!ctx) throw new Error('useBoardEditContext must be used within BoardEditContext.Provider');
  return ctx;
}
