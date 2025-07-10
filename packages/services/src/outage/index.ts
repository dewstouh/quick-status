import { OutageType } from "@quick-status/db";
import prisma from '@quick-status/db';

export class OutageService {
    static async create(siteId: number, type: OutageType) {
        return prisma.outage.create({
            data: {
                siteId,
                type
            }
        })
    }

    static async get(id: number) {
        return prisma.outage.findUnique({
            where: { id }
        })
    }

    static async end(id: number) {
        return prisma.outage.update({
            where: { id },
            data: { endTime: new Date() }
        })
    }

    static async getSiteOutages(siteId: number) {
        return prisma.outage.findMany({
            where: { siteId },
            orderBy: { startTime: 'desc' }
        });
    }

    static async getActiveBySite(siteId: number) {
        return prisma.outage.findFirst({
            where: {
                siteId,
                endTime: null
            },
            orderBy: { startTime: 'desc' }
        });
    }

    static async getHistory(siteId: number, since: Date) {
        return prisma.outage.findMany({
            where: {
                siteId,
                startTime: { gte: since }
            },
            orderBy: { startTime: 'desc' }
        });
    }
}   