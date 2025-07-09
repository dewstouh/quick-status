import { beforeEach, afterAll } from 'vitest'
import { execSync } from 'child_process'
import prisma from '../index'

// Use a test database
process.env.DATABASE_URL = 'file:./test.db'

beforeEach(async () => {
    // Reset database before each test
    try {
        await prisma.outage.deleteMany()
        await prisma.site.deleteMany()
    } catch (error) {
        // Database might not exist yet, create it
        execSync('npx prisma db push --force-reset', { stdio: 'ignore' })
    }
})

afterAll(async () => {
    await prisma.$disconnect()
})