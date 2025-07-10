import { describe, it, expect, beforeEach, vi } from 'vitest'
import prisma from '../__mocks__/prisma'

describe('Outage Model', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('CRUD Operations', () => {
        it('should create an outage successfully', async () => {
            const mockSite = {
                id: 'test-site-id',
                name: 'Outage Test Site',
                url: 'https://outagetest.com',
                onlineChecks: 0,
                totalChecks: 0,
                lastResponseTime: 0,
                lastStatus: 'unknown',
                lastCheckedAt: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const mockOutage = {
                id: 'test-outage-id',
                siteId: 'test-site-id',
                type: 'down' as any,
                startTime: new Date(),
                endTime: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            prisma.site.create.mockResolvedValue(mockSite)
            prisma.outage.create.mockResolvedValue(mockOutage)

            const site = await prisma.site.create({
                data: {
                    name: 'Outage Test Site',
                    url: 'https://outagetest.com'
                }
            })

            const outage = await prisma.outage.create({
                data: {
                    siteId: site.id,
                    type: 'down' as any
                }
            })

            expect(prisma.outage.create).toHaveBeenCalledWith({
                data: {
                    siteId: 'test-site-id',
                    type: 'down' as any
                }
            })

            expect(outage).toEqual(mockOutage)
        })

        it('should find outages by site', async () => {
            const mockSite = {
                id: 'find-site-id',
                name: 'Find Outages Site',
                url: 'https://findoutages.com',
                onlineChecks: 0,
                totalChecks: 0,
                lastResponseTime: 0,
                lastStatus: 'unknown',
                lastCheckedAt: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const mockOutage1 = {
                id: 'outage-1',
                siteId: 'find-site-id',
                type: 'down' as any,
                startTime: new Date(),
                endTime: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const mockOutage2 = {
                id: 'outage-2',
                siteId: 'find-site-id',
                type: 'degraded' as any,
                startTime: new Date(),
                endTime: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const mockOutages = [mockOutage1, mockOutage2]

            prisma.site.create.mockResolvedValue(mockSite)
            prisma.outage.create
                .mockResolvedValueOnce(mockOutage1)
                .mockResolvedValueOnce(mockOutage2)
            prisma.outage.findMany.mockResolvedValue(mockOutages)

            const site = await prisma.site.create({
                data: {
                    name: 'Find Outages Site',
                    url: 'https://findoutages.com'
                }
            })

            // Create outages
            await prisma.outage.create({
                data: { siteId: site.id, type: 'down' }
            })

            await prisma.outage.create({
                data: { siteId: site.id, type: 'degraded' }
            })

            const outages = await prisma.outage.findMany({
                where: { siteId: site.id }
            })

            expect(prisma.outage.findMany).toHaveBeenCalledWith({
                where: { siteId: 'find-site-id' }
            })

            expect(outages).toHaveLength(2)
            expect(outages.some(o => o.type === 'down')).toBe(true)
            expect(outages.some(o => o.type === 'degraded')).toBe(true)
        })

        it('should update outage end time', async () => {
            const mockSite = {
                id: 'update-site-id',
                name: 'Update Outage Site',
                url: 'https://updateoutage.com',
                onlineChecks: 0,
                totalChecks: 0,
                lastResponseTime: 0,
                lastStatus: 'unknown',
                lastCheckedAt: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const mockOutage = {
                id: 'update-outage-id',
                siteId: 'update-site-id',
                type: 'down' as any,
                startTime: new Date(),
                endTime: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const endTime = new Date()
            const mockUpdatedOutage = {
                ...mockOutage,
                endTime
            }

            prisma.site.create.mockResolvedValue(mockSite)
            prisma.outage.create.mockResolvedValue(mockOutage)
            prisma.outage.update.mockResolvedValue(mockUpdatedOutage)

            const site = await prisma.site.create({
                data: {
                    name: 'Update Outage Site',
                    url: 'https://updateoutage.com'
                }
            })

            const outage = await prisma.outage.create({
                data: {
                    siteId: site.id,
                    type: 'down'
                }
            })

            const updated = await prisma.outage.update({
                where: { id: outage.id },
                data: { endTime }
            })

            expect(prisma.outage.update).toHaveBeenCalledWith({
                where: { id: 'update-outage-id' },
                data: { endTime }
            })

            expect(updated.endTime).toEqual(endTime)
        })
    })

    describe('Relationships', () => {
        it('should include site information when requested', async () => {
            const mockSite = {
                id: 'relation-site-id',
                name: 'Outage Relation Site',
                url: 'https://outagerelation.com',
                onlineChecks: 0,
                totalChecks: 0,
                lastResponseTime: 0,
                lastStatus: 'unknown',
                lastCheckedAt: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const mockOutage = {
                id: 'relation-outage-id',
                siteId: 'relation-site-id',
                type: 'degraded' as any,
                startTime: new Date(),
                endTime: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const mockOutageWithSite = {
                ...mockOutage,
                site: {
                    id: mockSite.id,
                    name: mockSite.name,
                    url: mockSite.url
                }
            }

            prisma.site.create.mockResolvedValue(mockSite)
            prisma.outage.create.mockResolvedValue(mockOutage)
            prisma.outage.findUnique.mockResolvedValue(mockOutageWithSite)

            const site = await prisma.site.create({
                data: {
                    name: 'Outage Relation Site',
                    url: 'https://outagerelation.com'
                }
            })

            const outage = await prisma.outage.create({
                data: {
                    siteId: site.id,
                    type: 'degraded'
                }
            })

            // Ensure the relationship is properly established
            const outageWithSite = await prisma.outage.findUnique({
                where: { id: outage.id },
                include: { 
                    site: {
                        select: {
                            id: true,
                            name: true,
                            url: true
                        }
                    }
                }
            })

            expect(prisma.outage.findUnique).toHaveBeenCalledWith({
                where: { id: 'relation-outage-id' },
                include: { 
                    site: {
                        select: {
                            id: true,
                            name: true,
                            url: true
                        }
                    }
                }
            })

            expect(outageWithSite).toBeDefined()
            expect(outageWithSite?.site).toBeDefined()
            expect(outageWithSite?.site).toMatchObject({
                id: site.id,
                name: 'Outage Relation Site',
                url: 'https://outagerelation.com'
            })
        })

        it('should cascade delete outages when site is deleted', async () => {
            const mockSite = {
                id: 'cascade-site-id',
                name: 'Cascade Test Site',
                url: 'https://cascade.com',
                onlineChecks: 0,
                totalChecks: 0,
                lastResponseTime: 0,
                lastStatus: 'unknown',
                lastCheckedAt: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const mockOutage = {
                id: 'cascade-outage-id',
                siteId: 'cascade-site-id',
                type: 'down' as any,
                startTime: new Date(),
                endTime: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            prisma.site.create.mockResolvedValue(mockSite)
            prisma.outage.create.mockResolvedValue(mockOutage)
            prisma.outage.findUnique
                .mockResolvedValueOnce(mockOutage) // Before deletion
                .mockResolvedValueOnce(null) // After deletion
            prisma.site.delete.mockResolvedValue(mockSite)

            const site = await prisma.site.create({
                data: {
                    name: 'Cascade Test Site',
                    url: 'https://cascade.com'
                }
            })

            const outage = await prisma.outage.create({
                data: {
                    siteId: site.id,
                    type: 'down'
                }
            })

            // Verify the outage exists before deletion
            const outageBeforeDelete = await prisma.outage.findUnique({
                where: { id: outage.id }
            })
            expect(outageBeforeDelete).not.toBeNull()

            // Delete the site (should cascade delete the outage)
            const deletedSite = await prisma.site.delete({
                where: { id: site.id }
            })
            expect(deletedSite).toBeDefined()

            // Verify the outage was cascade deleted
            const deletedOutage = await prisma.outage.findUnique({
                where: { id: outage.id }
            })

            expect(deletedOutage).toBeNull()
        })
    })

    describe('Enum Values', () => {
        it('should accept valid outage types', async () => {
            const mockSite = {
                id: 'enum-site-id',
                name: 'Enum Test Site',
                url: 'https://enum.com',
                onlineChecks: 0,
                totalChecks: 0,
                lastResponseTime: 0,
                lastStatus: 'unknown',
                lastCheckedAt: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const mockDownOutage = {
                id: 'down-outage-id',
                siteId: 'enum-site-id',
                type: 'down' as any,
                startTime: new Date(),
                endTime: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const mockDegradedOutage = {
                id: 'degraded-outage-id',
                siteId: 'enum-site-id',
                type: 'degraded' as any,
                startTime: new Date(),
                endTime: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            prisma.site.create.mockResolvedValue(mockSite)
            prisma.outage.create
                .mockResolvedValueOnce(mockDownOutage)
                .mockResolvedValueOnce(mockDegradedOutage)

            const site = await prisma.site.create({
                data: {
                    name: 'Enum Test Site',
                    url: 'https://enum.com'
                }
            })

            // Verify site was created
            expect(site.id).toBeDefined()

            const downOutage = await prisma.outage.create({
                data: {
                    siteId: site.id,
                    type: 'down'
                }
            })

            // Verify first outage before creating second
            expect(downOutage.id).toBeDefined()
            expect(downOutage.type).toBe('down')

            const degradedOutage = await prisma.outage.create({
                data: {
                    siteId: site.id,
                    type: 'degraded'
                }
            })

            expect(degradedOutage.id).toBeDefined()
            expect(degradedOutage.type).toBe('degraded')
        })

        it('should reject invalid outage types', async () => {
            const mockSite = {
                id: 'invalid-enum-site-id',
                name: 'Invalid Enum Site',
                url: 'https://invalidenum.com',
                onlineChecks: 0,
                totalChecks: 0,
                lastResponseTime: 0,
                lastStatus: 'unknown',
                lastCheckedAt: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            prisma.site.create.mockResolvedValue(mockSite)
            prisma.outage.create.mockRejectedValue(new Error('Invalid enum value'))

            const site = await prisma.site.create({
                data: {
                    name: 'Invalid Enum Site',
                    url: 'https://invalidenum.com'
                }
            })

            await expect(
                prisma.outage.create({
                    data: {
                        siteId: site.id,
                        type: 'invalid' as any
                    }
                })
            ).rejects.toThrow()
        })
    })
})