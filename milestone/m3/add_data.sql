-- User related
-- Adding (registering) a new user
INSERT INTO User (name, email, phone, passport_number)
VALUES ('John Doe2', 'john.doe@example2.com', '555-1234', 'A12345678');


-- Adding a new passenger to a user
INSERT INTO Passenger (user_id, name, passport_number, dob)
VALUES (1, 'Sara Smith', 'P12345678', '1980-04-01');

-- Flight related
-- Adding a new flight
INSERT INTO Flight (flight_number, departure_airport_id, arrival_airport_id, departure_time, arrival_time, aircraft_id, airline_id)
VALUES ('AA101', 1, 2, '2025-04-01 08:00:00', '2025-04-01 12:00:00', 3, 4);

-- Booking related
-- Adding a new booking
INSERT INTO Booking (user_id, passenger_id, flight_id, seat_id, booking_time, status)
VALUES (1, 2, 3, 4, NOW(), 'Paid');
-- When placing a booking, other tables be involved.
-- The booking_id will be retrieved and store in the backend.
SELECT LAST_INSERT_ID() AS booking_id;

INSERT INTO Payment (booking_id, payment_method, payment_status)
VALUES (1, 'Credit Card', 'Completed');

INSERT INTO Luggage (booking_id, weight, dimensions)
VALUES (1, 23.5, '55x40x20'); 

INSERT INTO Check_in (booking_id, seat_id, checkin_time)
VALUES (1, 2, NULL);

INSERT INTO Boarding_Pass (passenger_id, flight_id, seat_number, boarding_gate, boarding_time)
VALUES (1, 2, '12A', 'G5', NULL);


UPDATE Seat
SET status = 'Booked'
WHERE seat_id = 2;


