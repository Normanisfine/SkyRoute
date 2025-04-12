import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET() {
  try {
    const [rows] = await db.execute('SELECT * FROM Airport');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch airports' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { airportName, city, country, iataCode, icaoCode } = await request.json();
    
    const query = `
      INSERT INTO Airport (airport_name, city, country, iata_code, icao_code)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      airportName,
      city,
      country,
      iataCode,
      icaoCode
    ]);

    return NextResponse.json({ success: true, airportId: result.insertId });
  } catch (error) {
    console.error('Error adding airport:', error);
    return NextResponse.json(
      { error: 'Failed to add airport' },
      { status: 500 }
    );
  }
}
