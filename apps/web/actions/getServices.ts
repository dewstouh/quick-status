"use server";

import { SiteService, StatusType } from "@quick-status/services";


export type ServiceStatus = {
    name: string;
    url: string;
    status: StatusType;
    uptime: string;
    responseTime: number;
    lastChecked: string;
};

export async function getServices(): Promise<ServiceStatus[]> {
    try {
        const services = await SiteService.getAll();
        return services.map(service => ({
            name: service.name,
            url: service.url,
            status: service.lastStatus as StatusType,
            uptime: ((service.onlineChecks / service.totalChecks) * 100).toFixed(2),
            responseTime: service.lastResponseTime,
            lastChecked: service.lastCheckedAt.toISOString()
        }));
    } catch (error) {
        console.error("Error fetching services:", error);
        return [];
    }
}
