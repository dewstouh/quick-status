import { CronJob } from 'cron';
import { OutageService, SiteService, OutageType, StatusType } from '@quick-status/services';
import { check } from './lib/check';

// Cron job every 30 seconds
export const job = new CronJob('*/30 * * * * *', async () => {
    const sites = await SiteService.getAll();

    for (const site of sites) {
        try {
            const response = await check(site.url);
            let updateData = {
                lastStatus: StatusType[response.status],
                lastResponseTime: response.responseTime,
                lastCheckedAt: new Date(),
                onlineChecks: site.onlineChecks,
                totalChecks: site.totalChecks + 1
            }

            const isOnCurrentOutage = await OutageService.getActiveBySite(site.id);

            if ((response.status === StatusType.down || response.status === StatusType.degraded) && !isOnCurrentOutage) await OutageService.create(site.id, OutageType[response.status]);

            if (response.status === StatusType.operational) {
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