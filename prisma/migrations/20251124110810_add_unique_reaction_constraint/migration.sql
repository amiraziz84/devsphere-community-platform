/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId,commentId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'POST';

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_postId_commentId_key" ON "Reaction"("userId", "postId", "commentId");
