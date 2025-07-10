import { OutageType, Prisma } from "@quick-status/db"
import prisma from "@quick-status/db";

export class SiteService {
    static async create(name: string, url: string) {
        return prisma.site.create({
            data: {
                name,
                url
            }
        })
    }

    static async getById(id: string) {
        return prisma.site.findUnique({
            where: { id },
            include: {
                outages: true
            }
        })
    }

    static async getByName(name: string) {
        return prisma.site.findUnique({
            where: { name },
            include: {
                outages: true
            }
        })
    }

    static async getByURL(url: string) {
        return prisma.site.findUnique({
            where: { url },
            include: {
                outages: true
            }
        })
    }

    static async getAll() {
        return prisma.site.findMany({
            include: {
                outages: true
            }
        });
    }

    static async addOutage(siteId: string, type: OutageType) {
        return prisma.outage.create({
            data: {
                siteId,
                type
            }
        })
    }

    static async getActiveOutage(siteId: string) {
        return prisma.outage.findFirst({
            where: {
                siteId,
                endTime: null
            },
            orderBy: { startTime: 'desc' }
        });
    }

    static async getOutageHistory(siteId: string, since: Date) {
        return prisma.outage.findMany({
            where: {
                siteId,
                startTime: { gte: since }
            },
            orderBy: { startTime: 'desc' }
        });
    }

    static async update(id: string, data: Prisma.SiteUpdateInput) {
        return prisma.site.update({
            where: { id },
            data
        })
    }

    static async delete(id: string) {
        return prisma.site.delete({
            where: { id }
        })
    }
}   