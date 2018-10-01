CREATE DATABASE `theca` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;


CREATE TABLE `transactions`.`opreturn` (
  `txid` VARCHAR(255) NOT NULL,
  `prefix` VARCHAR(255) NULL,
  `hash` VARCHAR(255) NULL,
  `type` VARCHAR(255) NULL,
  `title` VARCHAR(255) NULL,
  PRIMARY KEY (`txid`));
