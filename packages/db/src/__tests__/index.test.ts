import { describe, it, expect, vi } from 'vitest'

describe('Database Index', () => {
  it('should export prisma as default', async () => {
    // Mock the client module
    const mockPrisma = {
      $connect: vi.fn(),
      $disconnect: vi.fn(),
    }
    
    vi.doMock('../client.js', () => ({
      prisma: mockPrisma
    }))

    // Mock the generated prisma module
    vi.doMock('../generated/prisma', () => ({
      PrismaClient: vi.fn(),
      OutageType: {
        down: 'down',
        degraded: 'degraded'
      }
    }))

    const indexModule = await import('../index.js')
    
    expect(indexModule.default).toBeDefined()
    expect(indexModule.default).toBe(mockPrisma)
  })

  it('should export types from generated prisma', async () => {
    // Mock the client module
    const mockPrisma = {
      $connect: vi.fn(),
      $disconnect: vi.fn(),
    }
    
    vi.doMock('../client.js', () => ({
      prisma: mockPrisma
    }))

    // Mock the generated prisma module with types
    const mockTypes = {
      PrismaClient: vi.fn(),
      OutageType: {
        down: 'down',
        degraded: 'degraded'
      },
      Site: {},
      Outage: {}
    }
    
    vi.doMock('../generated/prisma', () => mockTypes)

    const indexModule = await import('../index.js')
    
    // Check that exports include the mocked types
    expect(indexModule.OutageType).toBeDefined()
    expect(indexModule.OutageType).toStrictEqual(mockTypes.OutageType)
    expect(indexModule.PrismaClient).toBeDefined()
    expect(typeof indexModule.PrismaClient).toBe('function')
  })
})
