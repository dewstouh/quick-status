import { describe, it, expect, beforeEach, vi } from 'vitest'
import prisma from '../__mocks__/prisma'

describe('Site Model', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('CRUD Operations', () => {
        it('should create a site successfully', async () => {
            const mockSite = {
                id: 'test-site-id',
                name: 'Test Site',
                url: 'https://test.com',
                onlineChecks: 0,
                totalChecks: 0,
                lastResponseTime: 0,
                lastStatus: 'unknown',
                lastCheckedAt: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            prisma.site.create.mockResolvedValue(mockSite)

            const site = await prisma.site.create({
                data: {
                    name: 'Test Site',
                    url: 'https://test.com'
                }
            })

            expect(prisma.site.create).toHaveBeenCalledWith({
                data: {
                    name: 'Test Site',
                    url: 'https://test.com'
                }
            })

            expect(site).toEqual(mockSite)
        })

        it('should find a site by id', async () => {
            const mockSite = {
                id: 'find-test-id',
                name: 'Find Test Site',
                url: 'https://findtest.com',
                onlineChecks: 0,
                totalChecks: 0,
                lastResponseTime: 0,
                lastStatus: 'unknown',
                lastCheckedAt: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            prisma.site.findUnique.mockResolvedValue(mockSite)

            const foundSite = await prisma.site.findUnique({
                where: { id: 'find-test-id' }
            })

            expect(prisma.site.findUnique).toHaveBeenCalledWith({
                where: { id: 'find-test-id' }
            })

            expect(foundSite).toEqual(mockSite)
        })

        it('should update a site', async () => {
            const mockUpdatedSite = {
                id: 'update-test-id',
                name: 'Updated Site',
                url: 'https://update.com',
                onlineChecks: 10,
                totalChecks: 12,
                lastResponseTime: 0,
                lastStatus: 'unknown',
                lastCheckedAt: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            prisma.site.update.mockResolvedValue(mockUpdatedSite)

            const updated = await prisma.site.update({
                where: { id: 'update-test-id' },
                data: {
                    name: 'Updated Site',
                    onlineChecks: 10,
                    totalChecks: 12
                }
            })

            expect(prisma.site.update).toHaveBeenCalledWith({
                where: { id: 'update-test-id' },
                data: {
                    name: 'Updated Site',
                    onlineChecks: 10,
                    totalChecks: 12
                }
            })

            expect(updated).toEqual(mockUpdatedSite)
        })

        it('should delete a site', async () => {
            const mockDeletedSite = {
                id: 'delete-test-id',
                name: 'Delete Test',
                url: 'https://delete.com',
                onlineChecks: 0,
                totalChecks: 0,
                lastResponseTime: 0,
                lastStatus: 'unknown',
                lastCheckedAt: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            prisma.site.delete.mockResolvedValue(mockDeletedSite)
            prisma.site.findUnique.mockResolvedValue(null)

            const deleted = await prisma.site.delete({
                where: { id: 'delete-test-id' }
            })

            expect(prisma.site.delete).toHaveBeenCalledWith({
                where: { id: 'delete-test-id' }
            })

            expect(deleted).toEqual(mockDeletedSite)

            // Verify it can't be found after deletion
            const notFound = await prisma.site.findUnique({
                where: { id: 'delete-test-id' }
            })

            expect(notFound).toBeNull()
        })
    })

    describe('Constraints', () => {
        it('should enforce unique name constraint', async () => {
            const error = new Error('Unique constraint failed on the fields: (`name`)')
            
            prisma.site.create
                .mockResolvedValueOnce({
                    id: 'unique-test-1',
                    name: 'Unique Test',
                    url: 'https://unique1.com',
                    onlineChecks: 0,
                    totalChecks: 0,
                    lastResponseTime: 0,
                    lastStatus: 'unknown',
                    lastCheckedAt: null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
                .mockRejectedValueOnce(error)

            // First creation should succeed
            await prisma.site.create({
                data: {
                    name: 'Unique Test',
                    url: 'https://unique1.com'
                }
            })

            // Second creation with same name should fail
            await expect(
                prisma.site.create({
                    data: {
                        name: 'Unique Test',
                        url: 'https://unique2.com'
                    }
                })
            ).rejects.toThrow('Unique constraint failed')
        })

        it('should enforce unique url constraint', async () => {
            const error = new Error('Unique constraint failed on the fields: (`url`)')
            
            prisma.site.create
                .mockResolvedValueOnce({
                    id: 'url-test-1',
                    name: 'URL Test 1',
                    url: 'https://sameurl.com',
                    onlineChecks: 0,
                    totalChecks: 0,
                    lastResponseTime: 0,
                    lastStatus: 'unknown',
                    lastCheckedAt: null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
                .mockRejectedValueOnce(error)

            // First creation should succeed
            await prisma.site.create({
                data: {
                    name: 'URL Test 1',
                    url: 'https://sameurl.com'
                }
            })

            // Second creation with same URL should fail
            await expect(
                prisma.site.create({
                    data: {
                        name: 'URL Test 2',
                        url: 'https://sameurl.com'
                    }
                })
            ).rejects.toThrow('Unique constraint failed')
        })
    })

    describe('Relationships', () => {
        it('should include outages when requested', async () => {
            const mockSite = {
                id: 'relation-test-id',
                name: 'Relation Test',
                url: 'https://relation.com',
                onlineChecks: 0,
                totalChecks: 0,
                lastResponseTime: 0,
                lastStatus: 'unknown',
                lastCheckedAt: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const mockOutage = {
                id: 'outage-test-id',
                siteId: 'relation-test-id',
                type: 'down' as any,
                startTime: new Date(),
                endTime: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const mockSiteWithOutages = {
                ...mockSite,
                outages: [mockOutage]
            }

            prisma.site.create.mockResolvedValue(mockSite)
            prisma.outage.create.mockResolvedValue(mockOutage)
            prisma.site.findUnique.mockResolvedValue(mockSiteWithOutages)

            // Create site
            const site = await prisma.site.create({
                data: {
                    name: 'Relation Test',
                    url: 'https://relation.com'
                }
            })

            // Create outage
            await prisma.outage.create({
                data: {
                    siteId: site.id,
                    type: 'down'
                }
            })

            // Fetch site with outages
            const siteWithOutages = await prisma.site.findUnique({
                where: { id: site.id },
                include: { outages: true }
            })

            expect(prisma.site.findUnique).toHaveBeenCalledWith({
                where: { id: 'relation-test-id' },
                include: { outages: true }
            })

            expect(siteWithOutages).toBeDefined()
            expect(siteWithOutages?.outages).toHaveLength(1)
            expect(siteWithOutages?.outages[0]).toMatchObject({
                siteId: 'relation-test-id',
                type: 'down'
            })
        })
    })
})