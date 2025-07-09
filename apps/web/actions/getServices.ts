"use server";

import { OutageType, SiteService, StatusType } from "@quick-status/services";
import { getUptime } from "../lib/utils";

export type Outage = {
    id: number;
    type: OutageType;
    startTime: Date;
    endTime: Date | null; // Nullable if the outage is ongoing
    duration: number | null; // Duration in seconds
};

export type ServiceStatus = {
    name: string;
    url: string;
    status: StatusType | "unknown";
    uptime: string;
    responseTime: number | -1;
    lastChecked: string | "never";
    createdAt: Date
    outages: Outage[];
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
                createdAt: service.createdAt,
                outages: service.outages.map(outage => ({
                    id: outage.id,
                    type: outage.type,
                    startTime: outage.startTime,
                    endTime: outage.endTime,
                    duration: outage.endTime ? (outage.endTime.getTime() - outage.startTime.getTime()) / 1000 : null
                }))
            };
        });
    } catch (error) {
        console.error("Error fetching services:", error);
        return [];
    }
}
