# Migration `20200723085912-v2`

This migration has been generated by Joe B. Lewis at 7/23/2020, 8:59:13 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Link" (
"createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
"href" TEXT NOT NULL,
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"notify" BOOLEAN NOT NULL DEFAULT true,
"readingTime" TEXT NOT NULL,
"timeout" TEXT ,
"userId" INTEGER NOT NULL,FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE)

INSERT INTO "new_Link" ("createdAt", "href", "id", "readingTime", "userId") SELECT "createdAt", "href", "id", "readingTime", "userId" FROM "Link"

PRAGMA foreign_keys=off;
DROP TABLE "Link";;
PRAGMA foreign_keys=on

ALTER TABLE "new_Link" RENAME TO "Link";

CREATE TABLE "new_Tag" (
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"linkId" INTEGER ,
"notify" BOOLEAN NOT NULL DEFAULT true,
"tag" TEXT NOT NULL,
"userId" INTEGER NOT NULL,FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE SET NULL ON UPDATE CASCADE)

INSERT INTO "new_Tag" ("id", "tag") SELECT "id", "tag" FROM "Tag"

PRAGMA foreign_keys=off;
DROP TABLE "Tag";;
PRAGMA foreign_keys=on

ALTER TABLE "new_Tag" RENAME TO "Tag";

CREATE TABLE "new_User" (
"createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
"email" TEXT NOT NULL,
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"name" TEXT ,
"notify" BOOLEAN NOT NULL DEFAULT true)

INSERT INTO "new_User" ("createdAt", "email", "id", "name") SELECT "createdAt", "email", "id", "name" FROM "User"

PRAGMA foreign_keys=off;
DROP TABLE "User";;
PRAGMA foreign_keys=on

ALTER TABLE "new_User" RENAME TO "User";

CREATE UNIQUE INDEX "User.email" ON "User"("email")

PRAGMA foreign_keys=off;
DROP TABLE "GoogleUser";;
PRAGMA foreign_keys=on

PRAGMA foreign_key_check;

PRAGMA foreign_keys=ON;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200718144906-init..20200723085912-v2
--- datamodel.dml
+++ datamodel.dml
@@ -2,10 +2,10 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource sqlite {
   provider = "sqlite"
-  url = "***"
-  // url = "***"
+  url = "***"
+  // url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -17,28 +17,25 @@
   createdAt DateTime @default(now())
   href      String
   readingTime String
   user      User     @relation(fields: [userId], references: [id])
-  userId  Int
+  userId    Int
+  tags      Tag[]
+  timeout   String?
+  notify    Boolean  @default(true)
 }
 model Tag {
   id        Int      @default(autoincrement()) @id
-  tag String
-  links Link[]
+  tag       String
+  user      User     @relation(fields: [userId], references: [id])
+  notify    Boolean  @default(true)
+  userId    Int
 }
 model User {
   id      Int      @default(autoincrement()) @id
   email   String   @unique
   name    String?
   createdAt DateTime @default(now())
-}
-
-model GoogleUser {
-  id      Int      @default(autoincrement()) @id
-  user    User @relation(fields: [userId], references: [id])
-  userId  Int
-  access_token  String?
-  refresh_token  String?
-  guserId  String
+  notify  Boolean  @default(true)
 }
```

