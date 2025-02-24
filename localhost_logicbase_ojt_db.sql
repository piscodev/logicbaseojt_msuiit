-- Create database if not exists
CREATE DATABASE IF NOT EXISTS `logicbase_ojt_db`;
USE `logicbase_ojt_db`;

-- Cashier table
CREATE TABLE IF NOT EXISTS `Cashier` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
	`hashed_password` VARCHAR(255) NOT NULL,
	`email` VARCHAR(50) NOT NULL,
	`registeredAt` DATETIME NOT NULL
) ENGINE=InnoDB;

-- Shift table
CREATE TABLE IF NOT EXISTS `Shift` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` ENUM('AM', 'MID', 'PM') NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Particular table (Payment Methods & Expenses)
CREATE TABLE IF NOT EXISTS `Particular` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL UNIQUE,
    `type` ENUM('Trade', 'Non-Trade') NOT NULL,
    `fee_percent` DECIMAL(5,2) DEFAULT 0.00
) ENGINE=InnoDB;

-- Main transaction header
CREATE TABLE IF NOT EXISTS `Transaction` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `cashier_id` INT UNSIGNED NOT NULL,
    `shift_id` INT UNSIGNED NOT NULL,
    `date` DATE NOT NULL,
    FOREIGN KEY (`cashier_id`) 
        REFERENCES `Cashier`(`id`) 
        ON DELETE RESTRICT,
    FOREIGN KEY (`shift_id`) 
        REFERENCES `Shift`(`id`) 
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Transaction details (Amounts per particular)
CREATE TABLE IF NOT EXISTS `TransactionDetail` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `transaction_id` INT UNSIGNED NOT NULL,
    `particular_id` INT UNSIGNED NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (`transaction_id`) 
        REFERENCES `Transaction`(`id`) 
        ON DELETE CASCADE,
    FOREIGN KEY (`particular_id`) 
        REFERENCES `Particular`(`id`) 
        ON DELETE RESTRICT,
    UNIQUE KEY `unique_transaction_particular` (`transaction_id`, `particular_id`)
) ENGINE=InnoDB;

USE `logicbase_ojt_db`;

INSERT INTO `Cashier` (`name`, `hashed_password`, `email`, `registeredAt`) VALUES ('Cherry', '$2a$10$vvk3fsM0XzkqxxNQW6ZMsOQl48VAWnjKr74SIHfn2fBXHElidYfou', 'my.test@email.com', NOW());
INSERT INTO `Cashier` (`name`, `hashed_password`, `email`, `registeredAt`) VALUES ('John', '$2a$10$vvk3fsM0XzkqxxNQW6ZMsOQl48VAWnjKr74SIHfn2fBXHElidYfou', 'my.test2@email.com', NOW());