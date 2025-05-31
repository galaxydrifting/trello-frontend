import { renderHook, act } from '@testing-library/react';
import { useBoardEditState } from '../useBoardEditState';

describe('useBoardEditState', () => {
  it('初始狀態應為 null', () => {
    const { result } = renderHook(() => useBoardEditState());
    expect(result.current.editingListId).toBeNull();
    expect(result.current.editingCardId).toBeNull();
    expect(result.current.canEdit).toBe(true);
  });

  it('設定 editingListId 後，canEdit 應為 false', () => {
    const { result } = renderHook(() => useBoardEditState());
    act(() => {
      result.current.setEditingListId('list-1');
    });
    expect(result.current.editingListId).toBe('list-1');
    expect(result.current.canEdit).toBe(false);
  });

  it('設定 editingCardId 後，canEdit 應為 false', () => {
    const { result } = renderHook(() => useBoardEditState());
    act(() => {
      result.current.setEditingCardId('card-1');
    });
    expect(result.current.editingCardId).toBe('card-1');
    expect(result.current.canEdit).toBe(false);
  });

  it('同時只能有一個進入編輯模式', () => {
    const { result } = renderHook(() => useBoardEditState());
    act(() => {
      result.current.setEditingListId('list-1');
      result.current.setEditingCardId('card-1'); // 不應該被設置
    });
    expect(result.current.editingListId).toBe('list-1');
    expect(result.current.editingCardId).toBeNull();
  });

  it('清空 editingListId 後可再設 editingCardId', () => {
    const { result } = renderHook(() => useBoardEditState());
    act(() => {
      result.current.setEditingListId('list-1');
      result.current.setEditingListId(null);
      result.current.setEditingCardId('card-1');
    });
    expect(result.current.editingListId).toBeNull();
    expect(result.current.editingCardId).toBe('card-1');
  });

  it('清空 editingCardId 後可再設 editingListId', () => {
    const { result } = renderHook(() => useBoardEditState());
    act(() => {
      result.current.setEditingCardId('card-1');
      result.current.setEditingCardId(null);
      result.current.setEditingListId('list-1');
    });
    expect(result.current.editingCardId).toBeNull();
    expect(result.current.editingListId).toBe('list-1');
  });
});
