import { describe, it, expect } from 'vitest'
import prisma from '../..'

describe('Site Model', () => {
    describe('CRUD Operations', () => {
        it('should create a site successfully', async () => {
            const site = await prisma.site.create({
                data: {
                    name: 'Test Site',
                    url: 'https://test.com'
                }
            })

            expect(site).toMatchObject({
                id: expect.any(Number),
                name: 'Test Site',
                url: 'https://test.com',
                onlineChecks: 0,
                totalChecks: 0,
                lastResponseTime: 0,
                lastStatus: 'unknown',
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            })
        })

        it('should find a site by id', async () => {
            const createdSite = await prisma.site.create({
                data: {
                    name: 'Find Test Site',
                    url: 'https://findtest.com'
                }
            })

            const foundSite = await prisma.site.findUnique({
                where: { id: createdSite.id }
            })

            expect(foundSite).toMatchObject({
                id: createdSite.id,
                name: 'Find Test Site',
                url: 'https://findtest.com'
            })
        })

        it('should update a site', async () => {
            const site = await prisma.site.create({
                data: {
                    name: 'Update Test',
                    url: 'https://update.com'
                }
            })

            const updated = await prisma.site.update({
                where: { id: site.id },
                data: {
                    name: 'Updated Site',
                    onlineChecks: 10,
                    totalChecks: 12
                }
            })

            expect(updated).toMatchObject({
                id: site.id,
                name: 'Updated Site',
                onlineChecks: 10,
                totalChecks: 12
            })
        })

        it('should delete a site', async () => {
            const site = await prisma.site.create({
                data: {
                    name: 'Delete Test',
                    url: 'https://delete.com'
                }
            })

            await prisma.site.delete({
                where: { id: site.id }
            })

            const deleted = await prisma.site.findUnique({
                where: { id: site.id }
            })

            expect(deleted).toBeNull()
        })
    })

    describe('Constraints', () => {
        it('should enforce unique name constraint', async () => {
            await prisma.site.create({
                data: {
                    name: 'Unique Test',
                    url: 'https://unique1.com'
                }
            })

            await expect(
                prisma.site.create({
                    data: {
                        name: 'Unique Test',
                        url: 'https://unique2.com'
                    }
                })
            ).rejects.toThrow()
        })

        it('should enforce unique url constraint', async () => {
            await prisma.site.create({
                data: {
                    name: 'URL Test 1',
                    url: 'https://sameurl.com'
                }
            })

            await expect(
                prisma.site.create({
                    data: {
                        name: 'URL Test 2',
                        url: 'https://sameurl.com'
                    }
                })
            ).rejects.toThrow()
        })
    })

    describe('Relationships', () => {
        it('should include outages when requested', async () => {
            const site = await prisma.site.create({
                data: {
                    name: 'Relation Test',
                    url: 'https://relation.com'
                }
            })

            await prisma.outage.create({
                data: {
                    siteId: site.id,
                    type: 'down'
                }
            })

            const siteWithOutages = await prisma.site.findUnique({
                where: { id: site.id },
                include: { outages: true }
            })

            expect(siteWithOutages?.outages).toHaveLength(1)
            expect(siteWithOutages?.outages[0]).toMatchObject({
                siteId: site.id,
                type: 'down'
            })
        })
    })
})