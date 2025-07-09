import { beforeEach, vi } from 'vitest';
import { clearMockData, mockPrisma } from './mocks/prisma';

// Mock the Prisma client
vi.mock('@quick-status/db', () => ({
  default: mockPrisma
}));

beforeEach(() => {
  // Clear mock data before each test
  clearMockData();
  
  // Clear all mock call history
  vi.clearAllMocks();
});
