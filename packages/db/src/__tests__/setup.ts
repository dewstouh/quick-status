import { beforeEach, afterAll } from 'vitest'
import prisma from '../index'

beforeEach(async () => {
    // Clean up data before each test
    await prisma.outage.deleteMany()
    await prisma.site.deleteMany()
})

afterAll(async () => {
    await prisma.$disconnect()
})