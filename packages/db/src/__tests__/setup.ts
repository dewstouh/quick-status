import { beforeEach, afterAll, beforeAll } from 'vitest'
import prisma from '../index'

// Ensure we're using a test database
process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./test.db'

beforeAll(async () => {
    // Ensure database connection and foreign key constraints are enabled
    try {
        await prisma.$executeRaw`PRAGMA foreign_keys = ON;`
        // Test basic connection
        const result = await prisma.$queryRaw`SELECT 1 as test;`
        console.log('Database setup completed successfully', result)
    } catch (error) {
        console.error('Database setup failed:', error)
        throw error
    }
})

beforeEach(async () => {
    // Clean up data before each test (outages first due to foreign keys)
    try {
        const deletedOutages = await prisma.outage.deleteMany()
        const deletedSites = await prisma.site.deleteMany()
        console.log(`Cleanup: Deleted ${deletedOutages.count} outages, ${deletedSites.count} sites`)
    } catch (error) {
        console.error('Database cleanup failed:', error)
        throw error
    }
})

afterAll(async () => {
    await prisma.$disconnect()
})