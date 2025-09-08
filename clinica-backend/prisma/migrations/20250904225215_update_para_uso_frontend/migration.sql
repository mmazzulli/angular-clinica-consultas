-- DropForeignKey
ALTER TABLE `appointment` DROP FOREIGN KEY `Appointment_medicoId_fkey`;

-- DropIndex
DROP INDEX `Appointment_medicoId_startsAt_idx` ON `appointment`;

-- AlterTable
ALTER TABLE `appointment` MODIFY `status` ENUM('pending', 'scheduled', 'cancelled', 'completed', 'no_show', 'rescheduled') NOT NULL DEFAULT 'pending',
    MODIFY `medicoId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `Appointment_medicoId_idx` ON `Appointment`(`medicoId`);

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_medicoId_fkey` FOREIGN KEY (`medicoId`) REFERENCES `User`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;
