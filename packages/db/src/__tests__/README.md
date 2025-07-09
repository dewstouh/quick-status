# Database Package Testing

This package contains comprehensive tests for the Prisma database layer.

## Test Structure

```
src/__tests__/
├── setup.ts           # Test environment setup
├── site.test.ts       # Site model tests
├── outage.test.ts     # Outage model tests
└── connection.test.ts # Database connection tests
```

## Test Categories

### Site Model Tests
- CRUD operations (create, read, update, delete)
- Unique constraints (name, URL)
- Relationships with outages
- Default values

### Outage Model Tests
- CRUD operations
- Relationships with sites
- Enum validation (OutageType)
- Cascade delete behavior

### Connection Tests
- Database connectivity
- Transaction support
- Rollback behavior

## Running Tests

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```

## Test Database

Tests use a separate SQLite database (`test.db`) that is reset before each test to ensure isolation.

## Coverage Goals

- Minimum 80% coverage across all metrics
- Focus on database operations and constraints
- Verify Prisma schema behavior