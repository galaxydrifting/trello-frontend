import { useState } from 'react';

/**
 * 管理 Board 編輯狀態（只允許同時一個清單或一張卡片進入編輯模式）
 * 改為單一 union 狀態，確保同時只能有一個在編輯
 */

type EditingTarget = { type: 'list'; id: string } | { type: 'card'; id: string } | null;

export const useBoardEditState = () => {
  const [editingTarget, setEditingTarget] = useState<EditingTarget>(null);

  const editingListId = editingTarget?.type === 'list' ? editingTarget.id : null;
  const editingCardId = editingTarget?.type === 'card' ? editingTarget.id : null;

  const setEditingListId = (v: string | null) => {
    setEditingTarget((prev) => {
      if (v) {
        if (prev === null) return { type: 'list', id: v };
        return prev;
      } else if (prev?.type === 'list') {
        return null;
      }
      return prev;
    });
  };
  const setEditingCardId = (v: string | null) => {
    setEditingTarget((prev) => {
      if (v) {
        if (prev === null) return { type: 'card', id: v };
        return prev;
      } else if (prev?.type === 'card') {
        return null;
      }
      return prev;
    });
  };

  return {
    editingListId,
    setEditingListId,
    editingCardId,
    setEditingCardId,
  };
};
