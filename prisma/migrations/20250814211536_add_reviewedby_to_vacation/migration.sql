-- AlterTable
ALTER TABLE `vacations` ADD COLUMN `reviewedBy` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `vacations` ADD CONSTRAINT `vacations_reviewedBy_fkey` FOREIGN KEY (`reviewedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
