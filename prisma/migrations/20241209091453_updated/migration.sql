/*
  Warnings:

  - You are about to drop the column `organizer` on the `Events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Events" DROP COLUMN "organizer",
ALTER COLUMN "pic" DROP NOT NULL;
