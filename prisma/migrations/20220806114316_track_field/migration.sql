/*
  Warnings:

  - Added the required column `trackId` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Track" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "trackId" TEXT NOT NULL
);
INSERT INTO "new_Track" ("createdAt", "id", "updatedAt", "url") SELECT "createdAt", "id", "updatedAt", "url" FROM "Track";
DROP TABLE "Track";
ALTER TABLE "new_Track" RENAME TO "Track";
CREATE UNIQUE INDEX "Track_trackId_key" ON "Track"("trackId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
