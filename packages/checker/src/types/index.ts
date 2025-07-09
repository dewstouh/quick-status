import { StatusType } from '@prisma/client';

export type CheckResult = {
    responseTime: number; // ms
    status: StatusType;
    lastChecked: Date;
};

