import { ServiceStatus } from "../lib/data/getServices";

export function getUptime(totalChecks:number, onlineChecks: number){
    return ((onlineChecks / totalChecks) * 100).toFixed(2)
}

export type BannerType = 'issue' | 'maintenance' | 'operational';

export type BannerState = {
    type: BannerType;
    title: string;
    message: string;
}

export function getBannerState(services: ServiceStatus[]):BannerState{
    if (services.some(s => s.status === 'down')) {
        return {
            type: 'issue',
            title: 'Experiencing issues',
            message: "We're experiencing issues with some of our systems."
        }
    }
    if (services.some(s => s.status === 'degraded')) {
        return {
            type: 'maintenance',
            title: 'Partial outage',
            message: 'Some systems are currently degraded or partially unavailable.'
        }
    }
    return {
        type: 'operational',
        title: 'All systems operational',
        message: "All systems are running smoothly."
      }
}