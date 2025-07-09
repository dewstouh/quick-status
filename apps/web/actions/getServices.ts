"use server";

import { SiteService, StatusType } from "@quick-status/services";


export type ServiceStatus = {
    name: string;
    url: string;
    status: StatusType | "unknown";
    uptime: string;
    responseTime: number | -1;
    lastChecked: string | "never";
};

export async function getServices(): Promise<ServiceStatus[]> {
    try {
        const services = await SiteService.getAll();
        return services.map(service => ({
            name: service.name,
            url: service.url,
            status: service.lastStatus as StatusType || "unknown",
            uptime: ((service.onlineChecks / service.totalChecks) * 100).toFixed(2),
            responseTime: service.lastResponseTime || -1,
            lastChecked: service.lastCheckedAt ? service.lastCheckedAt.toISOString() : "never"
        }));
    } catch (error) {
        console.error("Error fetching services:", error);
        return [];
    }
}
