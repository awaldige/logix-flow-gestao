-- CreateTable
CREATE TABLE `drivers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `license_number` VARCHAR(20) NOT NULL,
    `license_category` VARCHAR(5) NOT NULL,
    `status` ENUM('ACTIVE', 'ON_LEAVE', 'IN_TRIP') NOT NULL DEFAULT 'ACTIVE',
    `phone` VARCHAR(20) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `drivers_license_number_key`(`license_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vehicles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plate` VARCHAR(10) NOT NULL,
    `model` VARCHAR(100) NOT NULL,
    `type` ENUM('TRUCK', 'VAN', 'CAR') NOT NULL DEFAULT 'TRUCK',
    `status` ENUM('AVAILABLE', 'IN_TRANSIT', 'MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE',
    `current_km` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `vehicles_plate_key`(`plate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trips` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `driver_id` INTEGER NULL,
    `vehicle_id` INTEGER NULL,
    `origin_address` VARCHAR(255) NULL,
    `destination_address` VARCHAR(255) NULL,
    `origin_lat` DECIMAL(10, 8) NULL,
    `origin_lng` DECIMAL(11, 8) NULL,
    `dest_lat` DECIMAL(10, 8) NULL,
    `dest_lng` DECIMAL(11, 8) NULL,
    `status` ENUM('PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PLANNED',
    `start_at` DATETIME(0) NULL,
    `end_at` DATETIME(0) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `trips_driver_id_idx`(`driver_id`),
    INDEX `trips_vehicle_id_idx`(`vehicle_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fuel_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trip_id` INTEGER NULL,
    `liters` DECIMAL(10, 2) NOT NULL,
    `cost_per_liter` DECIMAL(10, 2) NOT NULL,
    `total_paid` DECIMAL(10, 2) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fuel_logs_trip_id_idx`(`trip_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `trips` ADD CONSTRAINT `trips_driver_id_fkey` FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trips` ADD CONSTRAINT `trips_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fuel_logs` ADD CONSTRAINT `fuel_logs_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
