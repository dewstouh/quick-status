import { describe, it, expect } from 'vitest';
import { SiteService } from '../../site';
import { OutageType } from "@quick-status/db";
import prisma from '@quick-status/db';

// Cast to any for simple mocking
const mockPrisma = prisma as any;

describe('SiteService', () => {
  describe('create', () => {
    it('should create a new site successfully', async () => {
      const mockSite = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test Site',
        url: 'https://test.com',
        onlineChecks: 0,
        totalChecks: 0,
        lastResponseTime: 0,
        lastStatus: 'unknown',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockPrisma.site.create.mockResolvedValue(mockSite);

      const site = await SiteService.create('Test Site', 'https://test.com');
      
      expect(mockPrisma.site.create).toHaveBeenCalledWith({
        data: {
          name: 'Test Site',
          url: 'https://test.com'
        }
      });
      expect(site).toEqual(mockSite);
    });

    it('should throw error for duplicate name', async () => {
      mockPrisma.site.create.mockRejectedValue(new Error('Unique constraint failed on the fields: (`name`)'));

      await expect(SiteService.create('Duplicate Site', 'https://test2.com'))
        .rejects.toThrow('Unique constraint failed on the fields: (`name`)');
    });

    it('should throw error for duplicate URL', async () => {
      mockPrisma.site.create.mockRejectedValue(new Error('Unique constraint failed on the fields: (`url`)'));

      await expect(SiteService.create('Site 2', 'https://duplicate.com'))
        .rejects.toThrow('Unique constraint failed on the fields: (`url`)');
    });
  });

  describe('getById', () => {
    it('should return site with outages when found', async () => {
      const mockSite = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test Site',
        url: 'https://test.com',
        outages: [{ id: '550e8400-e29b-41d4-a716-446655440001', siteId: '550e8400-e29b-41d4-a716-446655440000', type: OutageType.down }]
      };
      
      mockPrisma.site.findUnique.mockResolvedValue(mockSite);

      const site = await SiteService.getById('550e8400-e29b-41d4-a716-446655440000');
      
      expect(mockPrisma.site.findUnique).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        include: { outages: true }
      });
      expect(site).toEqual(mockSite);
    });

    it('should return null when site not found', async () => {
      mockPrisma.site.findUnique.mockResolvedValue(null);

      const site = await SiteService.getById('550e8400-e29b-41d4-a716-446655440999');
      expect(site).toBeNull();
    });
  });

  describe('getByName', () => {
    it('should return site when found', async () => {
      const mockSite = { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Test Site', url: 'https://test.com' };
      mockPrisma.site.findUnique.mockResolvedValue(mockSite);

      const site = await SiteService.getByName('Test Site');
      
      expect(mockPrisma.site.findUnique).toHaveBeenCalledWith({
        where: { name: 'Test Site' },
        include: { outages: true }
      });
      expect(site).toEqual(mockSite);
    });

    it('should return null when site not found', async () => {
      mockPrisma.site.findUnique.mockResolvedValue(null);

      const site = await SiteService.getByName('Non-existent Site');
      expect(site).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should return empty array when no sites', async () => {
      mockPrisma.site.findMany.mockResolvedValue([]);

      const sites = await SiteService.getAll();
      
      expect(mockPrisma.site.findMany).toHaveBeenCalledWith({
        include: { outages: true }
      });
      expect(sites).toEqual([]);
    });

    it('should return all sites with outages', async () => {
      const mockSites = [
        { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Site 1', outages: [{ type: OutageType.down }] },
        { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Site 2', outages: [] }
      ];
      
      mockPrisma.site.findMany.mockResolvedValue(mockSites);

      const sites = await SiteService.getAll();
      
      expect(sites).toEqual(mockSites);
    });
  });

  describe('addOutage', () => {
    it('should create outage for existing site', async () => {
      const mockOutage = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        siteId: '550e8400-e29b-41d4-a716-446655440000',
        type: OutageType.degraded,
        startTime: new Date(),
        endTime: null
      };
      
      mockPrisma.outage.create.mockResolvedValue(mockOutage);

      const outage = await SiteService.addOutage('550e8400-e29b-41d4-a716-446655440000', OutageType.degraded);
      
      expect(mockPrisma.outage.create).toHaveBeenCalledWith({
        data: {
          siteId: '550e8400-e29b-41d4-a716-446655440000',
          type: OutageType.degraded
        }
      });
      expect(outage).toEqual(mockOutage);
    });

    it('should throw error for non-existent site', async () => {
      mockPrisma.outage.create.mockRejectedValue(new Error('Foreign key constraint failed'));

      await expect(SiteService.addOutage('550e8400-e29b-41d4-a716-446655440999', OutageType.down))
        .rejects.toThrow('Foreign key constraint failed');
    });
  });

  describe('update', () => {
    it('should update site successfully', async () => {
      const mockUpdatedSite = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Updated Name',
        url: 'https://original.com',
        onlineChecks: 10,
        totalChecks: 12,
        updatedAt: new Date()
      };
      
      mockPrisma.site.update.mockResolvedValue(mockUpdatedSite);

      const updatedSite = await SiteService.update('550e8400-e29b-41d4-a716-446655440000', {
        name: 'Updated Name',
        onlineChecks: 10,
        totalChecks: 12
      });
      
      expect(mockPrisma.site.update).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        data: {
          name: 'Updated Name',
          onlineChecks: 10,
          totalChecks: 12
        }
      });
      expect(updatedSite).toEqual(mockUpdatedSite);
    });

    it('should throw error when updating non-existent site', async () => {
      mockPrisma.site.update.mockRejectedValue(new Error('Record to update not found'));

      await expect(SiteService.update('550e8400-e29b-41d4-a716-446655440999', { name: 'New Name' }))
        .rejects.toThrow('Record to update not found');
    });
  });

  describe('delete', () => {
    it('should delete site successfully', async () => {
      const mockDeletedSite = { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Test Site' };
      mockPrisma.site.delete.mockResolvedValue(mockDeletedSite);

      const deletedSite = await SiteService.delete('550e8400-e29b-41d4-a716-446655440000');
      
      expect(mockPrisma.site.delete).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }
      });
      expect(deletedSite).toEqual(mockDeletedSite);
    });

    it('should throw error when deleting non-existent site', async () => {
      mockPrisma.site.delete.mockRejectedValue(new Error('Record to delete does not exist'));

      await expect(SiteService.delete('550e8400-e29b-41d4-a716-446655440999'))
        .rejects.toThrow('Record to delete does not exist');
    });
  });
});
