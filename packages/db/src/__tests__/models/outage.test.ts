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

            // Verify site was created
            expect(site.id).toBeDefined()

            await prisma.outage.createMany({
                data: [
                    { siteId: site.id, type: 'down' },
                    { siteId: site.id, type: 'degraded' }
                ]
            })

            const outages = await prisma.outage.findMany({
                where: { siteId: site.id }
            })

            expect(outages).toHaveLength(2)
            expect(outages[0]?.type).toBe('down')
            expect(outages[1]?.type).toBe('degraded')
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

            const outageWithSite = await prisma.outage.findUnique({
                where: { id: outage.id },
                include: { site: true }
            })

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

            const degradedOutage = await prisma.outage.create({
                data: {
                    siteId: site.id,
                    type: 'degraded'
                }
            })

            expect(downOutage.type).toBe('down')
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