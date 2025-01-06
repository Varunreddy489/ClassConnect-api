-- AlterTable
ALTER TABLE "_AcceptedConnections" ADD CONSTRAINT "_AcceptedConnections_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AcceptedConnections_AB_unique";

-- AlterTable
ALTER TABLE "_ClubMembership" ADD CONSTRAINT "_ClubMembership_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ClubMembership_AB_unique";

-- CreateTable
CREATE TABLE "Events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pic" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "organizer" TEXT,
    "creatorId" INTEGER NOT NULL,
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
