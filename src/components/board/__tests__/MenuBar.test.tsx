import { render, screen, fireEvent } from '@testing-library/react';
import MenuBar from '../MenuBar';
import { vi } from 'vitest';
import type { Editor } from '@tiptap/react';

// Mock editor
const mockEditor: Editor = {
  chain: () => ({
    focus: () => ({
      toggleBold: () => ({ run: vi.fn() }),
      toggleBulletList: () => ({ run: vi.fn() }),
      toggleOrderedList: () => ({ run: vi.fn() }),
    }),
  }),
} as unknown as Editor;

describe('MenuBar', () => {
  it('顯示儲存、取消、刪除（既有卡片編輯模式）', () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();
    const onDelete = vi.fn();
    render(
      <MenuBar
        editor={mockEditor}
        isDeleting={false}
        onSave={onSave}
        onCancel={onCancel}
        onDelete={onDelete}
        isTempCard={false}
      />
    );
    expect(screen.getByLabelText('儲存卡片')).toBeInTheDocument();
    expect(screen.getByLabelText('取消編輯')).toBeInTheDocument();
    expect(screen.getByLabelText('刪除卡片')).toBeInTheDocument();
  });

  it('顯示儲存、取消（暫存卡片編輯模式，不顯示刪除）', () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();
    render(
      <MenuBar
        editor={mockEditor}
        isDeleting={false}
        onSave={onSave}
        onCancel={onCancel}
        isTempCard={true}
      />
    );
    expect(screen.getByLabelText('儲存卡片')).toBeInTheDocument();
    expect(screen.getByLabelText('取消編輯')).toBeInTheDocument();
    expect(screen.queryByLabelText('刪除卡片')).not.toBeInTheDocument();
  });

  it('點擊儲存、取消、刪除會呼叫對應 callback', () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();
    const onDelete = vi.fn();
    render(
      <MenuBar
        editor={mockEditor}
        isDeleting={false}
        onSave={onSave}
        onCancel={onCancel}
        onDelete={onDelete}
        isTempCard={false}
      />
    );
    fireEvent.click(screen.getByLabelText('儲存卡片'));
    fireEvent.click(screen.getByLabelText('取消編輯'));
    fireEvent.click(screen.getByLabelText('刪除卡片'));
    expect(onSave).toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalled();
  });
});
