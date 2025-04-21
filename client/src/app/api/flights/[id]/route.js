import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET(request, { params }) {
  try {
    // Await params before accessing its properties
    const { id } = await params;
    const flightId = id;
    
    // Query to get detailed flight information
    const [rows] = await db.execute(`
      SELECT 
        f.flight_id,
        f.flight_number,
        f.departure_time,
        f.arrival_time,
        f.basic_price,
        dep.airport_name as departure_airport,
        dep.iata_code as departure_code,
        arr.airport_name as arrival_airport,
        arr.iata_code as arrival_code,
        a.airline_name
      FROM Flight f
      JOIN Airport dep ON f.departure_airport_id = dep.airport_id
      JOIN Airport arr ON f.arrival_airport_id = arr.airport_id
      JOIN Airline a ON f.airline_id = a.airline_id
      WHERE f.flight_id = ?
    `, [flightId]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }

    // Return flight data
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching flight:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch flight details',
      details: error.message
    }, { status: 500 });
  }
}
