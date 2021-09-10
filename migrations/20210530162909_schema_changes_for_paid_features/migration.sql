-- AlterTable
ALTER TABLE "Link" ADD COLUMN "title" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notify" BOOLEAN NOT NULL DEFAULT true,
    "twitterUsername" TEXT,
    "stripeCustomerId" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'unsubscribed'
);
INSERT INTO "new_User" ("id", "email", "name", "createdAt", "notify") SELECT "id", "email", "name", "createdAt", "notify" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");
CREATE UNIQUE INDEX "User.twitterUsername_unique" ON "User"("twitterUsername");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
