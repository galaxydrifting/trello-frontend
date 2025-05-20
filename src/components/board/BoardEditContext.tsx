import { createContext, useContext } from 'react';

export interface BoardEditContextProps {
  editingListId: string | null;
  setEditingListId: (id: string | null) => void;
  editingCardId: string | null;
  setEditingCardId: (id: string | null) => void;
  canEdit: boolean;
  // 新增 CRUD handler 及 mutation 狀態
  onAddList?: (name: string) => void;
  onAddCard?: (listId: string, title: string, content: string) => void;
  onEditList?: (id: string, name: string) => void;
  onDeleteList?: (listId: string) => void;
  onEditCard?: (id: string, title: string, content: string) => void;
  onDeleteCard?: (listId: string, cardId: string) => void;
  isPendingAddList?: boolean;
  isPendingAddCard?: boolean;
  isPendingEditList?: boolean;
  isPendingDeleteList?: boolean;
  isPendingEditCard?: boolean;
  isPendingDeleteCard?: boolean;
}

export const BoardEditContext = createContext<BoardEditContextProps | undefined>(undefined);

export function useBoardEditContext() {
  const ctx = useContext(BoardEditContext);
  if (!ctx) throw new Error('useBoardEditContext must be used within BoardEditContext.Provider');
  return ctx;
}
