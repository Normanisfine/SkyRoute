-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 02, 2025 at 02:24 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `skyroute`
--

-- --------------------------------------------------------

--
-- Table structure for table `Aircraft`
--

CREATE TABLE `Aircraft` (
  `aircraft_id` int(11) NOT NULL,
  `model` varchar(255) DEFAULT NULL,
  `total_seats` int(11) DEFAULT NULL,
  `airline_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Aircraft`
--

INSERT INTO `Aircraft` (`aircraft_id`, `model`, `total_seats`, `airline_id`) VALUES
(1, 'Boeing 737', 5, 1),
(2, 'Airbus A320', 5, 2),
(3, 'Boeing 777', 5, 3),
(4, 'Airbus A380', 5, 4),
(5, 'Boeing 787 Dreamliner', 5, 5),
(6, 'Airbus A350', 5, 6),
(7, 'Boeing 737 MAX', 5, 7),
(8, 'Airbus A330', 5, 8),
(9, 'Embraer E190', 5, 9),
(10, 'Bombardier CRJ1000', 5, 10);

-- --------------------------------------------------------

--
-- Table structure for table `Airline`
--

CREATE TABLE `Airline` (
  `airline_id` int(11) NOT NULL,
  `airline_name` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Airline`
--

INSERT INTO `Airline` (`airline_id`, `airline_name`, `country`) VALUES
(1, 'American Airlines', 'USA'),
(2, 'Delta Air Lines', 'USA'),
(3, 'United Airlines', 'USA'),
(4, 'Southwest Airlines', 'USA'),
(5, 'Air France', 'France'),
(6, 'Lufthansa', 'Germany'),
(7, 'British Airways', 'UK'),
(8, 'Qantas Airways', 'Australia'),
(9, 'Emirates', 'UAE'),
(10, 'Cathay Pacific', 'Hong Kong');

-- --------------------------------------------------------

--
-- Table structure for table `Airport`
--

CREATE TABLE `Airport` (
  `airport_id` int(11) NOT NULL,
  `airport_name` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `iata_code` varchar(10) DEFAULT NULL,
  `icao_code` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Airport`
--

INSERT INTO `Airport` (`airport_id`, `airport_name`, `city`, `country`, `iata_code`, `icao_code`) VALUES
(1, 'JFK International Airport', 'New York', 'USA', 'JFK', 'KJFK'),
(2, 'Los Angeles International Airport', 'Los Angeles', 'USA', 'LAX', 'KLAX'),
(3, 'Heathrow Airport', 'London', 'UK', 'LHR', 'EGLL'),
(4, 'Charles de Gaulle Airport', 'Paris', 'France', 'CDG', 'LFPG'),
(5, 'Frankfurt Airport', 'Frankfurt', 'Germany', 'FRA', 'EDDF'),
(6, 'Narita International Airport', 'Tokyo', 'Japan', 'NRT', 'RJAA'),
(7, 'Beijing Capital International Airport', 'Beijing', 'China', 'PEK', 'ZBAA'),
(8, 'Dubai International Airport', 'Dubai', 'UAE', 'DXB', 'OMDB'),
(9, 'Sydney Airport', 'Sydney', 'Australia', 'SYD', 'YSSY'),
(10, 'Sao Paulo Guarulhos International Airport', 'Sao Paulo', 'Brazil', 'GRU', 'SBGR');

-- --------------------------------------------------------

--
-- Table structure for table `Baggage_Claim`
--

CREATE TABLE `Baggage_Claim` (
  `baggage_claim_id` int(11) NOT NULL,
  `airport_id` int(11) DEFAULT NULL,
  `flight_id` int(11) DEFAULT NULL,
  `baggage_belt_number` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Baggage_Claim`
--

INSERT INTO `Baggage_Claim` (`baggage_claim_id`, `airport_id`, `flight_id`, `baggage_belt_number`) VALUES
(1, 1, 1, 'Belt 1'),
(2, 2, 2, 'Belt 2'),
(3, 3, 3, 'Belt 3'),
(4, 4, 4, 'Belt 4'),
(5, 5, 5, 'Belt 5'),
(6, 6, 6, 'Belt 6'),
(7, 7, 7, 'Belt 7'),
(8, 8, 8, 'Belt 8'),
(9, 9, 9, 'Belt 9'),
(10, 10, 10, 'Belt 10');

-- --------------------------------------------------------

--
-- Table structure for table `Boarding_Pass`
--

CREATE TABLE `Boarding_Pass` (
  `boarding_pass_id` int(11) NOT NULL,
  `passenger_id` int(11) DEFAULT NULL,
  `flight_id` int(11) DEFAULT NULL,
  `seat_number` varchar(10) DEFAULT NULL,
  `boarding_gate` varchar(10) DEFAULT NULL,
  `boarding_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Boarding_Pass`
--

INSERT INTO `Boarding_Pass` (`boarding_pass_id`, `passenger_id`, `flight_id`, `seat_number`, `boarding_gate`, `boarding_time`) VALUES
(1, 1, 1, 'A1', 'Gate 1', '2023-03-01 07:30:00'),
(2, 2, 2, 'A1', 'Gate 2', '2023-03-02 08:30:00'),
(3, 3, 3, 'A1', 'Gate 3', '2023-03-03 09:30:00'),
(4, 4, 4, 'A1', 'Gate 4', '2023-03-04 10:30:00'),
(5, 5, 5, 'A1', 'Gate 5', '2023-03-05 11:30:00'),
(6, 6, 6, 'A1', 'Gate 6', '2023-03-06 12:30:00'),
(7, 7, 7, 'A1', 'Gate 7', '2023-03-07 13:30:00'),
(8, 8, 8, 'A1', 'Gate 8', '2023-03-08 14:30:00'),
(9, 9, 9, 'A1', 'Gate 9', '2023-03-09 15:30:00'),
(10, 10, 10, 'A1', 'Gate 10', '2023-03-10 16:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `Booking`
--

CREATE TABLE `Booking` (
  `booking_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `passenger_id` int(11) DEFAULT NULL,
  `flight_id` int(11) DEFAULT NULL,
  `seat_id` int(11) DEFAULT NULL,
  `booking_time` datetime DEFAULT NULL,
  `status` enum('Paid','Unpaid','Cancelled') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Booking`
--

INSERT INTO `Booking` (`booking_id`, `user_id`, `passenger_id`, `flight_id`, `seat_id`, `booking_time`, `status`) VALUES
(1, 1, NULL, 1, 1, '2023-03-01 08:00:00', 'Paid'),
(2, 2, NULL, 2, 2, '2023-03-02 09:00:00', 'Paid'),
(3, 3, NULL, 3, 3, '2023-03-03 10:00:00', 'Paid'),
(4, 4, NULL, 4, 4, '2023-03-04 11:00:00', 'Paid'),
(5, 5, NULL, 5, 5, '2023-03-05 12:00:00', 'Paid'),
(6, 6, NULL, 6, 6, '2023-03-06 13:00:00', 'Paid'),
(7, 7, NULL, 7, 7, '2023-03-07 14:00:00', 'Paid'),
(8, 8, NULL, 8, 8, '2023-03-08 15:00:00', 'Paid'),
(9, 9, NULL, 9, 9, '2023-03-09 16:00:00', 'Paid'),
(10, 10, NULL, 10, 10, '2023-03-10 17:00:00', 'Paid');

-- --------------------------------------------------------

--
-- Table structure for table `Check_in`
--

CREATE TABLE `Check_in` (
  `checkin_id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `seat_id` int(11) DEFAULT NULL,
  `checkin_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Check_in`
--

INSERT INTO `Check_in` (`checkin_id`, `booking_id`, `seat_id`, `checkin_time`) VALUES
(11, 1, 1, '2023-03-01 06:00:00'),
(12, 2, 2, '2023-03-02 07:00:00'),
(13, 3, 3, '2023-03-03 08:00:00'),
(14, 4, 4, '2023-03-04 09:00:00'),
(15, 5, 5, '2023-03-05 10:00:00'),
(16, 6, 6, '2023-03-06 11:00:00'),
(17, 7, 7, '2023-03-07 12:00:00'),
(18, 8, 8, '2023-03-08 13:00:00'),
(19, 9, 9, '2023-03-09 14:00:00'),
(20, 10, 10, '2023-03-10 15:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `Crew`
--

CREATE TABLE `Crew` (
  `crew_id` int(11) NOT NULL,
  `flight_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `role` enum('Pilot','Co-Pilot','Flight Attendant') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Crew`
--

INSERT INTO `Crew` (`crew_id`, `flight_id`, `name`, `role`) VALUES
(1, 1, 'Captain Morgan', 'Pilot'),
(2, 2, 'First Officer Smith', 'Co-Pilot'),
(3, 3, 'Captain Lee', 'Pilot'),
(4, 4, 'First Officer Clark', 'Co-Pilot'),
(5, 5, 'Captain Wright', 'Pilot'),
(6, 6, 'First Officer Taylor', 'Co-Pilot'),
(7, 7, 'Captain Adams', 'Pilot'),
(8, 8, 'First Officer Black', 'Co-Pilot'),
(9, 9, 'Captain White', 'Pilot'),
(10, 10, 'First Officer Stone', 'Co-Pilot');

-- --------------------------------------------------------

--
-- Table structure for table `Flight`
--

CREATE TABLE `Flight` (
  `flight_id` int(11) NOT NULL,
  `flight_number` varchar(255) DEFAULT NULL,
  `departure_airport_id` int(11) DEFAULT NULL,
  `arrival_airport_id` int(11) DEFAULT NULL,
  `departure_time` datetime DEFAULT NULL,
  `arrival_time` datetime DEFAULT NULL,
  `aircraft_id` int(11) DEFAULT NULL,
  `airline_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Flight`
--

INSERT INTO `Flight` (`flight_id`, `flight_number`, `departure_airport_id`, `arrival_airport_id`, `departure_time`, `arrival_time`, `aircraft_id`, `airline_id`) VALUES
(1, 'FL100', 1, 2, '2021-01-01 08:00:00', '2021-01-01 11:00:00', 1, 1),
(2, 'FL101', 2, 3, '2021-01-02 09:00:00', '2021-01-02 14:00:00', 2, 2),
(3, 'FL102', 3, 4, '2021-01-03 07:00:00', '2021-01-03 10:00:00', 3, 3),
(4, 'FL103', 4, 5, '2021-01-04 10:00:00', '2021-01-04 15:00:00', 4, 4),
(5, 'FL104', 5, 6, '2021-01-05 06:00:00', '2021-01-05 09:00:00', 5, 5),
(6, 'FL105', 6, 7, '2021-01-06 12:00:00', '2021-01-06 17:00:00', 6, 6),
(7, 'FL106', 7, 8, '2021-01-07 13:00:00', '2021-01-07 16:00:00', 7, 7),
(8, 'FL107', 8, 9, '2021-01-08 14:00:00', '2021-01-08 19:00:00', 8, 8),
(9, 'FL108', 9, 10, '2021-01-09 15:00:00', '2021-01-09 18:00:00', 9, 9),
(10, 'FL109', 10, 1, '2021-01-10 16:00:00', '2021-01-10 21:00:00', 10, 10);

-- --------------------------------------------------------

--
-- Table structure for table `Flight_Status`
--

CREATE TABLE `Flight_Status` (
  `flight_status_id` int(11) NOT NULL,
  `flight_id` int(11) DEFAULT NULL,
  `status` enum('On-Time','Delayed','Cancelled') DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Flight_Status`
--

INSERT INTO `Flight_Status` (`flight_status_id`, `flight_id`, `status`, `last_updated`) VALUES
(1, 1, 'On-Time', '2023-03-01 05:00:00'),
(2, 2, 'Delayed', '2023-03-02 06:00:00'),
(3, 3, 'On-Time', '2023-03-03 07:00:00'),
(4, 4, 'Cancelled', '2023-03-04 08:00:00'),
(5, 5, 'On-Time', '2023-03-05 09:00:00'),
(6, 6, 'On-Time', '2023-03-06 10:00:00'),
(7, 7, 'Delayed', '2023-03-07 11:00:00'),
(8, 8, 'On-Time', '2023-03-08 12:00:00'),
(9, 9, 'Cancelled', '2023-03-09 13:00:00'),
(10, 10, 'On-Time', '2023-03-10 14:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `Luggage`
--

CREATE TABLE `Luggage` (
  `luggage_id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `weight` decimal(10,2) DEFAULT NULL,
  `dimensions` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Luggage`
--

INSERT INTO `Luggage` (`luggage_id`, `booking_id`, `weight`, `dimensions`) VALUES
(1, 1, 23.00, '22x14x9'),
(2, 2, 15.00, '20x10x8'),
(3, 3, 30.00, '24x15x10'),
(4, 4, 20.00, '22x14x9'),
(5, 5, 25.00, '22x14x9'),
(6, 6, 18.00, '20x10x8'),
(7, 7, 17.00, '20x10x8'),
(8, 8, 22.00, '22x14x9'),
(9, 9, 16.00, '20x10x8'),
(10, 10, 28.00, '24x15x10');

-- --------------------------------------------------------

--
-- Table structure for table `Passenger`
--

CREATE TABLE `Passenger` (
  `passenger_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `passport_number` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Passenger`
--

INSERT INTO `Passenger` (`passenger_id`, `user_id`, `name`, `passport_number`, `dob`) VALUES
(1, 1, 'John Doe Jr.', 'B1234567', '2000-01-01'),
(2, 1, 'Emily Doe', 'B1234568', '2002-02-02'),
(3, 2, 'Michael Smith', 'B1234569', '2001-03-03'),
(4, 2, 'Rachel Smith', 'B1234570', '2003-04-04'),
(5, 3, 'Laura Johnson', 'B1234571', '2005-05-05'),
(6, 3, 'Kevin Johnson', 'B1234572', '2006-06-06'),
(7, 4, 'Sarah Brown', 'B1234573', '2007-07-07'),
(8, 5, 'Zoe Davis', 'B1234574', '2008-08-08'),
(9, 6, 'Oliver Miller', 'B1234575', '2009-09-09'),
(10, 7, 'Isabella White', 'B1234576', '2010-10-10');

-- --------------------------------------------------------

--
-- Table structure for table `Payment`
--

CREATE TABLE `Payment` (
  `payment_id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `payment_method` enum('Credit Card','PayPal','Alipay') DEFAULT NULL,
  `payment_status` enum('Completed','Pending','Failed') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Payment`
--

INSERT INTO `Payment` (`payment_id`, `booking_id`, `payment_method`, `payment_status`) VALUES
(11, 1, 'Credit Card', 'Completed'),
(12, 2, 'PayPal', 'Completed'),
(13, 3, 'Credit Card', 'Completed'),
(14, 4, 'Alipay', 'Completed'),
(15, 5, 'Credit Card', 'Completed'),
(16, 6, 'Credit Card', 'Completed'),
(17, 7, 'PayPal', 'Completed'),
(18, 8, 'Credit Card', 'Completed'),
(19, 9, 'Alipay', 'Completed'),
(20, 10, 'Credit Card', 'Completed');

-- --------------------------------------------------------

--
-- Table structure for table `Saved_Flights`
--

CREATE TABLE `Saved_Flights` (
  `saved_flight_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `flight_id` int(11) DEFAULT NULL,
  `saved_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Saved_Flights`
--

INSERT INTO `Saved_Flights` (`saved_flight_id`, `user_id`, `flight_id`, `saved_time`) VALUES
(1, 1, 5, '2023-03-15 08:30:00'),
(2, 1, 6, '2023-03-16 09:45:00'),
(3, 2, 5, '2023-03-17 10:00:00'),
(4, 2, 10, '2023-03-18 11:15:00'),
(5, 3, 3, '2023-03-19 12:30:00'),
(6, 3, 4, '2023-03-20 13:45:00'),
(7, 4, 2, '2023-03-21 14:00:00'),
(8, 4, 1, '2023-03-22 15:15:00'),
(9, 5, 8, '2023-03-23 16:30:00'),
(10, 5, 9, '2023-03-24 17:45:00');

-- --------------------------------------------------------

--
-- Table structure for table `Seat`
--

CREATE TABLE `Seat` (
  `seat_id` int(11) NOT NULL,
  `aircraft_id` int(11) DEFAULT NULL,
  `seat_number` varchar(4) DEFAULT NULL,
  `class_type` enum('Economy','Business','First') DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `status` enum('Available','Booked') DEFAULT 'Available'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Seat`
--

INSERT INTO `Seat` (`seat_id`, `aircraft_id`, `seat_number`, `class_type`, `price`, `status`) VALUES
(1, 1, 'A1', 'Economy', 200.00, 'Available'),
(2, 1, 'A2', 'Economy', 200.00, 'Available'),
(3, 1, 'A3', 'Economy', 200.00, 'Available'),
(4, 1, 'A4', 'Economy', 200.00, 'Available'),
(5, 1, 'A5', 'Economy', 200.00, 'Available'),
(6, 2, 'A1', 'Business', 500.00, 'Available'),
(7, 2, 'A2', 'Business', 500.00, 'Available'),
(8, 2, 'A3', 'Business', 500.00, 'Available'),
(9, 2, 'A4', 'Business', 500.00, 'Available'),
(10, 2, 'A5', 'Business', 500.00, 'Available');

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `user_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `passport_number` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`user_id`, `name`, `email`, `phone`, `passport_number`) VALUES
(1, 'John Doe', 'johndoe@example.com', '555-0100', 'A1234567'),
(2, 'Jane Smith', 'janesmith@example.com', '555-0101', 'A1234568'),
(3, 'Alice Johnson', 'alicejohnson@example.com', '555-0102', 'A1234569'),
(4, 'Bob Brown', 'bobbrown@example.com', '555-0103', 'A1234570'),
(5, 'Charlie Davis', 'charliedavis@example.com', '555-0104', 'A1234571'),
(6, 'Daisy Miller', 'daisymiller@example.com', '555-0105', 'A1234572'),
(7, 'Ella White', 'ellawhite@example.com', '555-0106', 'A1234573'),
(8, 'Frank Green', 'frankgreen@example.com', '555-0107', 'A1234574'),
(9, 'Grace Hall', 'gracehall@example.com', '555-0108', 'A1234575'),
(10, 'Harry Lee', 'harrylee@example.com', '555-0109', 'A1234576');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Aircraft`
--
ALTER TABLE `Aircraft`
  ADD PRIMARY KEY (`aircraft_id`),
  ADD KEY `airline_id` (`airline_id`);

--
-- Indexes for table `Airline`
--
ALTER TABLE `Airline`
  ADD PRIMARY KEY (`airline_id`),
  ADD UNIQUE KEY `airline_name` (`airline_name`);

--
-- Indexes for table `Airport`
--
ALTER TABLE `Airport`
  ADD PRIMARY KEY (`airport_id`),
  ADD UNIQUE KEY `iata_code` (`iata_code`),
  ADD UNIQUE KEY `icao_code` (`icao_code`);

--
-- Indexes for table `Baggage_Claim`
--
ALTER TABLE `Baggage_Claim`
  ADD PRIMARY KEY (`baggage_claim_id`),
  ADD KEY `airport_id` (`airport_id`),
  ADD KEY `flight_id` (`flight_id`);

--
-- Indexes for table `Boarding_Pass`
--
ALTER TABLE `Boarding_Pass`
  ADD PRIMARY KEY (`boarding_pass_id`),
  ADD KEY `passenger_id` (`passenger_id`),
  ADD KEY `flight_id` (`flight_id`);

--
-- Indexes for table `Booking`
--
ALTER TABLE `Booking`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `passenger_id` (`passenger_id`),
  ADD KEY `flight_id` (`flight_id`),
  ADD KEY `seat_id` (`seat_id`);

--
-- Indexes for table `Check_in`
--
ALTER TABLE `Check_in`
  ADD PRIMARY KEY (`checkin_id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `seat_id` (`seat_id`);

--
-- Indexes for table `Crew`
--
ALTER TABLE `Crew`
  ADD PRIMARY KEY (`crew_id`),
  ADD KEY `flight_id` (`flight_id`);

--
-- Indexes for table `Flight`
--
ALTER TABLE `Flight`
  ADD PRIMARY KEY (`flight_id`),
  ADD UNIQUE KEY `flight_number` (`flight_number`),
  ADD KEY `departure_airport_id` (`departure_airport_id`),
  ADD KEY `arrival_airport_id` (`arrival_airport_id`),
  ADD KEY `aircraft_id` (`aircraft_id`),
  ADD KEY `airline_id` (`airline_id`);

--
-- Indexes for table `Flight_Status`
--
ALTER TABLE `Flight_Status`
  ADD PRIMARY KEY (`flight_status_id`),
  ADD KEY `flight_id` (`flight_id`);

--
-- Indexes for table `Luggage`
--
ALTER TABLE `Luggage`
  ADD PRIMARY KEY (`luggage_id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indexes for table `Passenger`
--
ALTER TABLE `Passenger`
  ADD PRIMARY KEY (`passenger_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `Payment`
--
ALTER TABLE `Payment`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indexes for table `Saved_Flights`
--
ALTER TABLE `Saved_Flights`
  ADD PRIMARY KEY (`saved_flight_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `flight_id` (`flight_id`);

--
-- Indexes for table `Seat`
--
ALTER TABLE `Seat`
  ADD PRIMARY KEY (`seat_id`),
  ADD UNIQUE KEY `aircraft_id` (`aircraft_id`,`seat_number`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `passport_number` (`passport_number`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Aircraft`
--
ALTER TABLE `Aircraft`
  MODIFY `aircraft_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Airline`
--
ALTER TABLE `Airline`
  MODIFY `airline_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Airport`
--
ALTER TABLE `Airport`
  MODIFY `airport_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Baggage_Claim`
--
ALTER TABLE `Baggage_Claim`
  MODIFY `baggage_claim_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Boarding_Pass`
--
ALTER TABLE `Boarding_Pass`
  MODIFY `boarding_pass_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Booking`
--
ALTER TABLE `Booking`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=278;

--
-- AUTO_INCREMENT for table `Check_in`
--
ALTER TABLE `Check_in`
  MODIFY `checkin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `Crew`
--
ALTER TABLE `Crew`
  MODIFY `crew_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Flight`
--
ALTER TABLE `Flight`
  MODIFY `flight_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Flight_Status`
--
ALTER TABLE `Flight_Status`
  MODIFY `flight_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Luggage`
--
ALTER TABLE `Luggage`
  MODIFY `luggage_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Passenger`
--
ALTER TABLE `Passenger`
  MODIFY `passenger_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Payment`
--
ALTER TABLE `Payment`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `Saved_Flights`
--
ALTER TABLE `Saved_Flights`
  MODIFY `saved_flight_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Seat`
--
ALTER TABLE `Seat`
  MODIFY `seat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Aircraft`
--
ALTER TABLE `Aircraft`
  ADD CONSTRAINT `aircraft_ibfk_1` FOREIGN KEY (`airline_id`) REFERENCES `Airline` (`airline_id`);

--
-- Constraints for table `Baggage_Claim`
--
ALTER TABLE `Baggage_Claim`
  ADD CONSTRAINT `baggage_claim_ibfk_1` FOREIGN KEY (`airport_id`) REFERENCES `Airport` (`airport_id`),
  ADD CONSTRAINT `baggage_claim_ibfk_2` FOREIGN KEY (`flight_id`) REFERENCES `Flight` (`flight_id`);

--
-- Constraints for table `Boarding_Pass`
--
ALTER TABLE `Boarding_Pass`
  ADD CONSTRAINT `boarding_pass_ibfk_1` FOREIGN KEY (`passenger_id`) REFERENCES `Passenger` (`passenger_id`),
  ADD CONSTRAINT `boarding_pass_ibfk_2` FOREIGN KEY (`flight_id`) REFERENCES `Flight` (`flight_id`);

--
-- Constraints for table `Booking`
--
ALTER TABLE `Booking`
  ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`),
  ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`passenger_id`) REFERENCES `Passenger` (`passenger_id`),
  ADD CONSTRAINT `booking_ibfk_3` FOREIGN KEY (`flight_id`) REFERENCES `Flight` (`flight_id`),
  ADD CONSTRAINT `booking_ibfk_4` FOREIGN KEY (`seat_id`) REFERENCES `Seat` (`seat_id`);

--
-- Constraints for table `Check_in`
--
ALTER TABLE `Check_in`
  ADD CONSTRAINT `check_in_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `Booking` (`booking_id`),
  ADD CONSTRAINT `check_in_ibfk_2` FOREIGN KEY (`seat_id`) REFERENCES `Seat` (`seat_id`);

--
-- Constraints for table `Crew`
--
ALTER TABLE `Crew`
  ADD CONSTRAINT `crew_ibfk_1` FOREIGN KEY (`flight_id`) REFERENCES `Flight` (`flight_id`);

--
-- Constraints for table `Flight`
--
ALTER TABLE `Flight`
  ADD CONSTRAINT `flight_ibfk_1` FOREIGN KEY (`departure_airport_id`) REFERENCES `Airport` (`airport_id`),
  ADD CONSTRAINT `flight_ibfk_2` FOREIGN KEY (`arrival_airport_id`) REFERENCES `Airport` (`airport_id`),
  ADD CONSTRAINT `flight_ibfk_3` FOREIGN KEY (`aircraft_id`) REFERENCES `Aircraft` (`aircraft_id`),
  ADD CONSTRAINT `flight_ibfk_4` FOREIGN KEY (`airline_id`) REFERENCES `Airline` (`airline_id`);

--
-- Constraints for table `Flight_Status`
--
ALTER TABLE `Flight_Status`
  ADD CONSTRAINT `flight_status_ibfk_1` FOREIGN KEY (`flight_id`) REFERENCES `Flight` (`flight_id`);

--
-- Constraints for table `Luggage`
--
ALTER TABLE `Luggage`
  ADD CONSTRAINT `luggage_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `Booking` (`booking_id`);

--
-- Constraints for table `Passenger`
--
ALTER TABLE `Passenger`
  ADD CONSTRAINT `passenger_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`);

--
-- Constraints for table `Payment`
--
ALTER TABLE `Payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `Booking` (`booking_id`);

--
-- Constraints for table `Saved_Flights`
--
ALTER TABLE `Saved_Flights`
  ADD CONSTRAINT `saved_flights_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`),
  ADD CONSTRAINT `saved_flights_ibfk_2` FOREIGN KEY (`flight_id`) REFERENCES `Flight` (`flight_id`);

--
-- Constraints for table `Seat`
--
ALTER TABLE `Seat`
  ADD CONSTRAINT `seat_ibfk_1` FOREIGN KEY (`aircraft_id`) REFERENCES `Aircraft` (`aircraft_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
