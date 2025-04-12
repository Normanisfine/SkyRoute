import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function POST(request) {
  try {
    const {
      flightNumber,
      departureAirportId,
      arrivalAirportId,
      departureTime,
      arrivalTime,
      aircraftId,
      airlineId,
      basicPrice
    } = await request.json();

    const query = `
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
    `;

    const [result] = await db.execute(query, [
      flightNumber,
      departureAirportId,
      arrivalAirportId,
      departureTime,
      arrivalTime,
      aircraftId,
      airlineId,
      basicPrice
    ]);

    return NextResponse.json({ 
      success: true, 
      flightId: result.insertId 
    });
  } catch (error) {
    console.error('Error adding flight:', error);
    return NextResponse.json(
      { error: 'Failed to add flight' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const query = `
      SELECT 
        f.flight_id,
        f.flight_number,
        f.departure_airport_id,
        f.arrival_airport_id,
        f.departure_time,
        f.arrival_time,
        f.aircraft_id,
        f.airline_id,
        f.basic_price,
        dep.airport_name as departure_airport,
        arr.airport_name as arrival_airport,
        a.model as aircraft_model,
        al.airline_name
      FROM Flight f
      JOIN Airport dep ON f.departure_airport_id = dep.airport_id
      JOIN Airport arr ON f.arrival_airport_id = arr.airport_id
      JOIN Aircraft a ON f.aircraft_id = a.aircraft_id
      JOIN Airline al ON f.airline_id = al.airline_id
      ORDER BY f.departure_time DESC
    `;

    console.log('Executing flights query...'); // Debug log
    const [rows] = await db.execute(query);
    console.log('Flights found:', rows.length); // Debug log
    console.log('Flight data:', rows); // Debug log

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching flights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flights' },
      { status: 500 }
    );
  }
}
