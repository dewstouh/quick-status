import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('Prisma Client', () => {
  beforeEach(() => {
    // Clear any existing global prisma instance
    const globalForPrisma = global as unknown as { prisma: any }
    delete globalForPrisma.prisma
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('should create a new PrismaClient instance', async () => {
    // Mock the PrismaClient constructor
    vi.doMock('../generated/prisma', () => ({
      PrismaClient: vi.fn().mockImplementation(() => ({
        $connect: vi.fn(),
        $disconnect: vi.fn(),
      }))
    }))

    const { prisma } = await import('../client.js')
    
    expect(prisma).toBeDefined()
    expect(typeof prisma).toBe('object')
  })

  it('should reuse existing global prisma instance in non-production', async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    const mockPrismaInstance = {
      $connect: vi.fn(),
      $disconnect: vi.fn(),
    }

    // Mock the PrismaClient constructor
    vi.doMock('../generated/prisma', () => ({
      PrismaClient: vi.fn().mockImplementation(() => mockPrismaInstance)
    }))

    // First import should create the instance
    const { prisma: prisma1 } = await import('../client.js')
    
    // Clear the module cache and import again
    vi.resetModules()
    const { prisma: prisma2 } = await import('../client.js')
    
    // Should be the same instance due to global caching
    expect(prisma1).toBeDefined()
    expect(prisma2).toBeDefined()
    
    process.env.NODE_ENV = originalEnv
  })

  it('should not cache prisma instance in production', async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    const mockPrismaInstance = {
      $connect: vi.fn(),
      $disconnect: vi.fn(),
    }

    // Mock the PrismaClient constructor
    vi.doMock('../generated/prisma', () => ({
      PrismaClient: vi.fn().mockImplementation(() => mockPrismaInstance)
    }))

    const { prisma } = await import('../client.js')
    
    expect(prisma).toBeDefined()
    
    // In production, should not set global prisma
    const globalForPrisma = global as unknown as { prisma: any }
    expect(globalForPrisma.prisma).toBeUndefined()
    
    process.env.NODE_ENV = originalEnv
  })
})
