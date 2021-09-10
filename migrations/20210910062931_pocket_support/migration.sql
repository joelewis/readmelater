-- CreateTable
CREATE TABLE "PocketToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT,
    "userId" INTEGER NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
    "paymentStatus" TEXT NOT NULL DEFAULT 'unsubscribed',
    "pocketConnected" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("id", "email", "name", "createdAt", "notify", "twitterUsername", "stripeCustomerId", "paymentStatus") SELECT "id", "email", "name", "createdAt", "notify", "twitterUsername", "stripeCustomerId", "paymentStatus" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");
CREATE UNIQUE INDEX "User.twitterUsername_unique" ON "User"("twitterUsername");
CREATE UNIQUE INDEX "User.stripeCustomerId_unique" ON "User"("stripeCustomerId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "PocketToken.token_unique" ON "PocketToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PocketToken_userId_unique" ON "PocketToken"("userId");
