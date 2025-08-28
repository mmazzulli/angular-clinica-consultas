-- CreateTable
CREATE TABLE `User` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `surname` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('superadmin', 'empresa', 'medico', 'cliente') NOT NULL DEFAULT 'cliente',
    `celular` VARCHAR(191) NULL,
    `whatsapp` VARCHAR(191) NULL,
    `nif` VARCHAR(191) NULL,
    `idade` INTEGER NULL,
    `genero` VARCHAR(191) NULL,
    `crm` VARCHAR(191) NULL,
    `empresaId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Specialty` (
    `specialtyId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`specialtyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `appointmentId` INTEGER NOT NULL AUTO_INCREMENT,
    `startsAt` DATETIME(3) NOT NULL,
    `endsAt` DATETIME(3) NULL,
    `status` ENUM('scheduled', 'cancelled', 'completed', 'no_show', 'rescheduled') NOT NULL DEFAULT 'scheduled',
    `notes` VARCHAR(191) NULL,
    `clientId` INTEGER NOT NULL,
    `medicoId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Appointment_medicoId_startsAt_idx`(`medicoId`, `startsAt`),
    INDEX `Appointment_clientId_startsAt_idx`(`clientId`, `startsAt`),
    UNIQUE INDEX `Appointment_medicoId_startsAt_key`(`medicoId`, `startsAt`),
    PRIMARY KEY (`appointmentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MedicoSpecialties` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MedicoSpecialties_AB_unique`(`A`, `B`),
    INDEX `_MedicoSpecialties_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `User`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_medicoId_fkey` FOREIGN KEY (`medicoId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MedicoSpecialties` ADD CONSTRAINT `_MedicoSpecialties_A_fkey` FOREIGN KEY (`A`) REFERENCES `Specialty`(`specialtyId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MedicoSpecialties` ADD CONSTRAINT `_MedicoSpecialties_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
