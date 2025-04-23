import { NextResponse } from 'next/server';
import { executeQuery } from '@/utils/dbUtils';

export async function GET() {
  try {
    const airports = await executeQuery(async (connection) => {
      const [rows] = await connection.execute('SELECT * FROM Airport');
      return rows;
    });
    
    return NextResponse.json(airports);
  } catch (error) {
    console.error('Error fetching airports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch airports' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { airportName, city, country, iataCode, icaoCode } = await request.json();
    
    const result = await executeQuery(async (connection) => {
      const query = `
        INSERT INTO Airport (airport_name, city, country, iata_code, icao_code)
        VALUES (?, ?, ?, ?, ?)
      `;

      const [result] = await connection.execute(query, [
        airportName,
        city,
        country,
        iataCode,
        icaoCode
      ]);

      return { airportId: result.insertId };
    });

    return NextResponse.json({ success: true, airportId: result.airportId });
  } catch (error) {
    console.error('Error adding airport:', error);
    return NextResponse.json(
      { error: 'Failed to add airport' },
      { status: 500 }
    );
  }
}
