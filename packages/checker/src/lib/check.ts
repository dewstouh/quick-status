import { CheckResult } from "../types";

export async function check(url: string): Promise<CheckResult> {
    const start = Date.now();
    let status: CheckResult["status"] = "down";
    let responseTime = -1;

    try {
        const controller = new AbortController();
        const res = await fetch(url, { method: "HEAD", signal: controller.signal });

        responseTime = Date.now() - start;

        if (res.ok) {
            status = "operational";
        } else if (res.status >= 400 && res.status < 500 || responseTime > 1000) {
            status = "degraded";
        } else if (res.status >= 500) {
            status = "down";
        }
    } catch {
        responseTime = Date.now() - start;
        status = "down";
    }

    return {
        responseTime,
        status,
        lastChecked: new Date(),
    };
}

