CREATE DATABASE `nodered` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `nodered`

-- nodered.Credentials definition

CREATE TABLE IF NOT EXISTS `Credentials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `json` longtext NOT NULL,
  `createdAt` datetime NOT NULL,
  `appName` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL,
  `revision` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- nodered.Flows definition

CREATE TABLE IF NOT EXISTS `Flows` (
  `id` int NOT NULL AUTO_INCREMENT,
  `json` longtext NOT NULL,
  `createdAt` datetime NOT NULL,
  `appName` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL,
  `revision` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- nodered.LibraryEntry definition

CREATE TABLE `LibraryEntry` (
  `id` int NOT NULL AUTO_INCREMENT,
  `json` longtext NOT NULL,
  `meta` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `appName` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL,
  `revision` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- nodered.Sessions definition

CREATE TABLE `Sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `json` longtext NOT NULL,
  `createdAt` datetime NOT NULL,
  `appName` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL,
  `revision` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- nodered.Settings definition

CREATE TABLE `Settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `json` longtext NOT NULL,
  `createdAt` datetime NOT NULL,
  `appName` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL,
  `revision` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;