-- User Table (renamed to avoid reserved keyword)
CREATE TABLE AirlineUser (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(255),
    passport_number VARCHAR(255) UNIQUE,
    role ENUM('customer', 'admin') DEFAULT 'customer'
);

-- Passenger Table (depends on AirlineUser)
CREATE TABLE Passenger (
    passenger_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(255),
    passport_number VARCHAR(255),
    dob DATE,
    FOREIGN KEY (user_id) REFERENCES AirlineUser(user_id)
);

-- Airport Table
CREATE TABLE Airport (
    airport_id INT AUTO_INCREMENT PRIMARY KEY,
    airport_name VARCHAR(255),
    city VARCHAR(255),
    country VARCHAR(255),
    iata_code VARCHAR(10) UNIQUE,
    icao_code VARCHAR(10) UNIQUE
);

-- Airline Table
CREATE TABLE Airline (
    airline_id INT AUTO_INCREMENT PRIMARY KEY,
    airline_name VARCHAR(255) UNIQUE,
    country VARCHAR(255)
);

-- Aircraft Table (depends on Airline)
CREATE TABLE Aircraft (
    aircraft_id INT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(255),
    total_seats INT,
    airline_id INT,
    FOREIGN KEY (airline_id) REFERENCES Airline(airline_id)
);

-- Flight Table (depends on Airport, Aircraft, Airline)
CREATE TABLE Flight (
    flight_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_number VARCHAR(255) UNIQUE,
    departure_airport_id INT,
    arrival_airport_id INT,
    departure_time DATETIME,
    arrival_time DATETIME,
    aircraft_id INT,
    airline_id INT,
    basic_price DECIMAL(10, 2) NOT NULL, -- Base price for the flight
    FOREIGN KEY (departure_airport_id) REFERENCES Airport(airport_id),
    FOREIGN KEY (arrival_airport_id) REFERENCES Airport(airport_id),
    FOREIGN KEY (aircraft_id) REFERENCES Aircraft(aircraft_id),
    FOREIGN KEY (airline_id) REFERENCES Airline(airline_id)
);

-- Seat Table (depends on Aircraft)
CREATE TABLE Seat (
    seat_id INT AUTO_INCREMENT PRIMARY KEY,
    aircraft_id INT,
    seat_number VARCHAR(4),
    class_type ENUM('Economy', 'Business', 'First'),
    FOREIGN KEY (aircraft_id) REFERENCES Aircraft(aircraft_id),
    UNIQUE (aircraft_id, seat_number)
);

-- Price Table (links Flight and Seat with a specific price)
CREATE TABLE Price (
    price_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT,
    seat_id INT,
    premium_price DECIMAL(10, 2) NOT NULL,
    status ENUM('Available', 'Booked') DEFAULT 'Available',
    FOREIGN KEY (flight_id) REFERENCES Flight(flight_id),
    FOREIGN KEY (seat_id) REFERENCES Seat(seat_id),
    UNIQUE (flight_id, seat_id) -- Ensures each seat is unique for a specific flight
);

-- Booking Table (depends on AirlineUser, Passenger, Flight, Seat)
CREATE TABLE Booking (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    passenger_id INT,
    price_id INT,
    booking_time DATETIME,
    status ENUM('Paid', 'Unpaid', 'Cancelled'),
    FOREIGN KEY (user_id) REFERENCES AirlineUser(user_id),
    FOREIGN KEY (passenger_id) REFERENCES Passenger(passenger_id),
    FOREIGN KEY (price_id) REFERENCES Price(price_id)
);

-- Payment Table (depends on Booking)
CREATE TABLE Payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    payment_method ENUM('Credit Card', 'PayPal', 'Alipay'),
    payment_status ENUM('Completed', 'Pending', 'Failed'),
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id)
);

-- Crew Table (depends on Flight)
CREATE TABLE Crew (
    crew_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT,
    name VARCHAR(255),
    role ENUM('Pilot', 'Co-Pilot', 'Flight Attendant'),
    FOREIGN KEY (flight_id) REFERENCES Flight(flight_id)
);

-- Luggage Table (depends on Booking)
CREATE TABLE Luggage (
    luggage_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    weight DECIMAL(10, 2),
    dimensions VARCHAR(255),
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id)
);

-- Check-in Table (depends on Booking, Seat)
CREATE TABLE Check_in (
    checkin_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    seat_id INT,
    checkin_time DATETIME,
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id),
    FOREIGN KEY (seat_id) REFERENCES Seat(seat_id)
);

-- Boarding Pass Table (depends on Passenger, Flight)
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

-- Flight Status Table (depends on Flight)
CREATE TABLE Flight_Status (
    flight_status_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT,
    status ENUM('On-Time', 'Delayed', 'Cancelled'),
    last_updated DATETIME,
    FOREIGN KEY (flight_id) REFERENCES Flight(flight_id)
);

-- Baggage Claim Table (depends on Airport, Flight)
CREATE TABLE Baggage_Claim (
    baggage_claim_id INT AUTO_INCREMENT PRIMARY KEY,
    airport_id INT,
    flight_id INT,
    baggage_belt_number VARCHAR(255),
    FOREIGN KEY (airport_id) REFERENCES Airport(airport_id),
    FOREIGN KEY (flight_id) REFERENCES Flight(flight_id)
);

-- Saved Flights Table (depends on AirlineUser, Flight)
CREATE TABLE Saved_Flights (
    saved_flight_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    flight_id INT,
    saved_time DATETIME,
    FOREIGN KEY (user_id) REFERENCES AirlineUser(user_id),
    FOREIGN KEY (flight_id) REFERENCES Flight(flight_id)
);

-- Insert data into AirlineUser table (renamed from User)
INSERT INTO AirlineUser (password, name, email, phone, passport_number, role) VALUES
('hashed_pwd1', 'John Smith', 'john.smith@email.com', '+1-555-123-4567', 'US123456', 'customer'),
('hashed_pwd2', 'Emma Johnson', 'emma.johnson@email.com', '+1-555-234-5678', 'US234567', 'customer'),
('hashed_pwd3', 'Michael Brown', 'michael.brown@email.com', '+1-555-345-6789', 'US345678', 'customer'),
('hashed_pwd4', 'Olivia Davis', 'olivia.davis@email.com', '+1-555-456-7890', 'US456789', 'customer'),
('hashed_pwd5', 'William Wilson', 'william.wilson@email.com', '+1-555-567-8901', 'US567890', 'customer'),
('hashed_pwd6', 'Sophia Martinez', 'sophia.martinez@email.com', '+1-555-678-9012', 'US678901', 'customer'),
('hashed_pwd7', 'James Anderson', 'james.anderson@email.com', '+1-555-789-0123', 'US789012', 'customer'),
('hashed_pwd8', 'Isabella Thomas', 'isabella.thomas@email.com', '+1-555-890-1234', 'US890123', 'customer'),
('hashed_pwd9', 'Alexander White', 'alexander.white@email.com', '+1-555-901-2345', 'US901234', 'customer'),
('hashed_pwd10', 'Charlotte Harris', 'charlotte.harris@email.com', '+1-555-012-3456', 'US012345', 'customer'),
('hashed_pwd11', 'Daniel Clark', 'daniel.clark@email.com', '+44-20-1234-5678', 'UK123456', 'customer'),
('hashed_pwd12', 'Mia Lewis', 'mia.lewis@email.com', '+44-20-2345-6789', 'UK234567', 'customer'),
('hashed_pwd13', 'Ethan Lee', 'ethan.lee@email.com', '+86-10-1234-5678', 'CN123456', 'customer'),
('hashed_pwd14', 'Amelia Walker', 'amelia.walker@email.com', '+86-10-2345-6789', 'CN234567', 'customer'),
('hashed_pwd15', 'Benjamin Hall', 'benjamin.hall@email.com', '+33-1-2345-6789', 'FR123456', 'customer'),
('hashed_pwd16', 'Harper Young', 'harper.young@email.com', '+33-1-3456-7890', 'FR234567', 'customer'),
('hashed_pwd17', 'Lucas King', 'lucas.king@email.com', '+49-30-1234-5678', 'DE123456', 'customer'),
('hashed_pwd18', 'Evelyn Wright', 'evelyn.wright@email.com', '+49-30-2345-6789', 'DE234567', 'customer'),
('hashed_admin1', 'Admin User1', 'admin1@airline.com', '+1-555-111-0000', 'AD000001', 'admin'),
('hashed_admin2', 'Admin User2', 'admin2@airline.com', '+1-555-222-0000', 'AD000002', 'admin');

-- Insert data into Airport table
INSERT INTO Airport (airport_name, city, country, iata_code, icao_code) VALUES
('Hartsfield-Jackson Atlanta Int\'l', 'Atlanta', 'USA', 'ATL', 'KATL'),
('Beijing Capital International', 'Beijing', 'China', 'PEK', 'ZBAA'),
('Los Angeles International', 'Los Angeles', 'USA', 'LAX', 'KLAX'),
('Haneda Airport', 'Tokyo', 'Japan', 'HND', 'RJTT'),
('Heathrow Airport', 'London', 'United Kingdom', 'LHR', 'EGLL'),
('O\'Hare International', 'Chicago', 'USA', 'ORD', 'KORD'),
('Shanghai Pudong International', 'Shanghai', 'China', 'PVG', 'ZSPD'),
('Charles de Gaulle Airport', 'Paris', 'France', 'CDG', 'LFPG'),
('Dallas/Fort Worth International', 'Dallas', 'USA', 'DFW', 'KDFW'),
('Frankfurt Airport', 'Frankfurt', 'Germany', 'FRA', 'EDDF'),
('Hong Kong International', 'Hong Kong', 'Hong Kong', 'HKG', 'VHHH'),
('Denver International', 'Denver', 'USA', 'DEN', 'KDEN'),
('Incheon International', 'Seoul', 'South Korea', 'ICN', 'RKSI'),
('Dubai International', 'Dubai', 'UAE', 'DXB', 'OMDB'),
('Singapore Changi', 'Singapore', 'Singapore', 'SIN', 'WSSS'),
('Amsterdam Schiphol', 'Amsterdam', 'Netherlands', 'AMS', 'EHAM'),
('John F. Kennedy International', 'New York', 'USA', 'JFK', 'KJFK'),
('Madrid-Barajas', 'Madrid', 'Spain', 'MAD', 'LEMD'),
('Sydney Airport', 'Sydney', 'Australia', 'SYD', 'YSSY'),
('Munich Airport', 'Munich', 'Germany', 'MUC', 'EDDM');

-- Insert data into Airline table
INSERT INTO Airline (airline_name, country) VALUES
('Delta Air Lines', 'USA'),
('Air China', 'China'),
('United Airlines', 'USA'),
('All Nippon Airways', 'Japan'),
('British Airways', 'United Kingdom'),
('American Airlines', 'USA'),
('China Eastern Airlines', 'China'),
('Air France', 'France'),
('Southwest Airlines', 'USA'),
('Lufthansa', 'Germany'),
('Cathay Pacific', 'Hong Kong'),
('Frontier Airlines', 'USA'),
('Korean Air', 'South Korea'),
('Emirates', 'UAE'),
('Singapore Airlines', 'Singapore'),
('KLM Royal Dutch Airlines', 'Netherlands'),
('JetBlue Airways', 'USA'),
('Iberia', 'Spain'),
('Qantas', 'Australia'),
('Air Canada', 'Canada');

-- Insert data into Passenger table
INSERT INTO Passenger (user_id, name, passport_number, dob) VALUES
(1, 'John Smith', 'US123456', '1985-03-15'),
(2, 'Emma Johnson', 'US234567', '1990-07-22'),
(3, 'Michael Brown', 'US345678', '1978-11-05'),
(4, 'Olivia Davis', 'US456789', '1992-01-18'),
(5, 'William Wilson', 'US567890', '1980-09-30'),
(6, 'Sophia Martinez', 'US678901', '1995-06-12'),
(7, 'James Anderson', 'US789012', '1982-04-24'),
(8, 'Isabella Thomas', 'US890123', '1998-08-07'),
(9, 'Alexander White', 'US901234', '1975-12-29'),
(10, 'Charlotte Harris', 'US012345', '1988-02-11'),
(11, 'Daniel Clark', 'UK123456', '1983-05-17'),
(12, 'Mia Lewis', 'UK234567', '1993-10-03'),
(13, 'Ethan Lee', 'CN123456', '1979-07-25'),
(14, 'Amelia Walker', 'CN234567', '1997-04-09'),
(15, 'Benjamin Hall', 'FR123456', '1981-01-21'),
(1, 'Sarah Smith', 'US123457', '2010-06-15'), -- John's family member
(2, 'David Johnson', 'US234568', '2012-08-22'), -- Emma's family member
(3, 'Lisa Brown', 'US345679', '1980-03-05'), -- Michael's family member
(4, 'Robert Davis', 'US456790', '1990-11-18'), -- Olivia's family member
(5, 'Emily Wilson', 'US567891', '2015-09-30'); -- William's family member

-- Insert data into Aircraft table
INSERT INTO Aircraft (model, total_seats, airline_id) VALUES
('Boeing 737-800', 175, 1), -- Delta
('Airbus A330-300', 300, 1), -- Delta
('Boeing 777-300ER', 396, 2), -- Air China
('Airbus A320neo', 186, 2), -- Air China
('Boeing 787-9', 252, 3), -- United
('Boeing 767-300ER', 214, 3), -- United
('Boeing 787-8', 234, 4), -- ANA
('Airbus A380-800', 469, 5), -- British Airways
('Boeing 737-900ER', 179, 6), -- American Airlines
('Airbus A321neo', 196, 6), -- American Airlines
('Airbus A350-900', 314, 7), -- China Eastern
('Boeing 737 MAX 8', 172, 8), -- Air France
('Boeing 737-700', 143, 9), -- Southwest
('Airbus A340-600', 326, 10), -- Lufthansa
('Boeing 777-300', 386, 11), -- Cathay Pacific
('Airbus A320', 168, 12), -- Frontier
('Boeing 747-8', 410, 13), -- Korean Air
('Airbus A380-800', 489, 14), -- Emirates
('Boeing 787-10', 337, 15), -- Singapore Airlines
('Boeing 777-200ER', 312, 16); -- KLM

-- Insert data into Seat table
INSERT INTO Seat (aircraft_id, seat_number, class_type) VALUES
-- Aircraft 1 (Boeing 737-800) seats
(1, '1A', 'First'),
(1, '1B', 'First'),
(1, '2A', 'First'),
(1, '2B', 'First'),
(1, '10A', 'Business'),
(1, '10B', 'Business'),
(1, '10C', 'Business'),
(1, '11A', 'Business'),
(1, '11B', 'Business'),
(1, '11C', 'Business'),
(1, '20A', 'Economy'),
(1, '20B', 'Economy'),
(1, '20C', 'Economy'),
(1, '21A', 'Economy'),
(1, '21B', 'Economy'),
(1, '21C', 'Economy'),
-- Aircraft 2 (Airbus A330-300) seats
(2, '1A', 'First'),
(2, '1B', 'First'),
(2, '1C', 'First'),
(2, '2A', 'First');

-- Insert data into Flight table
INSERT INTO Flight (flight_number, departure_airport_id, arrival_airport_id, departure_time, arrival_time, aircraft_id, airline_id, basic_price) VALUES
('DL001', 1, 5, '2025-04-20 08:00:00', '2025-04-20 22:00:00', 1, 1, 450.00),
('DL002', 5, 1, '2025-04-21 10:00:00', '2025-04-21 14:00:00', 2, 1, 480.00),
('AC001', 3, 2, '2025-04-20 09:30:00', '2025-04-21 02:30:00', 3, 2, 700.00),
('AC002', 2, 3, '2025-04-21 06:00:00', '2025-04-21 11:00:00', 4, 2, 650.00),
('UA001', 6, 7, '2025-04-20 11:15:00', '2025-04-21 04:15:00', 5, 3, 720.00),
('UA002', 7, 6, '2025-04-21 07:45:00', '2025-04-21 12:45:00', 6, 3, 680.00),
('NH001', 4, 13, '2025-04-20 00:30:00', '2025-04-20 03:30:00', 7, 4, 320.00),
('BA001', 5, 8, '2025-04-20 13:00:00', '2025-04-20 15:30:00', 8, 5, 220.00),
('AA001', 9, 17, '2025-04-20 15:45:00', '2025-04-21 00:15:00', 9, 6, 550.00),
('AA002', 17, 9, '2025-04-21 02:30:00', '2025-04-21 11:00:00', 10, 6, 530.00),
('MU001', 7, 11, '2025-04-20 16:20:00', '2025-04-20 20:00:00', 11, 7, 280.00),
('AF001', 8, 16, '2025-04-20 18:10:00', '2025-04-20 19:30:00', 12, 8, 190.00),
('WN001', 12, 3, '2025-04-20 07:00:00', '2025-04-20 09:30:00', 13, 9, 210.00),
('LH001', 10, 20, '2025-04-20 10:45:00', '2025-04-20 11:45:00', 14, 10, 160.00),
('CX001', 11, 14, '2025-04-20 23:15:00', '2025-04-21 05:45:00', 15, 11, 490.00),
('F9001', 12, 6, '2025-04-20 14:30:00', '2025-04-20 17:00:00', 16, 12, 185.00),
('KE001', 13, 4, '2025-04-20 12:00:00', '2025-04-20 14:30:00', 17, 13, 240.00),
('EK001', 14, 15, '2025-04-20 01:30:00', '2025-04-20 07:30:00', 18, 14, 420.00),
('SQ001', 15, 19, '2025-04-20 22:00:00', '2025-04-21 09:00:00', 19, 15, 760.00),
('KL001', 16, 10, '2025-04-20 19:45:00', '2025-04-20 21:15:00', 20, 16, 230.00);

-- Insert data into Price table
INSERT INTO Price (flight_id, seat_id, premium_price, status) VALUES
(1, 1, 950.00, 'Available'),
(1, 2, 950.00, 'Available'),
(1, 5, 650.00, 'Available'),
(1, 6, 650.00, 'Available'),
(1, 11, 450.00, 'Available'),
(1, 12, 450.00, 'Available'),
(2, 17, 980.00, 'Available'),
(2, 18, 980.00, 'Available'),
(2, 19, 980.00, 'Available'),
(2, 20, 980.00, 'Booked'),
(3, 1, 1200.00, 'Available'),
(3, 5, 900.00, 'Booked'),
(4, 2, 1150.00, 'Available'),
(4, 6, 850.00, 'Available'),
(5, 3, 1220.00, 'Booked'),
(5, 7, 920.00, 'Available'),
(6, 4, 1180.00, 'Available'),
(6, 8, 880.00, 'Booked'),
(7, 9, 620.00, 'Available'),
(8, 10, 520.00, 'Available');

-- Insert data into Booking table
INSERT INTO Booking (user_id, passenger_id, price_id, booking_time, status) VALUES
(1, 1, 5, '2025-04-01 10:30:00', 'Paid'),
(1, 16, 6, '2025-04-01 10:30:00', 'Paid'),
(2, 2, 10, '2025-04-02 14:45:00', 'Paid'),
(3, 3, 12, '2025-04-03 09:15:00', 'Paid'),
(3, 18, 15, '2025-04-03 09:15:00', 'Paid'),
(4, 4, 8, '2025-04-04 16:20:00', 'Unpaid'),
(4, 19, 18, '2025-04-04 16:20:00', 'Unpaid'),
(5, 5, 20, '2025-04-05 11:10:00', 'Cancelled'),
(5, 20, 7, '2025-04-05 11:10:00', 'Cancelled'),
(6, 6, 1, '2025-04-06 08:30:00', 'Paid'),
(7, 7, 2, '2025-04-07 13:40:00', 'Paid'),
(8, 8, 3, '2025-04-08 15:25:00', 'Unpaid'),
(9, 9, 4, '2025-04-09 10:05:00', 'Paid'),
(10, 10, 9, '2025-04-10 17:50:00', 'Paid'),
(11, 11, 11, '2025-04-11 14:15:00', 'Paid'),
(12, 12, 13, '2025-04-12 09:30:00', 'Unpaid'),
(13, 13, 14, '2025-04-13 11:45:00', 'Paid'),
(14, 14, 16, '2025-04-14 16:00:00', 'Paid'),
(15, 15, 17, '2025-04-15 12:20:00', 'Paid'),
(1, 16, 19, '2025-04-16 10:35:00', 'Unpaid');

-- Insert data into Payment table
INSERT INTO Payment (booking_id, payment_method, payment_status) VALUES
(1, 'Credit Card', 'Completed'),
(2, 'Credit Card', 'Completed'),
(3, 'PayPal', 'Completed'),
(4, 'Alipay', 'Completed'),
(5, 'Credit Card', 'Completed'),
(6, 'Credit Card', 'Pending'),
(7, 'Credit Card', 'Failed'),
(8, 'PayPal', 'Pending'),
(9, 'Credit Card', 'Completed'),
(10, 'Alipay', 'Completed'),
(11, 'Credit Card', 'Completed'),
(12, 'PayPal', 'Completed'),
(13, 'Alipay', 'Completed'),
(14, 'Credit Card', 'Pending'),
(15, 'PayPal', 'Completed'),
(16, 'Credit Card', 'Pending'),
(17, 'Credit Card', 'Completed'),
(18, 'Alipay', 'Completed'),
(19, 'PayPal', 'Completed'),
(20, 'Credit Card', 'Pending');

-- Insert data into Crew table
INSERT INTO Crew (flight_id, name, role) VALUES
(1, 'David Miller', 'Pilot'),
(1, 'Jennifer Wilson', 'Co-Pilot'),
(1, 'Robert Taylor', 'Flight Attendant'),
(1, 'Amanda Johnson', 'Flight Attendant'),
(1, 'Thomas Brown', 'Flight Attendant'),
(2, 'Michael Chen', 'Pilot'),
(2, 'Sarah Adams', 'Co-Pilot'),
(2, 'Jessica Lee', 'Flight Attendant'),
(2, 'Brian Wilson', 'Flight Attendant'),
(3, 'James Wang', 'Pilot'),
(3, 'Emily Zhang', 'Co-Pilot'),
(3, 'Daniel Liu', 'Flight Attendant'),
(3, 'Olivia Chen', 'Flight Attendant'),
(3, 'William Wu', 'Flight Attendant'),
(4, 'John Li', 'Pilot'),
(4, 'Maria Huang', 'Co-Pilot'),
(4, 'Christopher Zhao', 'Flight Attendant'),
(4, 'Emma Lin', 'Flight Attendant'),
(5, 'Richard Johnson', 'Pilot'),
(5, 'Lisa Martinez', 'Co-Pilot');

-- Insert data into Luggage table
INSERT INTO Luggage (booking_id, weight, dimensions) VALUES
(1, 23.5, '56x45x25'),
(1, 18.2, '50x40x20'),
(2, 25.0, '60x45x28'),
(3, 19.8, '55x40x23'),
(4, 22.3, '58x42x24'),
(5, 15.7, '50x35x20'),
(6, 27.9, '62x48x30'),
(7, 21.5, '57x43x25'),
(8, 18.6, '52x38x22'),
(9, 24.1, '59x44x27'),
(10, 16.8, '51x37x21'),
(11, 20.3, '55x42x24'),
(12, 26.5, '61x47x29'),
(13, 17.9, '53x39x23'),
(14, 22.7, '58x43x26'),
(15, 19.2, '54x41x22'),
(16, 25.8, '60x46x28'),
(17, 14.6, '48x34x19'),
(18, 23.3, '57x44x26'),
(19, 20.9, '56x42x25');

-- Insert data into Check_in table
INSERT INTO Check_in (booking_id, seat_id, checkin_time) VALUES
(1, 11, '2025-04-20 05:30:00'),
(2, 12, '2025-04-20 05:45:00'),
(3, 20, '2025-04-20 07:00:00'),
(4, 5, '2025-04-19 20:15:00'),
(5, 3, '2025-04-20 08:30:00'),
(10, 1, '2025-04-20 06:15:00'),
(11, 2, '2025-04-20 06:20:00'),
(13, 14, '2025-04-20 10:00:00'),
(17, 4, '2025-04-20 09:45:00'),
(19, 17, '2025-04-20 08:10:00'),
(9, 6, '2025-04-20 05:55:00'),
(12, 7, '2025-04-20 10:30:00'),
(15, 8, '2025-04-20 11:15:00'),
(18, 9, '2025-04-19 22:45:00'),
(14, 10, '2025-04-20 12:30:00'),
(6, 13, '2025-04-20 08:20:00'),
(7, 15, '2025-04-20 10:10:00'),
(8, 16, '2025-04-20 07:50:00'),
(16, 18, '2025-04-20 08:05:00'),
(20, 19, '2025-04-20 09:25:00');

-- Insert data into Boarding_Pass table
INSERT INTO Boarding_Pass (passenger_id, flight_id, seat_number, boarding_gate, boarding_time) VALUES
(1, 1, '20A', 'A12', '2025-04-20 07:15:00'),
(16, 1, '21A', 'A12', '2025-04-20 07:15:00'),
(2, 2, '1A', 'B5', '2025-04-21 09:15:00'),
(3, 3, '10A', 'C7', '2025-04-20 08:45:00'),
(18, 5, '2A', 'D3', '2025-04-20 10:30:00'),
(6, 1, '1A', 'A12', '2025-04-20 07:15:00'),
(7, 1, '1B', 'A12', '2025-04-20 07:15:00'),
(9, 1, '10B', 'A12', '2025-04-20 07:15:00'),
(11, 3, '1A', 'C7', '2025-04-20 08:45:00'),
(13, 4, '2B', 'E9', '2025-04-21 05:15:00'),
(15, 6, '10C', 'F2', '2025-04-21 07:00:00'),
(4, 2, '1B', 'B5', '2025-04-21 09:15:00'),
(5, 8, '11A', 'G6', '2025-04-20 12:15:00'),
(8, 3, '20B', 'C7', '2025-04-20 08:45:00'),
(10, 9, '11B', 'H4', '2025-04-20 15:00:00'),
(12, 4, '10C', 'E9', '2025-04-21 05:15:00'),
(14, 6, '11B', 'F2', '2025-04-21 07:00:00'),
(17, 7, '20C', 'J8', '2025-04-19 23:45:00'),
(19, 10, '21B', 'K1', '2025-04-21 01:45:00'),
(20, 2, '1C', 'B5', '2025-04-21 09:15:00');

-- Insert data into Flight_Status table
INSERT INTO Flight_Status (flight_id, status, last_updated) VALUES
(1, 'On-Time', '2025-04-20 07:30:00'),
(2, 'On-Time', '2025-04-21 09:30:00'),
(3, 'Delayed', '2025-04-20 08:15:00'),
(4, 'On-Time', '2025-04-21 05:45:00'),
(5, 'On-Time', '2025-04-20 10:45:00'),
(6, 'Delayed', '2025-04-21 07:15:00'),
(7, 'On-Time', '2025-04-20 00:15:00'),
(8, 'On-Time', '2025-04-20 12:45:00'),
(9, 'Delayed', '2025-04-20 14:30:00'),
(10, 'On-Time', '2025-04-21 02:15:00'),
(11, 'On-Time', '2025-04-20 16:00:00'),
(12, 'On-Time', '2025-04-20 17:45:00'),
(13, 'Delayed', '2025-04-20 06:30:00'),
(14, 'On-Time', '2025-04-20 10:30:00'),
(15, 'On-Time', '2025-04-20 23:00:00'),
(16, 'Cancelled', '2025-04-20 13:00:00'),
(17, 'On-Time', '2025-04-20 11:45:00'),
(18, 'Delayed', '2025-04-20 01:00:00'),
(19, 'On-Time', '2025-04-20 21:45:00'),
(20, 'On-Time', '2025-04-20 19:30:00');

-- Insert data into Baggage_Claim table
INSERT INTO Baggage_Claim (airport_id, flight_id, baggage_belt_number) VALUES
(5, 1, 'B3'),
(1, 2, 'A5'),
(2, 3, 'C2'),
(3, 4, 'D7'),
(7, 5, 'E1'),
(6, 6, 'F9'),
(13, 7, 'G4'),
(8, 8, 'H6'),
(17, 9, 'J2'),
(9, 10, 'K8'),
(11, 11, 'L3'),
(16, 12, 'M5'),
(3, 13, 'N1'),
(20, 14, 'P6'),
(14, 15, 'Q9'),
(6, 16, 'R2'),
(4, 17, 'S7'),
(15, 18, 'T4'),
(19, 19, 'U8'),
(10, 20, 'V3');

-- Insert data into Saved_Flights table
INSERT INTO Saved_Flights (user_id, flight_id, saved_time) VALUES
(1, 3, '2025-03-25 09:15:00'),
(1, 5, '2025-03-26 14:30:00'),
(2, 7, '2025-03-27 11:45:00'),
(3, 9, '2025-03-28 16:20:00'),
(4, 11, '2025-03-29 10:05:00'),
(5, 13, '2025-03-30 13:40:00'),
(6, 15, '2025-03-31 08:55:00'),
(7, 17, '2025-04-01 15:10:00'),
(8, 19, '2025-04-02 12:25:00'),
(9, 2, '2025-04-03 17:35:00'),
(10, 4, '2025-04-04 09:50:00'),
(11, 6, '2025-04-05 14:05:00'),
(12, 8, '2025-04-06 11:20:00'),
(13, 10, '2025-04-07 16:30:00'),
(14, 12, '2025-04-08 10:45:00'),
(15, 14, '2025-04-09 13:15:00'),
(1, 16, '2025-04-10 08:40:00'),
(2, 18, '2025-04-11 15:55:00'),
(3, 20, '2025-04-12 12:10:00'),
(4, 1, '2025-04-13 17:25:00');