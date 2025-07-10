import { beforeEach, afterAll, beforeAll } from 'vitest'
import prisma from '../index'

process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./test.db'

beforeAll(async () => {
    try {
        await prisma.$executeRaw`PRAGMA foreign_keys = ON;`
        await prisma.$queryRaw`SELECT 1 as test;`
        console.log('[SETUP] Database connected and foreign keys enabled.')
    } catch (err) {
        console.error('[SETUP] Failed to connect/setup DB:', err)
        throw err
    }
  })

beforeEach(async () => {
    try {
        await prisma.outage.deleteMany()
        await prisma.site.deleteMany()
        console.log('[BEFORE EACH] Database cleaned.')
    } catch (err) {
        console.error('[BEFORE EACH] Error cleaning DB:', err)
        throw err
    }
  })

afterAll(async () => {
    try {
        await prisma.$disconnect()
        console.log('[TEARDOWN] Database disconnected.')
    } catch (err) {
        console.error('[TEARDOWN] Error disconnecting DB:', err)
        throw err
    }
  })