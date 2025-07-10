import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OutageService } from '../../outage';
import { OutageType } from "@quick-status/db";
import prisma from '@quick-status/db';

// Cast to any for simple mocking
const mockPrisma = prisma as any;

describe('OutageService', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create outage successfully', async () => {
      const mockOutage = {
        id: 1,
        siteId: 1,
        type: OutageType.down,
        endTime: null,
        startTime: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockPrisma.outage.create.mockResolvedValue(mockOutage);

      const outage = await OutageService.create(1, OutageType.down);

      expect(mockPrisma.outage.create).toHaveBeenCalledWith({
        data: {
          siteId: 1,
          type: OutageType.down
        }
      });
      expect(outage).toEqual(mockOutage);
    });

    it('should fail when creating outage for nonexistent site', async () => {
      mockPrisma.outage.create.mockRejectedValue(new Error('Foreign key constraint failed'));

      await expect(OutageService.create(999, OutageType.down))
        .rejects.toThrow('Foreign key constraint failed');
    });
  });

  describe('get', () => {
    it('should return outage when found', async () => {
      const mockOutage = {
        id: 1,
        siteId: 1,
        type: OutageType.down,
        endTime: null,
        startTime: new Date()
      };
      
      mockPrisma.outage.findUnique.mockResolvedValue(mockOutage);

      const outage = await OutageService.get(1);

      expect(mockPrisma.outage.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(outage).toEqual(mockOutage);
    });

    it('should return null when outage not found', async () => {
      mockPrisma.outage.findUnique.mockResolvedValue(null);

      const outage = await OutageService.get(999);
      
      expect(outage).toBeNull();
    });
  });

  describe('end', () => {
    it('should end outage successfully', async () => {
      const mockEndedOutage = {
        id: 1,
        siteId: 1,
        type: OutageType.down,
        endTime: new Date(),
        startTime: new Date()
      };
      
      mockPrisma.outage.update.mockResolvedValue(mockEndedOutage);

      const endedOutage = await OutageService.end(1);

      expect(mockPrisma.outage.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { endTime: expect.any(Date) }
      });
      expect(endedOutage.endTime).not.toBeNull();
    });

    it('should fail when ending nonexistent outage', async () => {
      mockPrisma.outage.update.mockRejectedValue(new Error('Record to update not found'));

      await expect(OutageService.end(999))
        .rejects.toThrow('Record to update not found');
    });
  });

  describe('getSiteOutages', () => {
    it('should return all outages for a site', async () => {
      const mockOutages = [
        { id: 1, siteId: 1, type: OutageType.down, startTime: new Date() },
        { id: 2, siteId: 1, type: OutageType.degraded, startTime: new Date() }
      ];
      
      mockPrisma.outage.findMany.mockResolvedValue(mockOutages);

      const outages = await OutageService.getSiteOutages(1);

      expect(mockPrisma.outage.findMany).toHaveBeenCalledWith({
        where: { siteId: 1 },
        orderBy: { startTime: 'desc' }
      });
      expect(outages).toEqual(mockOutages);
    });

    it('should return empty array when no outages', async () => {
      mockPrisma.outage.findMany.mockResolvedValue([]);

      const outages = await OutageService.getSiteOutages(1);
      
      expect(outages).toEqual([]);
    });
  });

  describe('getActiveBySite', () => {
    it('should return active outage when exists', async () => {
      const mockActiveOutage = {
        id: 1,
        siteId: 1,
        type: OutageType.down,
        endTime: null,
        startTime: new Date()
      };
      
      mockPrisma.outage.findFirst.mockResolvedValue(mockActiveOutage);

      const activeOutage = await OutageService.getActiveBySite(1);

      expect(mockPrisma.outage.findFirst).toHaveBeenCalledWith({
        where: {
          siteId: 1,
          endTime: null
        },
        orderBy: { startTime: 'desc' }
      });
      expect(activeOutage).toEqual(mockActiveOutage);
    });

    it('should return null when no active outage', async () => {
      mockPrisma.outage.findFirst.mockResolvedValue(null);

      const activeOutage = await OutageService.getActiveBySite(1);
      
      expect(activeOutage).toBeNull();
    });
  });

  describe('getHistory', () => {
    it('should return outages since specified date', async () => {
      const since = new Date('2024-01-01');
      const mockHistory = [
        { id: 1, siteId: 1, type: OutageType.down, startTime: new Date('2024-01-02') }
      ];
      
      mockPrisma.outage.findMany.mockResolvedValue(mockHistory);

      const history = await OutageService.getHistory(1, since);

      expect(mockPrisma.outage.findMany).toHaveBeenCalledWith({
        where: {
          siteId: 1,
          startTime: { gte: since }
        },
        orderBy: { startTime: 'desc' }
      });
      expect(history).toEqual(mockHistory);
    });
  });
});
