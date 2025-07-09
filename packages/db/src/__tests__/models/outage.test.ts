import { describe, it, expect } from 'vitest'
import prisma from '../..'

describe('Outage Model', () => {
    describe('CRUD Operations', () => {
        it('should create an outage successfully', async () => {
            const site = await prisma.site.create({
                data: {
                    name: 'Outage Test Site',
                    url: 'https://outagetest.com'
                }
            })

            const outage = await prisma.outage.create({
                data: {
                    siteId: site.id,
                    type: 'down'
                }
            })

            expect(outage).toMatchObject({
                id: expect.any(Number),
                siteId: site.id,
                type: 'down',
                startTime: expect.any(Date),
                endTime: null,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            })
        })

        it('should find outages by site', async () => {
            const site = await prisma.site.create({
                data: {
                    name: 'Find Outages Site',
                    url: 'https://findoutages.com'
                }
            })

            // Verify site was created and persisted
            expect(site.id).toBeDefined()
            
            // Create outages with individual operations for better error handling
            const outage1 = await prisma.outage.create({
                data: { siteId: site.id, type: 'down' }
            })

            const outage2 = await prisma.outage.create({
                data: { siteId: site.id, type: 'degraded' }
            })

            // Verify outages were created
            expect(outage1.id).toBeDefined()
            expect(outage2.id).toBeDefined()

            const outages = await prisma.outage.findMany({
                where: { siteId: site.id }
            })

            expect(outages).toHaveLength(2)
            expect(outages.some(o => o.type === 'down')).toBe(true)
            expect(outages.some(o => o.type === 'degraded')).toBe(true)
        })

        it('should update outage end time', async () => {
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

            const endTime = new Date()
            const updated = await prisma.outage.update({
                where: { id: outage.id },
                data: { endTime }
            })

            expect(updated.endTime).toEqual(endTime)
        })
    })

    describe('Relationships', () => {
        it('should include site information when requested', async () => {
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

            expect(outageWithSite).toBeDefined()
            expect(outageWithSite?.site).toBeDefined()
            expect(outageWithSite?.site).toMatchObject({
                id: site.id,
                name: 'Outage Relation Site',
                url: 'https://outagerelation.com'
            })
        })

        it('should cascade delete outages when site is deleted', async () => {
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