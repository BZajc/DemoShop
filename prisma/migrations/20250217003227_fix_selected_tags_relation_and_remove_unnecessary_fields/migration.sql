/*
  Warnings:

  - You are about to drop the `CustomSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `backgroundPhoto` on the `User` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CustomSection";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT NOT NULL,
    "hashtag" TEXT,
    "avatarPhoto" TEXT,
    "aboutMe" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastActive" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("aboutMe", "avatarPhoto", "createdAt", "email", "hashtag", "id", "lastActive", "name", "password", "updatedAt") SELECT "aboutMe", "avatarPhoto", "createdAt", "email", "hashtag", "id", "lastActive", "name", "password", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
CREATE UNIQUE INDEX "User_name_hashtag_key" ON "User"("name", "hashtag");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
