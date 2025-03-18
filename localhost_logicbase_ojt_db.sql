-- Create database if not exists
CREATE DATABASE IF NOT EXISTS `logicbase_ojt_db`;
USE `logicbase_ojt_db`;

-- User table
CREATE TABLE IF NOT EXISTS `User` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
	`hashed_password` VARCHAR(255) NOT NULL,
	`email` VARCHAR(50) NOT NULL,
    `user_type` ENUM('cashier', 'admin') DEFAULT 'cashier',
	`registeredAt` DATETIME NOT NULL
) ENGINE=InnoDB;
ALTER TABLE `User` 
-- DROP `name`,
ADD `username` VARCHAR(100),
ADD `first_name` VARCHAR(100),
ADD `last_name` VARCHAR(100),
ADD `contact_number` VARCHAR(100),
ADD `address` VARCHAR(255),
ADD `age` TINYINT,
ADD `active` TINYINT,
ADD `gender` enum('Male', 'Female', 'Not specified') DEFAULT 'Not specified',
ADD `last_login` DATETIME DEFAULT NULL,
ADD `last_update` DATETIME DEFAULT NULL,
ADD `last_password_reset` DATETIME DEFAULT NULL;

-- -- Cashier table
CREATE TABLE IF NOT EXISTS `Cashier` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED,
    `rate` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;
-- CREATE TABLE IF NOT EXISTS `Cashier` (
--     `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
--     `name` VARCHAR(50) NOT NULL,
-- 	`hashed_password` VARCHAR(255) NOT NULL,
-- 	`email` VARCHAR(50) NOT NULL,
-- 	`registeredAt` DATETIME NOT NULL
-- ) ENGINE=InnoDB;
-- USE `logicbase_ojt_db`;
-- ALTER TABLE `Cashier`
-- ADD `user_id` INT UNSIGNED,
-- ADD `rate` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
-- ADD FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE, 
-- DROP `name`,
-- DROP `hashed_password`,
-- DROP `email`,
-- DROP `registeredAt`;

-- Create CashierLane table
CREATE TABLE IF NOT EXISTS `CashierLane` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `cashier1_id` INT UNSIGNED,
    `cashier2_id` INT UNSIGNED,
    `cashier3_id` INT UNSIGNED,
    FOREIGN KEY (`cashier1_id`) REFERENCES `Cashier`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`cashier2_id`) REFERENCES `Cashier`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`cashier3_id`) REFERENCES `Cashier`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Create Attendance table to store time-in and time-out data
CREATE TABLE IF NOT EXISTS `Attendance` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `cashier_id` INT UNSIGNED NOT NULL,
    `time_in` DATETIME DEFAULT NULL,
    `time_out` DATETIME DEFAULT NULL,
    `time_in_image` VARCHAR(255) DEFAULT NULL,  -- Store image or file path for time-in verification
    `time_out_image` VARCHAR(255) DEFAULT NULL, -- Store image or file path for time-out verification
    FOREIGN KEY (`cashier_id`) REFERENCES `Cashier`(`id`) ON DELETE CASCADE
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

-- USE `logicbase_ojt_db`;
-- INSERT INTO `Cashier` (`name`, `hashed_password`, `email`, `registeredAt`) VALUES ('Cherry', '$2a$10$vvk3fsM0XzkqxxNQW6ZMsOQl48VAWnjKr74SIHfn2fBXHElidYfou', 'my.test@email.com', NOW());
-- INSERT INTO `Cashier` (`name`, `hashed_password`, `email`, `registeredAt`) VALUES ('John', '$2a$10$vvk3fsM0XzkqxxNQW6ZMsOQl48VAWnjKr74SIHfn2fBXHElidYfou', 'my.test2@email.com', NOW());

-- -- INSERTING ESSENTIAL DATA

-- INSERT IGNORE INTO `Shift` (`name`) VALUES ('AM'), ('MID'), ('PM');
-- INSERT IGNORE INTO `Particular` (`name`, `type`, `fee_percent`) 
-- VALUES ('Cash', 'Trade', 0), ('Check', 'Trade', 0),
-- ('BPI Credit Card', 'Trade', 3.00), ('BPI Debit Card', 'Trade', 1.50),
-- ('Metro Credit Card', 'Trade', 1.50), ('Metro Debit Card', 'Trade', 1.00), 
-- ('AUB Credit Card', 'Trade', 1.50),
-- ('GCash', 'Trade', 1.50), ('Pay Maya', 'Trade', 2.25),
-- ('Food Panda', 'Trade', 25.00), ('Streetby', 'Trade', 10.00),
-- ('Grab Food', 'Trade', 20.00);

-- INSERT IGNORE INTO `Particular` (`name`, `type`) 
-- VALUES ('Food Charge', 'Non-Trade'), ('MM-HEAD OFFICE', 'Non-Trade'),
-- ('MM-COMMISSARY', 'Non-Trade'), ('MM-RM', 'Non-Trade'), ('MM-KM', 'Non-Trade'), ('MM-DM', 'Non-Trade');

-- -- SELECT VERSION();
		