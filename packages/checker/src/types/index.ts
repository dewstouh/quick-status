import { StatusType } from "@quick-status/db";

export type CheckResult = {
    responseTime: number; // ms
    status: StatusType;
    lastChecked: Date;
};

