import { render, screen, fireEvent } from '@testing-library/react';
import AddListForm from '../AddListForm';
import { vi } from 'vitest';

describe('AddListForm', () => {
  it('renders input and button', () => {
    render(<AddListForm onAdd={vi.fn()} isPending={false} />);
    expect(screen.getByPlaceholderText('輸入新清單名稱')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onAdd when form submitted', () => {
    const onAdd = vi.fn();
    render(<AddListForm onAdd={onAdd} isPending={false} />);
    const input = screen.getByPlaceholderText('輸入新清單名稱');
    fireEvent.change(input, { target: { value: 'New List' } });
    fireEvent.submit(input.closest('form')!);
    expect(onAdd).toHaveBeenCalledWith('New List');
  });
});
