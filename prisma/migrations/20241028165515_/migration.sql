/*
  Warnings:

  - You are about to drop the column `recipientRole` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `senderRole` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "recipientRole",
DROP COLUMN "senderRole";
