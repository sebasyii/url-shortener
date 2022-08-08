-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Click" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    CONSTRAINT "Click_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Click" ("createdAt", "id", "ip", "trackId", "updatedAt", "userAgent") SELECT "createdAt", "id", "ip", "trackId", "updatedAt", "userAgent" FROM "Click";
DROP TABLE "Click";
ALTER TABLE "new_Click" RENAME TO "Click";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
