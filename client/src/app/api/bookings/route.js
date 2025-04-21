import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/utils/db';

export async function GET(request) {
    try {
        // Get user ID from auth cookie
        const authCookie = cookies().get('auth');
        if (!authCookie) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userData = JSON.parse(authCookie.value);
        const userId = userData.id;

        // Complex JOIN query to get all booking information
        const [rows] = await db.execute(`
            SELECT 
                b.booking_id as id,
                b.booking_time,
                b.status as bookingStatus,
                f.flight_number as flightNumber,
                f.departure_time as departureDateTime,
                f.arrival_time as arrivalDateTime,
                f.basic_price as basePrice,
                pr.premium_price as price,
                dep.iata_code as origin,
                arr.iata_code as destination,
                p.name as passenger,
                s.seat_number as seat,
                s.class_type as classType,
                al.airline_name as airline,
                fs.status as flightStatus
            FROM 
                Booking b
                JOIN Price pr ON b.price_id = pr.price_id
                JOIN Flight f ON pr.flight_id = f.flight_id
                JOIN Airport dep ON f.departure_airport_id = dep.airport_id
                JOIN Airport arr ON f.arrival_airport_id = arr.airport_id
                JOIN Passenger p ON b.passenger_id = p.passenger_id
                JOIN Seat s ON pr.seat_id = s.seat_id
                JOIN Aircraft ac ON s.aircraft_id = ac.aircraft_id
                JOIN Airline al ON f.airline_id = al.airline_id
                LEFT JOIN Flight_Status fs ON f.flight_id = fs.flight_id
            WHERE 
                b.user_id = ?
            ORDER BY 
                b.booking_time DESC
        `, [userId]);

        // Transform the data to match the frontend requirements
        const bookings = rows.map(row => {
            const departureTime = new Date(row.departureDateTime);
            const arrivalTime = new Date(row.arrivalDateTime);
            const durationMs = arrivalTime - departureTime;
            const hours = Math.floor(durationMs / (1000 * 60 * 60));
            const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

            return {
                id: row.id,
                flightNumber: row.flightNumber,
                origin: row.origin,
                destination: row.destination,
                departureTime: departureTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }).toLowerCase(),
                arrivalTime: arrivalTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }).toLowerCase(),
                duration: `${hours}h ${minutes}m`,
                passenger: row.passenger,
                seat: row.seat,
                date: departureTime.toISOString().split('T')[0],
                status: row.bookingStatus,
                airline: row.airline,
                price: row.price,
                classType: row.classType,
                flightStatus: row.flightStatus
            };
        });

        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch bookings' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      flightId, 
      passenger, 
      passengerId, 
      paymentMethod, 
      priceId 
    } = body;

    // Get a connection from the pool for transaction
    const connection = await db.getConnection();
    
    try {
      // Start transaction
      await connection.beginTransaction();
      
      let actualPassengerId;
      
      // If this is a new passenger or 'self', we need to either use the user's ID directly
      // or create a new passenger record
      if (passengerId === 'self') {
        // Get the current user ID from the session
        const [userRows] = await connection.execute(
          'SELECT user_id FROM AirlineUser WHERE email = ?',
          [passenger.email]
        );
        
        if (userRows.length === 0) {
          throw new Error('User not found');
        }
        
        const userId = userRows[0].user_id;
        
        // Check if this user already has a passenger record with this passport number
        const [existingPassenger] = await connection.execute(
          'SELECT passenger_id FROM Passenger WHERE user_id = ? AND passport_number = ?',
          [userId, passenger.passportNumber]
        );
        
        if (existingPassenger.length > 0) {
          // Use existing passenger ID
          actualPassengerId = existingPassenger[0].passenger_id;
        } else {
          // Create a new passenger record
          const fullName = `${passenger.firstName} ${passenger.lastName}`;
          const [newPassenger] = await connection.execute(
            'INSERT INTO Passenger (user_id, name, passport_number) VALUES (?, ?, ?)',
            [userId, fullName, passenger.passportNumber]
          );
          
          actualPassengerId = newPassenger.insertId;
        }
      } else {
        // Use the provided passenger ID
        actualPassengerId = passengerId;
      }

      // 1. Update the Price status to 'Booked'
      await connection.execute(`
        UPDATE Price 
        SET status = 'Booked' 
        WHERE price_id = ?
      `, [priceId]);

      // Get user ID
      const [userRows] = await connection.execute(
        'SELECT user_id FROM AirlineUser WHERE email = ?',
        [passenger.email]
      );
      
      if (userRows.length === 0) {
        throw new Error('User not found');
      }
      
      const userId = userRows[0].user_id;

      // 2. Create a new Booking record
      const bookingTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const [bookingResult] = await connection.execute(`
        INSERT INTO Booking (
          user_id, 
          passenger_id, 
          price_id, 
          booking_time, 
          status
        ) VALUES (?, ?, ?, ?, 'Unpaid')
      `, [userId, actualPassengerId, priceId, bookingTime]);

      const bookingId = bookingResult.insertId;

      // 3. Create a Payment record
      const paymentMethodMap = {
        credit: 'Credit Card',
        paypal: 'PayPal',
        alipay: 'Alipay'
      };

      await connection.execute(`
        INSERT INTO Payment (
          booking_id, 
          payment_method, 
          payment_status
        ) VALUES (?, ?, 'Pending')
      `, [bookingId, paymentMethodMap[paymentMethod] || 'Credit Card']);

      // 4. Update booking status to paid (in a real app, this would be done after payment processing)
      await connection.execute(`
        UPDATE Booking
        SET status = 'Paid'
        WHERE booking_id = ?
      `, [bookingId]);

      // 5. Update payment status to completed (in a real app, this would happen after payment confirmation)
      await connection.execute(`
        UPDATE Payment
        SET payment_status = 'Completed'
        WHERE booking_id = ?
      `, [bookingId]);

      // Commit the transaction
      await connection.commit();
      
      // Return the booking ID
      return NextResponse.json({ 
        success: true, 
        bookingId: bookingId 
      }, { status: 201 });

    } catch (error) {
      // Rollback in case of error
      await connection.rollback();
      throw error;
    } finally {
      // Release connection back to the pool
      connection.release();
    }
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ 
      error: 'Failed to create booking',
      details: error.message
    }, { status: 500 });
  }
} 