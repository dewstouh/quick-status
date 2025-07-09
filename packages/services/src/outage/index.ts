import { OutageType } from '@prisma/client';
import prisma from '@quick-status/db';

export default class OutageService {
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

    static async getActiveBySite(siteId: number) {
        return prisma.outage.findFirst({
            where: {
                siteId,
                endTime: null
            }
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