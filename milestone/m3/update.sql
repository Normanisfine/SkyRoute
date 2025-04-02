-- User related
-- Update a user's name
UPDATE User
SET name = 'New Name'
WHERE user_id = 8;

-- Update a user's email
UPDATE User
SET email = 'newemail@example.com'
WHERE user_id = 7;

-- Update a user's phone number
UPDATE User
SET phone = '+1-555-987-6543'
WHERE user_id = 4;

-- Update a user's passport number
UPDATE User
SET passport_number = 'P9876543'
WHERE user_id = 5;

-- Update a passenger's name
UPDATE Passenger
SET name = 'Updated Name'
WHERE passenger_id = 3;

-- Update a passenger's passport number
UPDATE Passenger
SET passport_number = 'UpdatedPass123'
WHERE passenger_id = 5;

-- Update a passenger's date of birth
UPDATE Passenger
SET dob = '1990-01-01'
WHERE passenger_id = 6;

-- Update a passenger's associated user
UPDATE Passenger
SET user_id = 1
WHERE passenger_id = 2;

-- Flight related
-- Update a flight's information
UPDATE Flight
SET 
    flight_number = 'AA102', 
    departure_airport_id = 3, 
    arrival_airport_id = 4,             
    departure_time = '2025-04-02 09:00:00',
    arrival_time = '2025-04-02 13:00:00',  
    aircraft_id = 5,                       
    airline_id = 6                         
WHERE 
    flight_id = 2; 

-- Booking related
-- Update a booking's information
UPDATE Booking
SET 
    flight_id = 2,
    seat_id = 3,
    status = 'Paid',
    booking_time = NOW()
WHERE 
    booking_id = 1;

-- Update the seat status
UPDATE Seat
SET status = 'Booked'
WHERE seat_id = 1;

UPDATE Seat
SET status = 'Available'
WHERE seat_id = 2; -- previously booked seat

-- Update the payment status
UPDATE Payment
SET payment_status = 'Completed'
WHERE payment_id = 4;

-- Update Check-in
UPDATE Check_in
SET checkin_time = NOW(), seat_id = 102
WHERE checkin_id = 2;

-- Update Boarding Pass
UPDATE Boarding_Pass
SET seat_number = '14B', boarding_gate = 'G7', boarding_time = NOW()
WHERE boarding_pass_id = 3;

-- Update Luggage
UPDATE Luggage
SET weight = 25.0, dimensions = '60x45x25'
WHERE luggage_id = 3;

-- Update Aircraft
UPDATE Aircraft
SET model = 'Boeing 747', total_seats = 400, airline_id = 5
WHERE aircraft_id = 2;

-- UPDATE Crew
UPDATE Crew
SET name = 'John Smith', role = 'Pilot'
WHERE crew_id = 3;

-- UPDATE Airline
UPDATE Airline
SET airline_name = 'Delta Airlines', country = 'USA'
WHERE airline_id = 3;

-- UPDATE Airport
UPDATE Airport
SET airport_name = 'JFK International', city = 'New York', country = 'USA'
WHERE airport_id = 3;
