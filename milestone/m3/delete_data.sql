-- User related
DELETE FROM User
WHERE user_id = 123; 

DELETE FROM Passenger
WHERE passenger_id = 456; 

-- Flight related
DELETE FROM Flight
WHERE flight_id = 123; 

-- Booking related (firstly )
-- Get seat_id and payment_id from the booking before deleting. Stored in the backend.

DELETE FROM Booking
WHERE booking_id = 123;

UPDATE Seat
SET status = 'Available'
WHERE seat_id = 101; -- Replace 101 with the seat_id from the deleted booking

UPDATE Payment
SET payment_status = 'Cancelled'
WHERE payment_id = 456; -- Replace 456 with the payment_id from the deleted booking

-- DELETE Check_in
DELETE FROM Check_in
WHERE checkin_id = 123;

-- Boarding_Pass
DELETE FROM Boarding_Pass
WHERE boarding_pass_id = 456;

--Aircraft
DELETE FROM Aircraft
WHERE aircraft_id = 789;

-- Crew
DELETE FROM Crew
WHERE crew_id = 101;

-- Airline
DELETE FROM Airline
WHERE airline_id = 202;

-- Airport
DELETE FROM Airport
WHERE airport_id = 303;