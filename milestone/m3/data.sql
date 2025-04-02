-- Insert data into User table
INSERT INTO User (name, email, phone, passport_number) VALUES
('John Doe', 'johndoe@example.com', '555-0100', 'A1234567'),
('Jane Smith', 'janesmith@example.com', '555-0101', 'A1234568'),
('Alice Johnson', 'alicejohnson@example.com', '555-0102', 'A1234569'),
('Bob Brown', 'bobbrown@example.com', '555-0103', 'A1234570'),
('Charlie Davis', 'charliedavis@example.com', '555-0104', 'A1234571'),
('Daisy Miller', 'daisymiller@example.com', '555-0105', 'A1234572'),
('Ella White', 'ellawhite@example.com', '555-0106', 'A1234573'),
('Frank Green', 'frankgreen@example.com', '555-0107', 'A1234574'),
('Grace Hall', 'gracehall@example.com', '555-0108', 'A1234575'),
('Harry Lee', 'harrylee@example.com', '555-0109', 'A1234576');

-- Insert data into Passenger table
INSERT INTO Passenger (user_id, name, passport_number, dob) VALUES
(1, 'John Doe Jr.', 'B1234567', '2000-01-01'),
(1, 'Emily Doe', 'B1234568', '2002-02-02'),
(2, 'Michael Smith', 'B1234569', '2001-03-03'),
(2, 'Rachel Smith', 'B1234570', '2003-04-04'),
(3, 'Laura Johnson', 'B1234571', '2005-05-05'),
(3, 'Kevin Johnson', 'B1234572', '2006-06-06'),
(4, 'Sarah Brown', 'B1234573', '2007-07-07'),
(5, 'Zoe Davis', 'B1234574', '2008-08-08'),
(6, 'Oliver Miller', 'B1234575', '2009-09-09'),
(7, 'Isabella White', 'B1234576', '2010-10-10');

-- Insert data into Airport table
INSERT INTO Airport (airport_name, city, country, iata_code, icao_code) VALUES
('JFK International Airport', 'New York', 'USA', 'JFK', 'KJFK'),
('Los Angeles International Airport', 'Los Angeles', 'USA', 'LAX', 'KLAX'),
('Heathrow Airport', 'London', 'UK', 'LHR', 'EGLL'),
('Charles de Gaulle Airport', 'Paris', 'France', 'CDG', 'LFPG'),
('Frankfurt Airport', 'Frankfurt', 'Germany', 'FRA', 'EDDF'),
('Narita International Airport', 'Tokyo', 'Japan', 'NRT', 'RJAA'),
('Beijing Capital International Airport', 'Beijing', 'China', 'PEK', 'ZBAA'),
('Dubai International Airport', 'Dubai', 'UAE', 'DXB', 'OMDB'),
('Sydney Airport', 'Sydney', 'Australia', 'SYD', 'YSSY'),
('Sao Paulo Guarulhos International Airport', 'Sao Paulo', 'Brazil', 'GRU', 'SBGR');

-- Insert data into Airline table
INSERT INTO Airline (airline_name, country) VALUES
('American Airlines', 'USA'),
('Delta Air Lines', 'USA'),
('United Airlines', 'USA'),
('Southwest Airlines', 'USA'),
('Air France', 'France'),
('Lufthansa', 'Germany'),
('British Airways', 'UK'),
('Qantas Airways', 'Australia'),
('Emirates', 'UAE'),
('Cathay Pacific', 'Hong Kong');

-- Insert data into Aircraft table
INSERT INTO Aircraft (model, total_seats, airline_id) VALUES
('Boeing 737', 5, 1),
('Airbus A320', 5, 2),
('Boeing 777', 5, 3),
('Airbus A380', 5, 4),
('Boeing 787 Dreamliner', 5, 5),
('Airbus A350', 5, 6),
('Boeing 737 MAX', 5, 7),
('Airbus A330', 5, 8),
('Embraer E190', 5, 9),
('Bombardier CRJ1000', 5, 10);

-- Insert data into Flight table
INSERT INTO Flight (flight_number, departure_airport_id, arrival_airport_id, departure_time, arrival_time, aircraft_id, airline_id) VALUES
('FL100', 1, 2, '2021-01-01 08:00:00', '2021-01-01 11:00:00', 1, 1),
('FL101', 2, 3, '2021-01-02 09:00:00', '2021-01-02 14:00:00', 2, 2),
('FL102', 3, 4, '2021-01-03 07:00:00', '2021-01-03 10:00:00', 3, 3),
('FL103', 4, 5, '2021-01-04 10:00:00', '2021-01-04 15:00:00', 4, 4),
('FL104', 5, 6, '2021-01-05 06:00:00', '2021-01-05 09:00:00', 5, 5),
('FL105', 6, 7, '2021-01-06 12:00:00', '2021-01-06 17:00:00', 6, 6),
('FL106', 7, 8, '2021-01-07 13:00:00', '2021-01-07 16:00:00', 7, 7),
('FL107', 8, 9, '2021-01-08 14:00:00', '2021-01-08 19:00:00', 8, 8),
('FL108', 9, 10, '2021-01-09 15:00:00', '2021-01-09 18:00:00', 9, 9),
('FL109', 10, 1, '2021-01-10 16:00:00', '2021-01-10 21:00:00', 10, 10);

-- Insert data into Seat table
INSERT INTO Seat (aircraft_id, seat_number, class_type, price) VALUES
(1, 'A1', 'Economy', 200),
(1, 'A2', 'Economy', 200),
(1, 'A3', 'Economy', 200),
(1, 'A4', 'Economy', 200),
(1, 'A5', 'Economy', 200),
(2, 'A1', 'Business', 500),
(2, 'A2', 'Business', 500),
(2, 'A3', 'Business', 500),
(2, 'A4', 'Business', 500),
(2, 'A5', 'Business', 500);

-- Insert data into Booking table
INSERT INTO Booking (user_id, flight_id, seat_id, booking_time, status) VALUES
(1, 1, 1, '2023-03-01 08:00:00', 'Paid'),
(2, 2, 2, '2023-03-02 09:00:00', 'Paid'),
(3, 3, 3, '2023-03-03 10:00:00', 'Paid'),
(4, 4, 4, '2023-03-04 11:00:00', 'Paid'),
(5, 5, 5, '2023-03-05 12:00:00', 'Paid'),
(6, 6, 6, '2023-03-06 13:00:00', 'Paid'),
(7, 7, 7, '2023-03-07 14:00:00', 'Paid'),
(8, 8, 8, '2023-03-08 15:00:00', 'Paid'),
(9, 9, 9, '2023-03-09 16:00:00', 'Paid'),
(10, 10, 10, '2023-03-10 17:00:00', 'Paid');

-- Insert data into Payment table
INSERT INTO Payment (booking_id, payment_method, payment_status) VALUES
(1, 'Credit Card', 'Completed'),
(2, 'PayPal', 'Completed'),
(3, 'Credit Card', 'Completed'),
(4, 'Alipay', 'Completed'),
(5, 'Credit Card', 'Completed'),
(6, 'Credit Card', 'Completed'),
(7, 'PayPal', 'Completed'),
(8, 'Credit Card', 'Completed'),
(9, 'Alipay', 'Completed'),
(10, 'Credit Card', 'Completed');

-- Insert data into Crew table
INSERT INTO Crew (flight_id, name, role) VALUES
(1, 'Captain Morgan', 'Pilot'),
(2, 'First Officer Smith', 'Co-Pilot'),
(3, 'Captain Lee', 'Pilot'),
(4, 'First Officer Clark', 'Co-Pilot'),
(5, 'Captain Wright', 'Pilot'),
(6, 'First Officer Taylor', 'Co-Pilot'),
(7, 'Captain Adams', 'Pilot'),
(8, 'First Officer Black', 'Co-Pilot'),
(9, 'Captain White', 'Pilot'),
(10, 'First Officer Stone', 'Co-Pilot');

-- Insert data into Luggage table
INSERT INTO Luggage (booking_id, weight, dimensions) VALUES
(1, 23, '22x14x9'),
(2, 15, '20x10x8'),
(3, 30, '24x15x10'),
(4, 20, '22x14x9'),
(5, 25, '22x14x9'),
(6, 18, '20x10x8'),
(7, 17, '20x10x8'),
(8, 22, '22x14x9'),
(9, 16, '20x10x8'),
(10, 28, '24x15x10');

-- Insert data into Check_in table
INSERT INTO Check_in (booking_id, seat_id, checkin_time) VALUES
(1, 1, '2023-03-01 06:00:00'),
(2, 2, '2023-03-02 07:00:00'),
(3, 3, '2023-03-03 08:00:00'),
(4, 4, '2023-03-04 09:00:00'),
(5, 5, '2023-03-05 10:00:00'),
(6, 6, '2023-03-06 11:00:00'),
(7, 7, '2023-03-07 12:00:00'),
(8, 8, '2023-03-08 13:00:00'),
(9, 9, '2023-03-09 14:00:00'),
(10, 10, '2023-03-10 15:00:00');

-- Insert data into Boarding_Pass table
INSERT INTO Boarding_Pass (passenger_id, flight_id, seat_number, boarding_gate, boarding_time) VALUES
(1, 1, 'A1', 'Gate 1', '2023-03-01 07:30:00'),
(2, 2, 'A1', 'Gate 2', '2023-03-02 08:30:00'),
(3, 3, 'A1', 'Gate 3', '2023-03-03 09:30:00'),
(4, 4, 'A1', 'Gate 4', '2023-03-04 10:30:00'),
(5, 5, 'A1', 'Gate 5', '2023-03-05 11:30:00'),
(6, 6, 'A1', 'Gate 6', '2023-03-06 12:30:00'),
(7, 7, 'A1', 'Gate 7', '2023-03-07 13:30:00'),
(8, 8, 'A1', 'Gate 8', '2023-03-08 14:30:00'),
(9, 9, 'A1', 'Gate 9', '2023-03-09 15:30:00'),
(10, 10, 'A1', 'Gate 10', '2023-03-10 16:30:00');

-- Insert data into Flight_Status table
INSERT INTO Flight_Status (flight_id, status, last_updated) VALUES
(1, 'On-Time', '2023-03-01 05:00:00'),
(2, 'Delayed', '2023-03-02 06:00:00'),
(3, 'On-Time', '2023-03-03 07:00:00'),
(4, 'Cancelled', '2023-03-04 08:00:00'),
(5, 'On-Time', '2023-03-05 09:00:00'),
(6, 'On-Time', '2023-03-06 10:00:00'),
(7, 'Delayed', '2023-03-07 11:00:00'),
(8, 'On-Time', '2023-03-08 12:00:00'),
(9, 'Cancelled', '2023-03-09 13:00:00'),
(10, 'On-Time', '2023-03-10 14:00:00');

-- Insert data into Baggage_Claim table
INSERT INTO Baggage_Claim (airport_id, flight_id, baggage_belt_number) VALUES
(1, 1, 'Belt 1'),
(2, 2, 'Belt 2'),
(3, 3, 'Belt 3'),
(4, 4, 'Belt 4'),
(5, 5, 'Belt 5'),
(6, 6, 'Belt 6'),
(7, 7, 'Belt 7'),
(8, 8, 'Belt 8'),
(9, 9, 'Belt 9'),
(10, 10, 'Belt 10');

INSERT INTO Saved_Flights (user_id, flight_id, saved_time) VALUES
(1, 5, '2023-03-15 08:30:00'),
(1, 6, '2023-03-16 09:45:00'),
(2, 5, '2023-03-17 10:00:00'),
(2, 10, '2023-03-18 11:15:00'),
(3, 3, '2023-03-19 12:30:00'),
(3, 4, '2023-03-20 13:45:00'),
(4, 2, '2023-03-21 14:00:00'),
(4, 1, '2023-03-22 15:15:00'),
(5, 8, '2023-03-23 16:30:00'),
(5, 9, '2023-03-24 17:45:00');
