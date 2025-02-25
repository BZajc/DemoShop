-- CreateTable
CREATE TABLE "SuggestedTags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "count" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "SuggestedTags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SuggestedTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SuggestedTags_userId_tagId_key" ON "SuggestedTags"("userId", "tagId");
