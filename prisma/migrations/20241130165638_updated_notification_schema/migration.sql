-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "connectionId" INTEGER;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "Connections"("id") ON DELETE SET NULL ON UPDATE CASCADE;
