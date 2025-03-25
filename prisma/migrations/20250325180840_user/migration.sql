-- AlterTable
ALTER TABLE `comment` ADD COLUMN `rating` INTEGER NULL,
    MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `recipe` MODIFY `ingredients` TEXT NOT NULL,
    MODIFY `instructions` TEXT NOT NULL;

-- CreateTable
CREATE TABLE `SharedRecipe` (
    `id` VARCHAR(191) NOT NULL,
    `shareToken` VARCHAR(191) NOT NULL,
    `recipeId` VARCHAR(191) NOT NULL,
    `sharedById` VARCHAR(191) NOT NULL,
    `shareMethod` VARCHAR(191) NOT NULL DEFAULT 'link',
    `recipientEmail` VARCHAR(191) NULL,
    `viewCount` INTEGER NOT NULL DEFAULT 0,
    `expiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SharedRecipe_shareToken_key`(`shareToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SharedRecipe` ADD CONSTRAINT `SharedRecipe_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SharedRecipe` ADD CONSTRAINT `SharedRecipe_sharedById_fkey` FOREIGN KEY (`sharedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
