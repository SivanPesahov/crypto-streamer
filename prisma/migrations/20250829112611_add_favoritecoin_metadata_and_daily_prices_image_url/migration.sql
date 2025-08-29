-- AlterTable
ALTER TABLE `FavoriteCoin` ADD COLUMN `coinImage` VARCHAR(191) NULL,
    ADD COLUMN `coinName` VARCHAR(191) NULL,
    ADD COLUMN `coinSymbol` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `daily_prices` ADD COLUMN `image_url` VARCHAR(512) NULL;
