// src/app/api/bookings/[id]/checkin/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { executeTransaction } from '@/utils/dbUtils';

export async function POST(request, { params }) {
  try {
    // Fix: Await params since Next.js expects it to be awaited
    const bookingId = (await params).id;
    
    // Get user ID from auth cookie
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = JSON.parse(authCookie.value);
    const userId = userData.id;

    // Use executeTransaction to ensure all operations complete together
    const result = await executeTransaction(async (connection) => {
      // Step 1: First get the booking and check if it exists and belongs to the user
      const [bookingRows] = await connection.execute(
        `SELECT booking_id, user_id, passenger_id, price_id, status 
         FROM Booking 
         WHERE booking_id = ?`,
        [bookingId]
      );

      if (bookingRows.length === 0) {
        return { error: 'Booking not found', status: 404 };
      }

      const booking = bookingRows[0];
      
      if (booking.user_id !== userId) {
        return { error: 'Unauthorized', status: 403 };
      }
      
      // Step 2: Check if already checked in
      const [checkInRows] = await connection.execute(
        `SELECT checkin_id FROM Check_in WHERE booking_id = ?`,
        [bookingId]
      );
      
      if (checkInRows.length > 0) {
        return { error: 'Already checked in', status: 400 };
      }
      
      // Step 3: Get the flight_id through Price table
      const [priceRows] = await connection.execute(
        `SELECT flight_id FROM Price WHERE price_id = ?`,
        [booking.price_id]
      );
      
      if (priceRows.length === 0) {
        return { error: 'Flight information not found', status: 404 };
      }
      
      const flightId = priceRows[0].flight_id;
      
      // Step 4: Get flight details to check if check-in is allowed (24 hours before flight)
      const [flightRows] = await connection.execute(
        `SELECT departure_time FROM Flight WHERE flight_id = ?`,
        [flightId]
      );
      
      if (flightRows.length === 0) {
        return { error: 'Flight not found', status: 404 };
      }
      
      const flight = flightRows[0];
      const departureTime = new Date(flight.departure_time);
      const now = new Date();
      const timeDifference = departureTime - now;
      const hoursDifference = timeDifference / (1000 * 60 * 60);
      
      // Check if we're within 24 hours of the flight
      if (hoursDifference > 24) {
        return { 
          error: 'Check-in not yet available. Opens 24 hours before departure.', 
          status: 400,
          availableFrom: new Date(departureTime.getTime() - 24 * 60 * 60 * 1000)
        };
      }
      
      // Check if flight has already departed
      if (hoursDifference < 0) {
        return { error: 'Check-in closed. Flight has already departed.', status: 400 };
      }
      
      // Step 5: Create check-in record
      // First get the seat_id from the price_id
      const [seatRows] = await connection.execute(
        `SELECT seat_id FROM Price WHERE price_id = ?`,
        [booking.price_id]
      );
      
      if (seatRows.length === 0) {
        return { error: 'Seat information not found', status: 404 };
      }
      
      const seatId = seatRows[0].seat_id;
      
      // Create check-in record with seat information
      await connection.execute(
        `INSERT INTO Check_in (booking_id, seat_id, checkin_time) VALUES (?, ?, NOW())`,
        [bookingId, seatId]
      );
      
      // Update booking status if necessary
      if (booking.status !== 'Checked-in') {
        await connection.execute(
          `UPDATE Booking SET status = 'Paid' WHERE booking_id = ?`,
          [bookingId]
        );
      }
      
      return { success: true };
    });
    
    // If there was an error in the transaction, return appropriate response
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Check-in successful',
      timestamp: new Date()
    });
    
  } catch (error) {
    console.error('Error during check-in:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}