import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// 在每個測試後自動清理
afterEach(() => {
  cleanup();
});
