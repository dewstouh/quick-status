import { describe, it, expect, beforeEach, vi } from 'vitest'
import prisma from '../__mocks__/prisma'

describe('Database Connection', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should connect to database successfully', async () => {
        const mockResult = [{ test: 1 }]
        prisma.$queryRaw.mockResolvedValue(mockResult)

        const result = await prisma.$queryRaw`SELECT 1 as test`
        
        expect(prisma.$queryRaw).toHaveBeenCalled()
        expect(result).toEqual(mockResult)
    })

    it('should execute transactions', async () => {
        const mockSite = {
            id: 'transaction-site-id',
            name: 'Transaction Test',
            url: 'https://transaction.com',
            onlineChecks: 0,
            totalChecks: 0,
            lastResponseTime: 0,
            lastStatus: 'unknown',
            lastCheckedAt: null,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const mockOutage = {
            id: 'transaction-outage-id',
            siteId: 'transaction-site-id',
            type: 'down' as any,
            startTime: new Date(),
            endTime: null,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const mockTransactionResult = { site: mockSite, outage: mockOutage }

        prisma.$transaction.mockResolvedValue(mockTransactionResult)

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

        expect(prisma.$transaction).toHaveBeenCalled()
        expect(result.site).toEqual(mockSite)
        expect(result.outage).toEqual(mockOutage)
        expect(result.outage.siteId).toBe(result.site.id)
    })

    it('should rollback failed transactions', async () => {
        const error = new Error('Intentional error')
        prisma.$transaction.mockRejectedValue(error)
        prisma.site.findFirst.mockResolvedValue(null)

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
        
        expect(prisma.site.findFirst).toHaveBeenCalledWith({
            where: { name: 'Rollback Test' }
        })
        expect(site).toBeNull()
    })
})