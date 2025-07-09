import { CronJob } from 'cron';
import { OutageService, SiteService, OutageType } from '@quick-status/services';
import { check } from './lib/check';
import { Status } from './types';

// Cron job every 30 seconds
export const job = new CronJob('*/30 * * * * *', async () => {
    const sites = await SiteService.getAll();

    for (const site of sites) {
        try {
            const response = await check(site.url);
            let updateData = {
                lastStatus: Status[response.status],
                lastResponseTime: response.responseTime,
                lastCheckedAt: new Date(),
                onlineChecks: site.onlineChecks,
                totalChecks: site.totalChecks + 1
            }

            if(response.status === Status.down || response.status === Status.degraded) await OutageService.create(site.id, OutageType[response.status]);

            if(response.status === Status.operational) {
                const activeOutage = await OutageService.getActiveBySite(site.id);
                if (activeOutage) {
                    // If there is an active outage, end it
                    await OutageService.end(activeOutage.id);
                }
                updateData.onlineChecks = site.onlineChecks + 1;
            }

            await SiteService.update(site.id, updateData);


        } catch (error) {
            console.error(`Error checking site ${site.name} (${site.url}):`, error);
        }
    }
});