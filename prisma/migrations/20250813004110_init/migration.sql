-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Book` (
    `isbn` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `publisher` VARCHAR(191) NOT NULL,
    `isRented` BOOLEAN NOT NULL DEFAULT false,
    `rentedBy` VARCHAR(191) NULL,

    PRIMARY KEY (`isbn`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RentalHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `isbn` VARCHAR(191) NOT NULL,
    `rentalDate` VARCHAR(191) NOT NULL,
    `returnDate` VARCHAR(191) NULL,
    `renterName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryCheckHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `isbn` VARCHAR(191) NOT NULL,
    `checkDate` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RentalHistory` ADD CONSTRAINT `RentalHistory_isbn_fkey` FOREIGN KEY (`isbn`) REFERENCES `Book`(`isbn`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryCheckHistory` ADD CONSTRAINT `InventoryCheckHistory_isbn_fkey` FOREIGN KEY (`isbn`) REFERENCES `Book`(`isbn`) ON DELETE RESTRICT ON UPDATE CASCADE;
