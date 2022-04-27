/*
  Warnings:

  - Added the required column `description` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openingBalance` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_accounts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "openingBalance" INTEGER NOT NULL,
    "description" TEXT NOT NULL
);
INSERT INTO "new_accounts" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "accounts";
DROP TABLE "accounts";
ALTER TABLE "new_accounts" RENAME TO "accounts";
CREATE UNIQUE INDEX "accounts_name_key" ON "accounts"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
