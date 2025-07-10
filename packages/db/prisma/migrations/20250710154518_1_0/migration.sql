/*
  Warnings:

  - The primary key for the `Outage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Site` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Outage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteId" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Outage_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Outage" ("createdAt", "endTime", "id", "siteId", "startTime", "type", "updatedAt") SELECT "createdAt", "endTime", "id", "siteId", "startTime", "type", "updatedAt" FROM "Outage";
DROP TABLE "Outage";
ALTER TABLE "new_Outage" RENAME TO "Outage";
CREATE TABLE "new_Site" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "onlineChecks" INTEGER NOT NULL DEFAULT 0,
    "totalChecks" INTEGER NOT NULL DEFAULT 0,
    "lastResponseTime" INTEGER DEFAULT 0,
    "lastStatus" TEXT DEFAULT 'unknown',
    "lastCheckedAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Site" ("createdAt", "id", "lastCheckedAt", "lastResponseTime", "lastStatus", "name", "onlineChecks", "totalChecks", "updatedAt", "url") SELECT "createdAt", "id", "lastCheckedAt", "lastResponseTime", "lastStatus", "name", "onlineChecks", "totalChecks", "updatedAt", "url" FROM "Site";
DROP TABLE "Site";
ALTER TABLE "new_Site" RENAME TO "Site";
CREATE UNIQUE INDEX "Site_name_key" ON "Site"("name");
CREATE UNIQUE INDEX "Site_url_key" ON "Site"("url");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
