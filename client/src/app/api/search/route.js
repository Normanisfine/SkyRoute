import { NextResponse } from 'next/server';
import { executeQuery } from '@/utils/dbUtils';  // Import executeQuery instead of db

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const departureDate = searchParams.get('departure');
    const returnDate = searchParams.get('return');

    // Use executeQuery to properly manage connections
    const flights = await executeQuery(async (connection) => {
      const query = `
        SELECT 
          f.flight_id,
          f.flight_number,
          f.departure_time,
          f.arrival_time,
          f.basic_price,
          dep.city as departure_city,
          dep.iata_code as departure_code,
          arr.city as arrival_city,
          arr.iata_code as arrival_code,
          al.airline_name,
          fs.status as flight_status,
          TIMEDIFF(f.arrival_time, f.departure_time) as duration
        FROM Flight f
        JOIN Airport dep ON f.departure_airport_id = dep.airport_id
        JOIN Airport arr ON f.arrival_airport_id = arr.airport_id
        JOIN Airline al ON f.airline_id = al.airline_id
        LEFT JOIN Flight_Status fs ON f.flight_id = fs.flight_id
        WHERE dep.city LIKE ? 
        AND arr.city LIKE ?
        AND DATE(f.departure_time) = ?
        ORDER BY f.basic_price ASC`;

      const [rows] = await connection.execute(query, [
        `%${from}%`,
        `%${to}%`,
        departureDate
      ]);

      return rows;
    });

    return NextResponse.json({ flights });
  } catch (error) {
    console.error('Error searching flights:', error);
    return NextResponse.json(
      { error: 'Failed to search flights' },
      { status: 500 }
    );
  }
} 