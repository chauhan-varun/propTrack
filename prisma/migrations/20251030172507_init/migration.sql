-- CreateTable
CREATE TABLE "Room" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "tenantName" TEXT,
    "rent" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Bill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "month" TEXT NOT NULL,
    "prevUnits" INTEGER NOT NULL,
    "currUnits" INTEGER NOT NULL,
    "unitsUsed" INTEGER NOT NULL,
    "ratePerUnit" REAL NOT NULL,
    "rentAmount" REAL NOT NULL,
    "electricityAmt" REAL NOT NULL,
    "total" REAL NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "roomId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Bill_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_number_key" ON "Room"("number");

-- CreateIndex
CREATE INDEX "Bill_month_idx" ON "Bill"("month");

-- CreateIndex
CREATE INDEX "Bill_paid_idx" ON "Bill"("paid");

-- CreateIndex
CREATE UNIQUE INDEX "Bill_roomId_month_key" ON "Bill"("roomId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");
