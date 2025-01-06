/*
  Warnings:

  - You are about to drop the column `pic` on the `Events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Events" DROP COLUMN "pic",
ADD COLUMN     "profilePic" TEXT;
