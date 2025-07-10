import { describe, it, expect } from 'vitest';
import { SiteService } from '../../site';
import { OutageService } from '../../outage';
import { OutageType } from "@quick-status/db";
import prisma from '@quick-status/db';

// Cast to any for simple mocking
const mockPrisma = prisma as any;

describe('Services Integration', () => {
  describe('Site and Outage workflow', () => {
    it('should create site, add outage, and retrieve complete data', async () => {
      const mockSite = { id: 1, name: 'Test Site', url: 'https://test.example.com' };
      const mockOutage = { id: 1, siteId: 1, type: OutageType.down };
      const mockSiteWithOutages = { ...mockSite, outages: [mockOutage] };
      
      // Mock the sequence of calls
      mockPrisma.site.create.mockResolvedValue(mockSite);
      mockPrisma.outage.create.mockResolvedValue(mockOutage);
      mockPrisma.site.findUnique.mockResolvedValue(mockSiteWithOutages);

      // Execute the workflow
      const site = await SiteService.create('Test Site', 'https://test.example.com');
      await OutageService.create(site.id, OutageType.down);
      const siteWithOutages = await SiteService.getById(site.id);
      
      // Verify the calls were made correctly
      expect(mockPrisma.site.create).toHaveBeenCalledWith({
        data: { name: 'Test Site', url: 'https://test.example.com' }
      });
      expect(mockPrisma.outage.create).toHaveBeenCalledWith({
        data: { siteId: 1, type: OutageType.down }
      });
      expect(mockPrisma.site.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { outages: true }
      });
      
      expect(siteWithOutages?.outages).toHaveLength(1);
    });

    it('should handle multiple outages for a site', async () => {
      const mockSite = { id: 1, name: 'Multi Outage Site' };
      const mockOutage1 = { id: 1, siteId: 1, type: OutageType.down, endTime: null };
      const mockOutage2 = { id: 2, siteId: 1, type: OutageType.degraded, endTime: null };
      const mockEndedOutage1 = { ...mockOutage1, endTime: new Date() };
      const mockOutages = [mockOutage2, mockEndedOutage1];
      
      mockPrisma.site.create.mockResolvedValue(mockSite);
      mockPrisma.outage.create.mockResolvedValueOnce(mockOutage1);
      mockPrisma.outage.create.mockResolvedValueOnce(mockOutage2);
      mockPrisma.outage.update.mockResolvedValue(mockEndedOutage1);
      mockPrisma.outage.findMany.mockResolvedValue(mockOutages);
      mockPrisma.outage.findFirst.mockResolvedValue(mockOutage2);
      mockPrisma.outage.findUnique.mockResolvedValue(mockEndedOutage1);
      
      const site = await SiteService.create('Multi Outage Site', 'https://multioutage.example.com');
      const outage1 = await OutageService.create(site.id, OutageType.down);
      const outage2 = await OutageService.create(site.id, OutageType.degraded);
      await OutageService.end(outage1.id);
      
      const outages = await OutageService.getSiteOutages(site.id);
      const activeOutage = await OutageService.getActiveBySite(site.id);
      const endedOutage = await OutageService.get(outage1.id);
      
      expect(outages).toHaveLength(2);
      expect(activeOutage?.id).toBe(outage2.id);
      expect(endedOutage?.endTime).not.toBeNull();
    });

    it('should handle cascade delete properly', async () => {
      const mockSite = { id: 1, name: 'Site to Delete' };
      const mockDeletedSite = mockSite;
      
      mockPrisma.site.create.mockResolvedValue(mockSite);
      mockPrisma.outage.create.mockResolvedValue({ id: 1, siteId: 1 });
      mockPrisma.site.delete.mockResolvedValue(mockDeletedSite);
      mockPrisma.site.findUnique.mockResolvedValue(null);
      mockPrisma.outage.findUnique.mockResolvedValue(null);
      
      const site = await SiteService.create('Site to Delete', 'https://delete.example.com');
      const outage = await OutageService.create(site.id, OutageType.down);
      await SiteService.delete(site.id);
      
      // Verify cascade delete behavior
      const deletedSite = await SiteService.getById(site.id);
      const deletedOutage = await OutageService.get(outage.id);
      
      expect(deletedSite).toBeNull();
      expect(deletedOutage).toBeNull();
    });
  });

  describe('Cross-service data consistency', () => {
    it('should maintain consistent outage data across services', async () => {
      const mockSite = { id: 1, name: 'Consistency Site' };
      const mockOutage = { id: 1, siteId: 1, type: OutageType.degraded };
      
      mockPrisma.site.create.mockResolvedValue(mockSite);
      mockPrisma.outage.create.mockResolvedValue(mockOutage);
      mockPrisma.outage.findFirst.mockResolvedValue(mockOutage);
      
      const site = await SiteService.create('Consistency Site', 'https://consistency.example.com');
      const outage = await OutageService.create(site.id, OutageType.degraded);
      
      const siteOutage = await SiteService.getActiveOutage(site.id);
      const outageServiceResult = await OutageService.getActiveBySite(site.id);
      
      expect(siteOutage?.id).toBe(outage.id);
      expect(outageServiceResult?.id).toBe(outage.id);
      expect(siteOutage?.type).toBe(OutageType.degraded);
      expect(outageServiceResult?.type).toBe(OutageType.degraded);
    });

    it('should handle outage history correctly across services', async () => {
      const since = new Date();
      const mockSite = { id: 1, name: 'History Site' };
      const mockOutage = { id: 1, siteId: 1, type: OutageType.down };
      const mockHistory = [mockOutage];
      
      mockPrisma.site.create.mockResolvedValue(mockSite);
      mockPrisma.outage.create.mockResolvedValue(mockOutage);
      mockPrisma.outage.findMany.mockResolvedValue(mockHistory);
      
      const site = await SiteService.create('History Site', 'https://history.example.com');
      const outage = await OutageService.create(site.id, OutageType.down);
      
      const siteHistory = await SiteService.getOutageHistory(site.id, since);
      const outageHistory = await OutageService.getHistory(site.id, since);
      
      expect(siteHistory).toEqual(mockHistory);
      expect(outageHistory).toEqual(mockHistory);
      expect(siteHistory[0]?.id).toBe(outage.id);
      expect(outageHistory[0]?.id).toBe(outage.id);
    });
  });
});
