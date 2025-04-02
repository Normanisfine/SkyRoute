-- User related
-- Get user details by user_id / email
SELECT * FROM User WHERE user_id = 123;
SELECT * FROM User WHERE email = 'user@example.com';

-- List All Passengers' names for a Specific User
SELECT p.name
FROM Passenger p
JOIN User u ON p.user_id = u.user_id
WHERE u.user_id = 123; 

-- List a passenger's all info for a specific passenger
SELECT p.*
FROM Passenger p
LEFT JOIN User u ON p.user_id = u.user_id
WHERE p.passenger_id = 456 AND u.user_id = 123;

-- Flight related
-- Get flight details (when searching)
SELECT 
    f.flight_id,
    f.flight_number,
    dep_airport.airport_name AS departure_airport,
    arr_airport.airport_name AS arrival_airport,
    f.departure_time,
    f.arrival_time,
    a.model AS aircraft_model,
    al.airline_name AS airline_name
FROM 
    Flight f
JOIN 
    Airport dep_airport ON f.departure_airport_id = dep_airport.airport_id
JOIN 
    Airport arr_airport ON f.arrival_airport_id = arr_airport.airport_id
JOIN 
    Aircraft a ON f.aircraft_id = a.aircraft_id
JOIN 
    Airline al ON f.airline_id = al.airline_id
WHERE 
    dep_airport.city = 'New York' -- Replace with the "from" city
    AND arr_airport.city = 'Los Angeles' -- Replace with the "to" city
    AND f.departure_time BETWEEN '2025-04-01 00:00:00' AND '2025-04-01 23:59:59' -- Replace with departure date
    AND f.arrival_time BETWEEN '2025-04-02 00:00:00' AND '2025-04-02 23:59:59'; -- Replace with return date

--  Get Available Seats for a Flight
SELECT s.seat_id, s.seat_number, s.class_type, s.price
FROM Seat s
JOIN Aircraft a ON s.aircraft_id = a.aircraft_id
JOIN Flight f ON f.aircraft_id = a.aircraft_id
WHERE f.flight_id = 123 -- Replace with the specific flight_id
  AND s.seat_id NOT IN (
      SELECT b.seat_id
      FROM Booking b
      WHERE b.flight_id = 123 -- Replace with the same flight_id
  );

--Get Crew Information for a Flight 
SELECT c.crew_id, c.name, c.role
FROM Crew c
WHERE c.flight_id = 123;

--Get Airline Information for a Flight
SELECT al.airline_id, al.airline_name, al.country
FROM Flight f
JOIN Airline al ON f.airline_id = al.airline_id
WHERE f.flight_id = 123;

--Get Aircraft Information for a Flight
SELECT a.aircraft_id, a.model, a.total_seats
FROM Flight f
JOIN Aircraft a ON f.aircraft_id = a.aircraft_id
WHERE f.flight_id = 123;

--Get Airport Information for a Flight
SELECT dep.airport_name AS departure_airport, arr.airport_name AS arrival_airport
FROM Flight f
JOIN Airport dep ON f.departure_airport_id = dep.airport_id
JOIN Airport arr ON f.arrival_airport_id = arr.airport_id
WHERE f.flight_id = 123;

-- Booking related
-- Get Booking Details for a Specific User (payment included)
SELECT 
    b.booking_id,
    b.booking_time,
    b.status AS booking_status,
    f.flight_number,
    f.departure_time,
    f.arrival_time,
    dep_airport.airport_name AS departure_airport,
    arr_airport.airport_name AS arrival_airport,
    p.name AS passenger_name,
    s.seat_number,
    s.class_type
FROM 
    Booking b
JOIN 
    Passenger p ON b.passenger_id = p.passenger_id
JOIN 
    Flight f ON b.flight_id = f.flight_id
JOIN 
    Airport dep_airport ON f.departure_airport_id = dep_airport.airport_id
JOIN 
    Airport arr_airport ON f.arrival_airport_id = arr_airport.airport_id
JOIN 
    Seat s ON b.seat_id = s.seat_id
WHERE 
    b.user_id = 123; 

-- Get info for deleting a booking
SELECT seat_id, payment_id FROM Booking WHERE booking_id = 123; -- these will be stored in the backend

--Get Check-in Information for a Booking
SELECT c.checkin_id, c.seat_id, c.checkin_time
FROM Check_in c
WHERE c.booking_id = 123;

--Get Luggage Information for a Booking
SELECT l.luggage_id, l.weight, l.dimensions
FROM Luggage l
WHERE l.booking_id = 123;

-- Get Boarding Pass for a Booking
SELECT 
    bp.boarding_pass_id,
    bp.passenger_id,
    p.name AS passenger_name,
    bp.flight_id,
    f.flight_number,
    bp.seat_number,
    bp.boarding_gate,
    bp.boarding_time
FROM 
    Boarding_Pass bp
JOIN 
    Passenger p ON bp.passenger_id = p.passenger_id
JOIN 
    Flight f ON bp.flight_id = f.flight_id
WHERE 
    bp.passenger_id = (SELECT passenger_id FROM Booking WHERE booking_id = 123);
