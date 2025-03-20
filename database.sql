-- Create database if not exists
CREATE DATABASE IF NOT EXISTS `logicbase_ojt_db`;
USE `logicbase_ojt_db`;

-- User table
CREATE TABLE IF NOT EXISTS `users` (
    `user_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `hashed_password` VARCHAR(255) NOT NULL,
	`email` VARCHAR(50) NOT NULL,
    `user_type` ENUM('cashier', 'admin') DEFAULT 'cashier',
    `first_name` VARCHAR(100),
    `last_name` VARCHAR(100),
    `contact_number` VARCHAR(100),
    `address` VARCHAR(255),
    `age` TINYINT UNSIGNED,
    `active` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `email_verified` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `gender` enum('Male', 'Female', 'Not specified') DEFAULT 'Not specified',
	`created_at` DATETIME NOT NULL,
    `last_login` DATETIME DEFAULT NULL,
    `last_update` DATETIME DEFAULT NULL,
    `last_password_reset` DATETIME DEFAULT NULL
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Admin table
CREATE TABLE IF NOT EXISTS `users_admins` (
    `user_admin_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED,
    `admin_position` VARCHAR(100),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Cashier table
CREATE TABLE IF NOT EXISTS `users_cashiers` (
    `user_cashier_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_admin_id` INT UNSIGNED,
    `user_id` INT UNSIGNED,
    `rate` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_admin_id`) REFERENCES `users_admins`(`user_admin_id`) ON DELETE CASCADE
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create CashierLane table
CREATE TABLE IF NOT EXISTS `users_cashier_lanes` (
    `lane_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_admin_id` INT UNSIGNED,
    `lane_name` VARCHAR(50) NOT NULL UNIQUE,
    `cashier1_id` INT UNSIGNED,
    `cashier2_id` INT UNSIGNED,
    `cashier3_id` INT UNSIGNED,
    FOREIGN KEY (`user_admin_id`) REFERENCES `users_admins`(`user_admin_id`) ON DELETE CASCADE,
    FOREIGN KEY (`cashier1_id`) REFERENCES `users_cashiers`(`user_cashier_id`) ON DELETE SET NULL,
    FOREIGN KEY (`cashier2_id`) REFERENCES `users_cashiers`(`user_cashier_id`) ON DELETE SET NULL,
    FOREIGN KEY (`cashier3_id`) REFERENCES `users_cashiers`(`user_cashier_id`) ON DELETE SET NULL
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create Attendance table to store time-in and time-out data
CREATE TABLE IF NOT EXISTS `users_cashiers_attendance` (
    `attendance_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_cashier_id` INT UNSIGNED NOT NULL,
    `time_in` DATETIME DEFAULT NULL,
    `time_out` DATETIME DEFAULT NULL,
    `time_in_image` LONGTEXT DEFAULT NULL,  -- Store image or file path for time-in verification
    `time_out_image` LONGTEXT DEFAULT NULL, -- Store image or file path for time-out verification
    FOREIGN KEY (`user_cashier_id`) REFERENCES `users_cashiers`(`user_cashier_id`) ON DELETE CASCADE
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Shift table
CREATE TABLE IF NOT EXISTS `shift` (
    `shift_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `shift_name` ENUM('AM', 'MID', 'PM', 'GRAVEYARD') NOT NULL UNIQUE
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Particular table (Payment Methods & Expenses)
CREATE TABLE IF NOT EXISTS `particulars` (
    `particular_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `particular_name` VARCHAR(255) NOT NULL UNIQUE,
    `particular_type` ENUM('Trade', 'Non-Trade') NOT NULL,
    `particular_fee_percent` DECIMAL(5,2) DEFAULT 0.00
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Main transaction header
CREATE TABLE IF NOT EXISTS `transactions` (
    `transaction_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_cashier_id` INT UNSIGNED NOT NULL,
    `shift_id` INT UNSIGNED NOT NULL,
    `transaction_date` DATE NOT NULL,
    FOREIGN KEY (`user_cashier_id`) 
        REFERENCES `users_cashiers`(`user_cashier_id`) 
        ON DELETE RESTRICT,
    FOREIGN KEY (`shift_id`) 
        REFERENCES `shift`(`shift_id`) 
        ON DELETE RESTRICT
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Transaction details (Amounts per particular)
CREATE TABLE IF NOT EXISTS `transaction_detail` (
    `transaction_detail_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `transaction_id` INT UNSIGNED NOT NULL,
    `particular_id` INT UNSIGNED NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (`transaction_id`) 
        REFERENCES `transactions`(`transaction_id`) 
        ON DELETE CASCADE,
    FOREIGN KEY (`particular_id`) 
        REFERENCES `particulars`(`particular_id`) 
        ON DELETE RESTRICT,
    UNIQUE KEY `unique_transaction_particular` (`transaction_id`, `particular_id`)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `users_notification_subscriptions` (
  `user_id` INT UNSIGNED NOT NULL,
  `auth` VARCHAR(255) NOT NULL,
  `data` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  UNIQUE KEY `auth` (`auth`),
  KEY `user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- USE `logicbase_ojt_db`;

-- INSERTING ESSENTIAL DATA

INSERT IGNORE INTO `shift` (`shift_name`) VALUES ('AM'), ('MID'), ('PM');
-- INSERT IGNORE INTO `shift` (`particular_name`) VALUES ('GRAVEYARD');
INSERT IGNORE INTO `particulars` (`particular_name`, `particular_type`, `particular_fee_percent`) 
VALUES 
('Cash', 'Trade', 0), ('Check', 'Trade', 0),
('BPI Credit Card', 'Trade', 2.80), ('BPI Debit Card', 'Trade', 1.50),
('Metro Credit Card', 'Trade', 1.50), ('Metro Debit Card', 'Trade', 1.00), 
('AUB Credit Card', 'Trade', 1.50),
('GCash', 'Trade', 1.50), ('Pay Maya', 'Trade', 2.25),
('Food Panda', 'Trade', 25.00), ('Streetby', 'Trade', 10.00),
('Grab Food', 'Trade', 20.00);

INSERT IGNORE INTO `particulars` (`particular_name`, `particular_type`) 
VALUES 
('Food Charge', 'Non-Trade'), ('MM-HEAD OFFICE', 'Non-Trade'),
('MM-COMMISSARY', 'Non-Trade'), ('MM-RM', 'Non-Trade'), ('MM-KM', 'Non-Trade'), 
('MM-DM', 'Non-Trade');
		