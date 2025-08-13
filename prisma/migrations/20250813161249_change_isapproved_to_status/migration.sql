/*
  Warnings:

  - You are about to drop the column `isApproved` on the `vacations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `vacations` DROP COLUMN `isApproved`,
    ADD COLUMN `status` ENUM('PENDING', 'APPROVED', 'DENIED') NOT NULL DEFAULT 'PENDING';
