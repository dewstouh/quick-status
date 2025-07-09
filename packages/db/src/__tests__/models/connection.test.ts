import { describe, it, expect } from 'vitest'
import prisma from '../..'

describe('Database Connection', () => {
    it('should connect to database successfully', async () => {
        const result = await prisma.$queryRaw`SELECT 1 as test`
        expect(result).toBeDefined()
    })

    it('should execute transactions', async () => {
        const result = await prisma.$transaction(async (tx) => {
            const site = await tx.site.create({
                data: {
                    name: 'Transaction Test',
                    url: 'https://transaction.com'
                }
            })

            const outage = await tx.outage.create({
                data: {
                    siteId: site.id,
                    type: 'down'
                }
            })

            return { site, outage }
        })

        expect(result.site).toBeDefined()
        expect(result.outage).toBeDefined()
        expect(result.outage.siteId).toBe(result.site.id)
    })

    it('should rollback failed transactions', async () => {
        await expect(
            prisma.$transaction(async (tx) => {
                await tx.site.create({
                    data: {
                        name: 'Rollback Test',
                        url: 'https://rollback.com'
                    }
                })

                // This should cause the transaction to fail
                throw new Error('Intentional error')
            })
        ).rejects.toThrow('Intentional error')

        // Verify the site was not created
        const site = await prisma.site.findFirst({
            where: { name: 'Rollback Test' }
        })
        expect(site).toBeNull()
    })
})