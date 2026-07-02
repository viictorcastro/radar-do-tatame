-- CreateTable
CREATE TABLE "Federation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Championship" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "federationId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "venue" TEXT,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "sourceUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Championship_federationId_fkey" FOREIGN KEY ("federationId") REFERENCES "Federation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Federation_name_key" ON "Federation"("name");

-- CreateIndex
CREATE INDEX "Championship_state_city_idx" ON "Championship"("state", "city");

-- CreateIndex
CREATE INDEX "Championship_date_idx" ON "Championship"("date");
