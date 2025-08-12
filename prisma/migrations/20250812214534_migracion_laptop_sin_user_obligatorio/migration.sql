-- DropForeignKey
ALTER TABLE `laptops` DROP FOREIGN KEY `laptops_userId_fkey`;

-- AlterTable
ALTER TABLE `laptops` MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `laptops` ADD CONSTRAINT `laptops_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
