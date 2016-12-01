
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=1;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=1;


CREATE DATABASE IF NOT EXISTS `accounts` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE `accounts`;
#crear el usuario
#CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin';
#dar privilefios al usuariotbusuario
GRANT ALL PRIVILEGES ON accounts.* TO 'admin'@'localhost';
#actualizar los privilegios
FLUSH PRIVILEGES;
#select user, host from mysql.user where user= 'admin';

-- -----------------------------------------------------
-- Table `accounts`.`tbUserType`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `accounts`.`tbUserType` (
  `idUserType` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `userTypeName` VARCHAR(45) COLLATE utf8_general_ci NOT NULL,
  UNIQUE INDEX `idUserType` (`idUserType` ASC))
ENGINE = InnoDB
DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;


-- -----------------------------------------------------
-- Table `accounts`.`tbUser`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `accounts`.`tbUser` (
  `userId` VARCHAR(255) COLLATE utf8_spanish_ci NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) COLLATE utf8_spanish_ci NOT NULL,
  `lastName` VARCHAR(255) COLLATE utf8_spanish_ci NOT NULL,
  `username` VARCHAR(255) COLLATE utf8_spanish_ci NOT NULL,
  `password` VARCHAR(255) COLLATE utf8_spanish_ci NOT NULL,
  `money` VARCHAR(50) COLLATE utf8_spanish_ci NOT NULL,
  `accountType` VARCHAR(50) COLLATE utf8_spanish_ci NOT NULL,
  `tbUserType_idUserType` INT(11) NOT NULL,
  `Active` TINYINT(1) NOT NULL DEFAULT 1,
  UNIQUE INDEX `userId` (`userId` ASC),
  INDEX `tbUserType_idUserType_idx` (`tbUserType_idUserType` ASC),
  CONSTRAINT `tbUserType_idUserType`
    FOREIGN KEY (`tbUserType_idUserType`)
    REFERENCES `accounts`.`tbUserType` (`idUserType`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- -----------------------------------------------------
-- Table `accounts`.`tbtransactions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `accounts`.`tbTransactions` (
  `transactId` VARCHAR(255) COLLATE utf8_spanish_ci NOT NULL PRIMARY KEY,
  `date` DATETIME NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `detail` TEXT COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  `shop` VARCHAR(255) COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  `transactType` VARCHAR(50) COLLATE utf8_spanish_ci NOT NULL,
  `typeId` TINYINT(1) NOT NULL,
  `Active` TINYINT(1) NOT NULL DEFAULT 1,
  UNIQUE INDEX `transactId` (`transactId` ASC))
ENGINE = InnoDB
DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;


-- -----------------------------------------------------
-- Table `accounts`.`tbTransactXUser`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `accounts`.`tbTransactXUser` (
  `index` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `tbUser_userId` VARCHAR(255) COLLATE utf8_spanish_ci NOT NULL,
  `tbTransactios_transactd` VARCHAR(255) COLLATE utf8_spanish_ci NOT NULL,
  CONSTRAINT `tbUser_userId`
    FOREIGN KEY (`tbUser_userId`)
    REFERENCES `accounts`.`tbUser` (`userId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `tbTransactios_transactd`
    FOREIGN KEY (`tbTransactios_transactd`)
    REFERENCES `accounts`.`tbtransactions` (`transactId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

