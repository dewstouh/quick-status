import { beforeEach, vi } from 'vitest';

// Simple mock that just tracks calls and returns promises
const mockPrisma = {
  site: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  outage: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
} as any;

// Mock the @quick-status/db module while preserving types and enums
vi.mock('@quick-status/db', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    default: mockPrisma
  };
});

beforeEach(() => {
  // Clear all mock call history and reset return values
  vi.clearAllMocks();
});
