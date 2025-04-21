import { NextResponse } from 'next/server';
import db from '@/utils/db';
import { adminAuthMiddleware } from '@/utils/auth';

export async function POST(request) {
  // Check admin authorization
  const authResponse = await adminAuthMiddleware(request);
  if (authResponse) return authResponse;

  try {
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

    await connection.beginTransaction();

    // Insert flight
    const [flightResult] = await connection.execute(`
      INSERT INTO Flight (
        flight_number,
        departure_airport_id,
        arrival_airport_id,
        departure_time,
        arrival_time,
        aircraft_id,
        airline_id,
        basic_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      flightNumber,
      departureAirportId,
      arrivalAirportId,
      departureTime,
      arrivalTime,
      aircraftId,
      airlineId,
      basicPrice
    ]);

    // Insert flight status in the same transaction
    await connection.execute(`
      INSERT INTO Flight_Status (flight_id, status, last_updated)
      VALUES (?, ?, NOW())
    `, [flightResult.insertId, status || 'On-Time']);

    await connection.commit();
    
    return NextResponse.json({ 
      success: true, 
      insertId: flightResult.insertId 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error adding flight:', error);
    return NextResponse.json(
      { error: 'Failed to add flight' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}

export async function GET(request) {
  // Check admin authorization
  const authResponse = await adminAuthMiddleware(request);
  if (authResponse) return authResponse;

  try {
    const [rows] = await db.execute(`
      SELECT DISTINCT
        f.flight_id,
        f.flight_number,
        f.departure_airport_id,
        f.arrival_airport_id,
        f.departure_time,
        f.arrival_time,
        f.aircraft_id,
        f.airline_id,
        f.basic_price,
        fs.status,
        fs.last_updated,
        dep.airport_name as departure_airport,
        arr.airport_name as arrival_airport
      FROM Flight f
      LEFT JOIN Flight_Status fs ON f.flight_id = fs.flight_id
      LEFT JOIN Airport dep ON f.departure_airport_id = dep.airport_id
      LEFT JOIN Airport arr ON f.arrival_airport_id = arr.airport_id
      ORDER BY f.flight_id
    `);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
