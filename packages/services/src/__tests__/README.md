# Services Testing

> Minimum coverage to pass: 80%

![](https://i.imgur.com/KjjsT7a.png)

![](https://i.imgur.com/gt2D7Tp.png)

This directory contains comprehensive tests for the `@quick-status/services` package.

## Test Structure

### Unit Tests
- **`site.test.ts`** - Tests for SiteService including CRUD operations, outage management, and error handling
- **`outage.test.ts`** - Tests for OutageService including creation, retrieval, and history operations
- **`exports.test.ts`** - Tests for package exports and type definitions

### Integration Tests
- **`integration.test.ts`** - Tests for service interactions, data consistency, and complex workflows

### Test Setup
- **`setup.ts`** - Test environment configuration and database setup

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

The tests cover:

### SiteService
- ✅ Site creation with validation
- ✅ Retrieval by ID, name, and URL
- ✅ Getting all sites with outages
- ✅ Adding outages to sites
- ✅ Active outage detection
- ✅ Outage history filtering
- ✅ Site updates and deletion
- ✅ Cascade delete behavior

### OutageService
- ✅ Outage creation for existing sites
- ✅ Outage retrieval and ending
- ✅ Site-specific outage queries
- ✅ Active outage detection
- ✅ Historical data filtering
- ✅ Proper ordering (desc by startTime)

### Integration
- ✅ Cross-service workflows
- ✅ Data consistency across operations
- ✅ Concurrent operation handling
- ✅ Referential integrity
- ✅ Error handling for edge cases

## Database Setup

Tests use an isolated SQLite database (`test.db`) that is:
- Created fresh for each test run
- Cleaned between individual tests
- Automatically torn down after tests complete

## Error Scenarios Tested

- Creating sites with duplicate names/URLs
- Operations on nonexistent entities
- Foreign key constraint violations
- Cascade delete operations
- Concurrent operations

## Mock Data

Tests create realistic test data including:
- Sites with various configurations
- Outages with different types and durations
- Historical data with specific timestamps
- Active and completed outages

This ensures comprehensive coverage of real-world usage scenarios.
