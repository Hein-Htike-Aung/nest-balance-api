/*
  Warnings:

  - Added the required column `amount` to the `balance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `balanceType` to the `balance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `balance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `balance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `balance` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_balance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "balanceType" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "balance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "balance_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "balance_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_balance" ("accountId", "categoryId", "createdAt", "id", "updatedAt", "userId") SELECT "accountId", "categoryId", "createdAt", "id", "updatedAt", "userId" FROM "balance";
DROP TABLE "balance";
ALTER TABLE "new_balance" RENAME TO "balance";
CREATE UNIQUE INDEX "balance_userId_key" ON "balance"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
