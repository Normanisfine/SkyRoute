import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function PUT(request, { params }) {
  try {
    const { flightId } = params;
    const {
      flightNumber,
      departureAirportId,
      arrivalAirportId,
      departureTime,
      arrivalTime,
      aircraftId,
      airlineId,
      basicPrice,
    } = await request.json();

    // Validate input
    if (!flightNumber || !departureAirportId || !arrivalAirportId || !departureTime || 
        !arrivalTime || !aircraftId || !airlineId || !basicPrice) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Update the flight in the database
    const query = `
      UPDATE Flight 
      SET 
        flight_number = ?,
        departure_airport_id = ?,
        arrival_airport_id = ?,
        departure_time = ?,
        arrival_time = ?,
        aircraft_id = ?,
        airline_id = ?,
        basic_price = ?
      WHERE flight_id = ?
    `;

    const values = [
      flightNumber,
      departureAirportId,
      arrivalAirportId,
      departureTime,
      arrivalTime,
      aircraftId,
      airlineId,
      basicPrice,
      flightId
    ];

    await db.query(query, values);

    return NextResponse.json({ message: 'Flight updated successfully' });
  } catch (error) {
    console.error('Error updating flight:', error);
    return NextResponse.json(
      { error: 'Failed to update flight: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { flightId } = params;
    const query = 'DELETE FROM Flight WHERE flight_id = ?';
    await db.query(query, [flightId]);
    return NextResponse.json({ message: 'Flight deleted successfully' });
  } catch (error) {
    console.error('Error deleting flight:', error);
    return NextResponse.json(
      { error: 'Failed to delete flight: ' + error.message },
      { status: 500 }
    );
  }
}
