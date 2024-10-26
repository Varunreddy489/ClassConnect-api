/*
  Warnings:

  - The primary key for the `Club` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Conversations" DROP CONSTRAINT "Conversations_clubId_fkey";

-- DropForeignKey
ALTER TABLE "JoinRequest" DROP CONSTRAINT "JoinRequest_clubId_fkey";

-- DropForeignKey
ALTER TABLE "_ClubMembership" DROP CONSTRAINT "_ClubMembership_A_fkey";

-- AlterTable
ALTER TABLE "Club" DROP CONSTRAINT "Club_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Club_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Club_id_seq";

-- AlterTable
ALTER TABLE "Conversations" ALTER COLUMN "clubId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "JoinRequest" ALTER COLUMN "clubId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_ClubMembership" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Conversations" ADD CONSTRAINT "Conversations_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubMembership" ADD CONSTRAINT "_ClubMembership_A_fkey" FOREIGN KEY ("A") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
