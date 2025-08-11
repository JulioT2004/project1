/*
  Warnings:

  - You are about to drop the column `createdAt` on the `codigoverificacion` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `codigoverificacion` table. All the data in the column will be lost.
  - Added the required column `expira` to the `CodigoVerificacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `codigoverificacion` DROP COLUMN `createdAt`,
    DROP COLUMN `expiresAt`,
    ADD COLUMN `creado` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `expira` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `creado` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expira` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RefreshToken_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
