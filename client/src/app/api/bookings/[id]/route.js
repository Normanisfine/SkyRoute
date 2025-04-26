import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { executeQuery, executeTransaction } from '@/utils/dbUtils';

export async function GET(request, { params }) {
  try {
    const bookingId = (await params).id;
    
    // Get user ID from auth cookie
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = JSON.parse(authCookie.value);
    const userId = userData.id;

    // Use executeQuery to properly manage connections
    const bookingData = await executeQuery(async (connection) => {
      // Fetch detailed booking information with all related data
      const [rows] = await connection.execute(`
        SELECT 
          b.booking_id as id,
          b.booking_time,
          b.status as bookingStatus,
          f.flight_id,
          f.flight_number as flightNumber,
          f.departure_time as departureDateTime,
          f.arrival_time as arrivalDateTime,
          f.basic_price as basePrice,
          pr.premium_price as premiumPrice,
          (f.basic_price + pr.premium_price) as totalPrice,
          dep.airport_id as departureAirportId,
          dep.airport_name as departureAirport,
          dep.city as departureCity,
          dep.country as departureCountry,
          dep.iata_code as departureCode,
          arr.airport_id as arrivalAirportId,
          arr.airport_name as arrivalAirport,
          arr.city as arrivalCity,
          arr.country as arrivalCountry,
          arr.iata_code as arrivalCode,
          p.passenger_id,
          p.name as passengerName,
          p.passport_number as passportNumber,
          p.dob as dateOfBirth,
          s.seat_id,
          s.seat_number as seatNumber,
          s.class_type as classType,
          a.aircraft_id,
          a.model as aircraftModel,
          al.airline_id,
          al.airline_name as airline,
          al.country as airlineCountry,
          pay.payment_id,
          pay.payment_method,
          pay.payment_status,
          fs.status as flightStatus,
          fs.last_updated as statusLastUpdated
        FROM 
          Booking b
          JOIN Price pr ON b.price_id = pr.price_id
          JOIN Flight f ON pr.flight_id = f.flight_id
          JOIN Airport dep ON f.departure_airport_id = dep.airport_id
          JOIN Airport arr ON f.arrival_airport_id = arr.airport_id
          JOIN Passenger p ON b.passenger_id = p.passenger_id
          JOIN Seat s ON pr.seat_id = s.seat_id
          JOIN Aircraft a ON f.aircraft_id = a.aircraft_id
          JOIN Airline al ON f.airline_id = al.airline_id
          LEFT JOIN Payment pay ON b.booking_id = pay.booking_id
          LEFT JOIN Flight_Status fs ON f.flight_id = fs.flight_id
        WHERE 
          b.booking_id = ? AND b.user_id = ?
        LIMIT 1
      `, [bookingId, userId]);

      if (rows.length === 0) {
        return { notFound: true };
      }

      const booking = rows[0];
      
      // Check if there are any luggage items for this booking
      const [luggageRows] = await connection.execute(`
        SELECT luggage_id, weight, dimensions
        FROM Luggage
        WHERE booking_id = ?
      `, [bookingId]);

      // Check if there is any check-in information
      const [checkinRows] = await connection.execute(`
        SELECT checkin_id, checkin_time
        FROM Check_in
        WHERE booking_id = ?
      `, [bookingId]);

      return {
        booking,
        luggageRows,
        checkinRows
      };
    });

    // If booking not found, return 404
    if (bookingData.notFound) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const { booking, luggageRows, checkinRows } = bookingData;
    
    // Format dates and times
    const departureTime = new Date(booking.departureDateTime);
    const arrivalTime = new Date(booking.arrivalDateTime);
    const durationMs = arrivalTime - departureTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    // Format the response
    const formattedBooking = {
      id: booking.id,
      bookingTime: booking.booking_time,
      status: booking.bookingStatus,
      paymentStatus: booking.payment_status,
      paymentMethod: booking.payment_method,
      flight: {
        id: booking.flight_id,
        flightNumber: booking.flightNumber,
        airline: booking.airline,
        aircraftModel: booking.aircraftModel,
        departure: {
          airport: booking.departureAirport,
          code: booking.departureCode,
          city: booking.departureCity,
          country: booking.departureCountry,
          time: departureTime.toISOString(),
          formattedTime: departureTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }).toLowerCase(),
          formattedDate: departureTime.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        },
        arrival: {
          airport: booking.arrivalAirport,
          code: booking.arrivalCode,
          city: booking.arrivalCity,
          country: booking.arrivalCountry,
          time: arrivalTime.toISOString(),
          formattedTime: arrivalTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }).toLowerCase(),
          formattedDate: arrivalTime.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        },
        duration: `${hours}h ${minutes}m`,
        status: booking.flightStatus || 'On-Time',
        statusLastUpdated: booking.statusLastUpdated
      },
      passenger: {
        id: booking.passenger_id,
        name: booking.passengerName,
        passportNumber: booking.passportNumber,
        dateOfBirth: booking.dateOfBirth
      },
      seat: {
        id: booking.seat_id,
        number: booking.seatNumber,
        classType: booking.classType
      },
      price: {
        base: parseFloat(booking.basePrice),
        premium: parseFloat(booking.premiumPrice),
        total: parseFloat(booking.totalPrice)
      },
      luggage: luggageRows.map(item => ({
        id: item.luggage_id,
        weight: item.weight,
        dimensions: item.dimensions
      })),
      checkedIn: checkinRows.length > 0,
      checkinTime: checkinRows.length > 0 ? checkinRows[0].checkin_time : null
    };

    return NextResponse.json(formattedBooking);
  } catch (error) {
    console.error('Error fetching booking details:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const bookingId = (await params).id;
    
    // Get user ID from auth cookie
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = JSON.parse(authCookie.value);
    const userId = userData.id;

    // Use executeTransaction to ensure atomicity
    const result = await executeTransaction(async (connection) => {
      // First check if booking exists and belongs to the user
      const [bookingRows] = await connection.execute(`
        SELECT b.booking_id, b.price_id, b.status
        FROM Booking b
        WHERE b.booking_id = ? AND b.user_id = ?
      `, [bookingId, userId]);

      if (bookingRows.length === 0) {
        return { error: 'booking_not_found' };
      }

      const booking = bookingRows[0];
      
      // Check if booking is already cancelled
      if (booking.status === 'Cancelled') {
        return { error: 'already_cancelled' };
      }
      
      // Get departure time to check if cancellation is allowed
      const [flightRows] = await connection.execute(`
        SELECT f.departure_time
        FROM Flight f
        JOIN Price p ON f.flight_id = p.flight_id
        WHERE p.price_id = ?
      `, [booking.price_id]);
      
      if (flightRows.length === 0) {
        return { error: 'flight_not_found' };
      }
      
      const departureTime = new Date(flightRows[0].departure_time);
      const currentTime = new Date();
      
      // Prevent cancellation if flight is less than 24 hours away
      const hoursUntilDeparture = (departureTime - currentTime) / (1000 * 60 * 60);
      if (hoursUntilDeparture < 24) {
        return { error: 'cancellation_window_closed' };
      }

      // 1. Update booking status to Cancelled
      await connection.execute(`
        UPDATE Booking
        SET status = 'Cancelled'
        WHERE booking_id = ?
      `, [bookingId]);

      // 2. Set the price status back to Available
      await connection.execute(`
        UPDATE Price
        SET status = 'Available'
        WHERE price_id = ?
      `, [booking.price_id]);
      
      // 3. Delete any associated luggage records
      await connection.execute(`
        DELETE FROM Luggage
        WHERE booking_id = ?
      `, [bookingId]);
      
      // 4. Delete any associated check-in records
      await connection.execute(`
        DELETE FROM Check_in
        WHERE booking_id = ?
      `, [bookingId]);

      return { success: true };
    });

    // Handle different results
    if (result.error) {
      const errorMessages = {
        'booking_not_found': 'Booking not found',
        'already_cancelled': 'Booking is already cancelled',
        'flight_not_found': 'Flight information not found',
        'cancellation_window_closed': 'Cannot cancel bookings less than 24 hours before departure'
      };
      
      return NextResponse.json(
        { error: errorMessages[result.error] }, 
        { status: result.error === 'booking_not_found' ? 404 : 400 }
      );
    }

    return NextResponse.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' }, 
      { status: 500 }
    );
  }
} 