-- 04/13/2025

-- 1) User Table
CREATE TABLE `User` (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(255),
    passport_number VARCHAR(255) UNIQUE,
    role ENUM('customer', 'admin') DEFAULT 'customer'
);

-- 2) Passenger Table (depends on User)
CREATE TABLE Passenger (
    passenger_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(255),
    passport_number VARCHAR(255),
    dob DATE,
    FOREIGN KEY (user_id) REFERENCES `User`(user_id)
);

-- 3) Airport Table
CREATE TABLE Airport (
    airport_id INT AUTO_INCREMENT PRIMARY KEY,
    airport_name VARCHAR(255),
    city VARCHAR(255),
    country VARCHAR(255),
    iata_code VARCHAR(10) UNIQUE,
    icao_code VARCHAR(10) UNIQUE
);

-- 4) Airline Table
CREATE TABLE Airline (
    airline_id INT AUTO_INCREMENT PRIMARY KEY,
    airline_name VARCHAR(255) UNIQUE,
    country VARCHAR(255)
);

-- 5) Aircraft Table (depends on Airline)
CREATE TABLE Aircraft (
    aircraft_id INT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(255),
    total_seats INT,
    airline_id INT,
    FOREIGN KEY (airline_id) REFERENCES Airline(airline_id)
);

-- 6) Flight Table (depends on Airport, Aircraft, Airline)
CREATE TABLE Flight (
    flight_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_number VARCHAR(255) UNIQUE,
    departure_airport_id INT,
    arrival_airport_id INT,
    departure_time DATETIME,
    arrival_time DATETIME,
    aircraft_id INT,
    airline_id INT,
    basic_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (departure_airport_id) REFERENCES Airport(airport_id),
    FOREIGN KEY (arrival_airport_id) REFERENCES Airport(airport_id),
    FOREIGN KEY (aircraft_id) REFERENCES Aircraft(aircraft_id),
    FOREIGN KEY (airline_id) REFERENCES Airline(airline_id)
);

-- 7) Seat Table (depends on Aircraft)
CREATE TABLE Seat (
    seat_id INT AUTO_INCREMENT PRIMARY KEY,
    aircraft_id INT,
    seat_number VARCHAR(4),
    class_type ENUM('Economy', 'Business', 'First'),
    FOREIGN KEY (aircraft_id) REFERENCES Aircraft(aircraft_id),
    UNIQUE (aircraft_id, seat_number)
);

-- 8) Price Table (depends on Flight, Seat) 
-- Moved up so Booking can correctly reference it
CREATE TABLE Price (
    price_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT,
    seat_id INT,
    premium_price DECIMAL(10, 2) NOT NULL,
    status ENUM('Available', 'Booked') DEFAULT 'Available',
    FOREIGN KEY (flight_id) REFERENCES Flight(flight_id),
    FOREIGN KEY (seat_id) REFERENCES Seat(seat_id),
    UNIQUE (flight_id, seat_id)
);

-- 9) Booking Table (depends on User, Passenger, Price)
CREATE TABLE Booking (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    passenger_id INT,
    price_id INT,
    booking_time DATETIME,
    status ENUM('Paid', 'Unpaid', 'Cancelled'),
    FOREIGN KEY (user_id) REFERENCES `User`(user_id),
    FOREIGN KEY (passenger_id) REFERENCES Passenger(passenger_id),
    FOREIGN KEY (price_id) REFERENCES Price(price_id)
);

-- 10) Payment Table (depends on Booking)
CREATE TABLE Payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    payment_method ENUM('Credit Card', 'PayPal', 'Alipay'),
    payment_status ENUM('Completed', 'Pending', 'Failed'),
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id)
);

-- 11) Crew Table (depends on Flight)
CREATE TABLE Crew (
    crew_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT,
    name VARCHAR(255),
    role ENUM('Pilot', 'Co-Pilot', 'Flight Attendant'),
    FOREIGN KEY (flight_id) REFERENCES Flight(flight_id)
);

-- 12) Luggage Table (depends on Booking)
CREATE TABLE Luggage (
    luggage_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    weight DECIMAL(10, 2),
    dimensions VARCHAR(255),
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id)
);

-- 13) Check-in Table (depends on Booking, Seat)
CREATE TABLE Check_in (
    checkin_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    seat_id INT,
    checkin_time DATETIME,
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id),
    FOREIGN KEY (seat_id) REFERENCES Seat(seat_id)
);

-- 14) Boarding Pass Table (depends on Passenger, Flight)
CREATE TABLE Boarding_Pass (
    boarding_pass_id INT AUTO_INCREMENT PRIMARY KEY,
    passenger_id INT,
    flight_id INT,
    seat_number VARCHAR(10),
    boarding_gate VARCHAR(10),
    boarding_time DATETIME,
    FOREIGN KEY (passenger_id) REFERENCES Passenger(passenger_id),
    FOREIGN KEY (flight_id) REFERENCES Flight(flight_id)
);

-- 15) Flight Status Table (depends on Flight)
CREATE TABLE Flight_Status (
    flight_status_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT,
    status ENUM('On-Time', 'Delayed', 'Cancelled'),
    last_updated DATETIME,
    FOREIGN KEY (flight_id) REFERENCES Flight(flight_id)
);

-- 16) Baggage Claim Table (depends on Airport, Flight)
CREATE TABLE Baggage_Claim (
    baggage_claim_id INT AUTO_INCREMENT PRIMARY KEY,
    airport_id INT,
    flight_id INT,
    baggage_belt_number VARCHAR(255),
    FOREIGN KEY (airport_id) REFERENCES Airport(airport_id),
    FOREIGN KEY (flight_id) REFERENCES Flight(flight_id)
);

-- 17) Saved Flights Table (depends on User, Flight)
CREATE TABLE Saved_Flights (
    saved_flight_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    flight_id INT,
    saved_time DATETIME,
    FOREIGN KEY (user_id) REFERENCES `User`(user_id),
    FOREIGN KEY (flight_id) REFERENCES Flight(flight_id)
);
