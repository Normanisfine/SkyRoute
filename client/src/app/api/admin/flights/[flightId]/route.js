import { NextResponse } from 'next/server';
import { executeTransaction } from '@/utils/dbUtils';

export async function PUT(request, { params }) {
  try {
    const flightId = params.flightId;
    const {
      flightNumber,
      departureAirportId,
      arrivalAirportId,
      departureTime,
      arrivalTime,
      aircraftId,
      airlineId,
      basicPrice,
      status
    } = await request.json();

    await executeTransaction(async (connection) => {
      // Update flight
      await connection.execute(`
        UPDATE Flight 
        SET flight_number = ?,
            departure_airport_id = ?,
            arrival_airport_id = ?,
            departure_time = ?,
            arrival_time = ?,
            aircraft_id = ?,
            airline_id = ?,
            basic_price = ?
        WHERE flight_id = ?
      `, [
        flightNumber,
        departureAirportId,
        arrivalAirportId,
        departureTime,
        arrivalTime,
        aircraftId,
        airlineId,
        basicPrice,
        flightId
      ]);

      // Update flight status
      await connection.execute(`
        UPDATE Flight_Status 
        SET status = ?, 
            last_updated = NOW()
        WHERE flight_id = ?
      `, [status, flightId]);
    });
    
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating flight:', error);
    return NextResponse.json(
      { error: 'Failed to update flight' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { flightId } = params;
    
    await executeTransaction(async (connection) => {
      // Delete flight status first (due to foreign key constraint)
      await connection.execute(
        'DELETE FROM Flight_Status WHERE flight_id = ?',
        [flightId]
      );

      // Then delete the flight
      await connection.execute(
        'DELETE FROM Flight WHERE flight_id = ?',
        [flightId]
      );
    });
    
    return NextResponse.json({ message: 'Flight and status deleted successfully' });
  } catch (error) {
    console.error('Error deleting flight:', error);
    return NextResponse.json(
      { error: 'Failed to delete flight: ' + error.message },
      { status: 500 }
    );
  }
}
