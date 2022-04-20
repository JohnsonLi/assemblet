-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 04, 2022 at 09:29 PM
-- Server version: 5.7.24
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `assemblet`
--

-- --------------------------------------------------------

--
-- Table structure for table `Admin`
--

CREATE TABLE `Admin` (
  `id` int PRIMARY KEY,
  `name` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Puzzle`
--

CREATE TABLE `Puzzle` (
  `id` int PRIMARY KEY,
  `title` varchar(200) NOT NULL,
  `description` varchar(200) NOT NULL,
  `tutorialID` int(20),
  `solution` varchar(200) NOT NULL,
  `instructionsAllowed` varchar(50) NOT NULL,
  `valuesAllowed` varchar(50) NOT NULL,
  `registersAllowed` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `Tutorial` (
  `puzzleID` int PRIMARY KEY,
  `title` varchar(200) NOT NULL,
  `content` varchar(2000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `username` varchar(20),
  `password` varchar(200) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `Attempt` (
  `username` varchar(20),
  `puzzleID` int,
  `attempts` int,
  `timeTaken` int,
  `solved` tinyint,
  `watchedTutorial` tinyint,
  PRIMARY KEY (`username`, `puzzleID`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


COMMIT;



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
