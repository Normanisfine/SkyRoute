import { NextResponse } from 'next/server';
import db from '@/utils/db';
import mysql from 'mysql2/promise';

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function GET(request, { params }) {
  try {
    const flightId = params.flightId;
    
    const query = `
      SELECT s.*
      FROM Seat s
      JOIN Aircraft a ON s.aircraft_id = a.aircraft_id
      JOIN Flight f ON f.aircraft_id = a.aircraft_id
      LEFT JOIN Price p ON p.seat_id = s.seat_id AND p.flight_id = ?
      WHERE f.flight_id = ?
      AND (p.price_id IS NULL)
    `;

    const [rows] = await db.execute(query, [flightId, flightId]);
    
    if (rows.length === 0) {
      console.log('No available seats found for flight:', flightId);
    }
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching seats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch seats' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { flightId } = params;
    await db.execute('DELETE FROM Flight WHERE flight_id = ?', [flightId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete flight' }, { status: 500 });
  }
}

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
    await sql`
      UPDATE Flights
      SET 
        flight_number = ${flightNumber},
        departure_airport_id = ${departureAirportId},
        arrival_airport_id = ${arrivalAirportId},
        departure_time = ${departureTime},
        arrival_time = ${arrivalTime},
        aircraft_id = ${aircraftId},
        airline_id = ${airlineId},
        basic_price = ${basicPrice}
      WHERE flight_id = ${flightId}
    `;

    return NextResponse.json({ message: 'Flight updated successfully' });
  } catch (error) {
    console.error('Error updating flight:', error);
    return NextResponse.json(
      { error: 'Failed to update flight' },
      { status: 500 }
    );
  }
}
