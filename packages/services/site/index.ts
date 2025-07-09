import prisma from "@quick-status/db";

export default class SiteService {
    static async create(name: string, url: string) {
        return prisma.site.create({
            data: {
                name,
                url
            }
        })
    }

    static async getById(id: number) {
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

    static async update(id: number, data: Partial<{ name: string, url: string }>) {
        return prisma.site.update({
            where: { id },
            data
        })
    }

    static async delete(id: number) {
        return prisma.site.delete({
            where: { id }
        })
    }
}   