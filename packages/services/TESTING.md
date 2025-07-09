# Testing Documentation

![](https://i.imgur.com/gt2D7Tp.png)

## Overview

The services package uses a **simple mocking approach** for database testing to ensure:
- ✅ **Fast execution** - No real database operations
- ✅ **Reliable results** - No race conditions or data conflicts  
- ✅ **Test isolation** - Each test starts with clean state
- ✅ **Easy to understand** - Simple `mockPrisma` object casting
- ✅ **Low maintenance** - No complex mock implementations

## Simple Mock Approach

Instead of complex mock implementations, we use a **simple cast**:

```typescript
import prisma from '@quick-status/db';

// Cast to any for simple mocking
const mockPrisma = prisma as any;
```

### Test Setup (`src/__tests__/setup.ts`)

```typescript
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

// Mock the Prisma client
vi.mock('@quick-status/db', () => ({
  default: mockPrisma
}));

beforeEach(() => {
  // Clear all mock call history and reset return values
  vi.clearAllMocks();
});
```

## Test Structure

```
src/__tests__/
├── setup.ts               # Simple mock setup
├── site/
│   └── index.test.ts      # SiteService unit tests (15 tests)
├── outage/
│   └── index.test.ts      # OutageService unit tests (11 tests)
├── integration/
│   └── index.test.ts      # Cross-service integration tests (5 tests)
└── types/
    └── index.test.ts      # Type exports and API surface tests (4 tests)
```

## Writing Tests

### Simple Unit Test Example
```typescript
import { describe, it, expect, vi } from 'vitest';
import { SiteService } from '../../site';
import prisma from '@quick-status/db';

const mockPrisma = prisma as any;

describe('SiteService', () => {
  it('should create site successfully', async () => {
    const mockSite = {
      id: 1,
      name: 'Test Site',
      url: 'https://test.com'
    };
    
    mockPrisma.site.create.mockResolvedValue(mockSite);

    const site = await SiteService.create('Test Site', 'https://test.com');
    
    expect(mockPrisma.site.create).toHaveBeenCalledWith({
      data: { name: 'Test Site', url: 'https://test.com' }
    });
    expect(site).toEqual(mockSite);
  });
});
```

### Error Testing
```typescript
it('should handle errors', async () => {
  mockPrisma.site.create.mockRejectedValue(new Error('Constraint failed'));

  await expect(SiteService.create('Duplicate', 'https://test.com'))
    .rejects.toThrow('Constraint failed');
});
```

### Integration Testing
```typescript
it('should handle workflows', async () => {
  // Mock multiple calls in sequence
  mockPrisma.site.create.mockResolvedValue({ id: 1 });
  mockPrisma.outage.create.mockResolvedValue({ id: 1, siteId: 1 });
  
  const site = await SiteService.create('Site', 'https://test.com');
  const outage = await OutageService.create(site.id, OutageType.down);
  
  expect(outage.siteId).toBe(site.id);
});
```

## Benefits

### Simplicity
- **Just cast with `as any`** - No complex implementations
- **Use vi.fn() mocks** - Built-in Vitest functionality
- **Mock what you need** - Only mock the specific calls being tested

### Flexibility  
- **Easy error simulation** - `mockRejectedValue()` for any error
- **Sequence control** - `mockResolvedValueOnce()` for complex workflows
- **Call verification** - `toHaveBeenCalledWith()` for parameter checking

### Maintainability
- **No mock logic to maintain** - Just return what the test needs
- **Clear test intent** - Mocks are inline with test logic
- **Easy debugging** - Simple mock calls and expectations

## Running Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test src/__tests__/site/index.test.ts

# Run with coverage
pnpm test --coverage

# Watch mode for development
pnpm test --watch
```

## Test Coverage

Current test coverage includes:
- ✅ **35 tests** across all services
- ✅ **Unit tests** for SiteService (15 tests)
- ✅ **Unit tests** for OutageService (11 tests)
- ✅ **Integration tests** (5 tests)
- ✅ **Type/export tests** (4 tests)

All tests consistently pass with 100% reliability and execute in ~430ms.

