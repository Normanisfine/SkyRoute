import { NextResponse } from 'next/server';
import { executeQuery } from '@/utils/dbUtils';

export async function GET(request, { params }) {
  try {
    // Await params before accessing its properties
    const { id } = await params;
    const flightId = id;
    
    // Use executeQuery to properly manage connections
    const flight = await executeQuery(async (connection) => {
      // Query to get detailed flight information
      const [rows] = await connection.execute(`
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
        return null;
      }

      return rows[0];
    });

    if (!flight) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }

    // Return flight data
    return NextResponse.json(flight);
  } catch (error) {
    console.error('Error fetching flight:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch flight details',
      details: error.message
    }, { status: 500 });
  }
}
