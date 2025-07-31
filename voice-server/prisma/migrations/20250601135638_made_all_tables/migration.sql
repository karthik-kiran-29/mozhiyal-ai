/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AgentKey" (
    "keyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "usage" INTEGER NOT NULL,

    CONSTRAINT "AgentKey_pkey" PRIMARY KEY ("keyId")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "ConverstaionId" TEXT NOT NULL,
    "apiKeyId" TEXT NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("ConverstaionId")
);

-- AddForeignKey
ALTER TABLE "AgentKey" ADD CONSTRAINT "AgentKey_keyId_fkey" FOREIGN KEY ("keyId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "AgentKey"("keyId") ON DELETE RESTRICT ON UPDATE CASCADE;
