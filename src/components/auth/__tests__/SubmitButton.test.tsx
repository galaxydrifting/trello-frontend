import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SubmitButton } from '../SubmitButton';

describe('SubmitButton', () => {
  it('應該在初始狀態顯示「登入」', () => {
    render(<SubmitButton isPending={false} isSuccess={false} />);
    expect(screen.getByText('登入')).toBeInTheDocument();
  });

  it('應該在等待狀態顯示「登入中...」', () => {
    render(<SubmitButton isPending={true} isSuccess={false} />);
    expect(screen.getByText('登入中...')).toBeInTheDocument();
  });

  it('應該在成功狀態顯示「登入成功！」', () => {
    render(<SubmitButton isPending={false} isSuccess={true} />);
    expect(screen.getByText('登入成功！')).toBeInTheDocument();
  });

  it('應該在等待或成功狀態時禁用按鈕', () => {
    const { rerender } = render(<SubmitButton isPending={true} isSuccess={false} />);
    expect(screen.getByRole('button')).toBeDisabled();

    rerender(<SubmitButton isPending={false} isSuccess={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('應該在初始狀態時啟用按鈕', () => {
    render(<SubmitButton isPending={false} isSuccess={false} />);
    expect(screen.getByRole('button')).toBeEnabled();
  });
});