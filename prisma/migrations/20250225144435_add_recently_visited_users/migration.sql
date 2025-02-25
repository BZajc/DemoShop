-- CreateTable
CREATE TABLE "RecentlyVisitedUsers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "visitorId" TEXT NOT NULL,
    "visitedId" TEXT NOT NULL,
    "visitedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RecentlyVisitedUsers_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RecentlyVisitedUsers_visitedId_fkey" FOREIGN KEY ("visitedId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "RecentlyVisitedUsers_visitorId_visitedAt_idx" ON "RecentlyVisitedUsers"("visitorId", "visitedAt");

-- CreateIndex
CREATE INDEX "RecentlyVisitedUsers_visitedId_visitedAt_idx" ON "RecentlyVisitedUsers"("visitedId", "visitedAt");
