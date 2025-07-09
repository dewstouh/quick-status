"use server";

import { SiteService, StatusType } from "@quick-status/services";
import { getUptime } from "../lib/utils";

export type ServiceStatus = {
    name: string;
    url: string;
    status: StatusType | "unknown";
    uptime: string;
    responseTime: number | -1;
    lastChecked: string | "never";
    createdAt: Date
};

export async function getServices(): Promise<ServiceStatus[]> {
    try {
        const services = await SiteService.getAll();
        return services.map(service => {
            const uptime = getUptime(service.totalChecks, service.onlineChecks);
            return {
                name: service.name,
                url: service.url,
                status: service.lastStatus as StatusType || "unknown",
                uptime: uptime === "isNaN" ? "0.00" : uptime,
                responseTime: service.lastResponseTime || -1,
                lastChecked: service.lastCheckedAt ? service.lastCheckedAt.toLocaleString() : "never",
                createdAt: service.createdAt
            };
        });
    } catch (error) {
        console.error("Error fetching services:", error);
        return [];
    }
}
