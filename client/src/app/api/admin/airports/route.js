import { NextResponse } from 'next/server';
import db from '@/utils/db';
import { adminAuthMiddleware } from '@/utils/auth';

export async function GET(request) {
  // Check admin authorization
  const authResponse = await adminAuthMiddleware(request);
  if (authResponse) return authResponse;

  try {
    const [rows] = await db.query('SELECT * FROM Airport');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching airports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch airports' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  // Check admin authorization
  const authResponse = await adminAuthMiddleware(request);
  if (authResponse) return authResponse;

  try {
    const { airportName, city, country, iataCode, icaoCode } = await request.json();
    
    const query = `
      INSERT INTO Airport (airport_name, city, country, iata_code, icao_code)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [airportName, city, country, iataCode, icaoCode]);
    
    return NextResponse.json({ 
      success: true, 
      airportId: result.insertId 
    });
  } catch (error) {
    console.error('Error adding airport:', error);
    return NextResponse.json(
      { error: 'Failed to add airport' },
      { status: 500 }
    );
  }
}
