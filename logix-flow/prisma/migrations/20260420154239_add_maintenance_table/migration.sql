-- CreateTable
CREATE TABLE `maintenances` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicle_id` INTEGER NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `service_date` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cost` DECIMAL(10, 2) NOT NULL,
    `workshop` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `maintenances_vehicle_id_idx`(`vehicle_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `maintenances` ADD CONSTRAINT `maintenances_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
