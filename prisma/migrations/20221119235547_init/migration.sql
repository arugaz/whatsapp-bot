-- CreateTable
CREATE TABLE "Session" (
    "sessionId" TEXT NOT NULL,
    "session" TEXT
);

-- CreateTable
CREATE TABLE "User" (
    "number" TEXT NOT NULL,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "Group" (
    "groupId" TEXT NOT NULL,
    "name" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionId_key" ON "Session"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "User_number_key" ON "User"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Group_groupId_key" ON "Group"("groupId");
