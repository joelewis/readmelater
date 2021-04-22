-- CreateTable
CREATE TABLE "Link" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "href" TEXT NOT NULL,
    "readingTime" TEXT,
    "userId" INTEGER NOT NULL,
    "timeout" DATETIME NOT NULL,
    "notify" BOOLEAN NOT NULL DEFAULT true,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tag" TEXT NOT NULL,
    "notify" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notify" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mailId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_LinkToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Link" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Link.userId_href_unique" ON "Link"("userId", "href");

-- CreateIndex
CREATE UNIQUE INDEX "Tag.userId_tag_unique" ON "Tag"("userId", "tag");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_LinkToTag_AB_unique" ON "_LinkToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_LinkToTag_B_index" ON "_LinkToTag"("B");
