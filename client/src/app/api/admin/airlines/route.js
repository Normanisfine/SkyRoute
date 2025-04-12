import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET() {
  try {
    const [rows] = await db.execute('SELECT * FROM Airline');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch airlines' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { airlineName, country } = await request.json();
    
    const query = `
      INSERT INTO Airline (airline_name, country)
      VALUES (?, ?)
    `;

    const [result] = await db.execute(query, [airlineName, country]);

    return NextResponse.json({ success: true, airlineId: result.insertId });
  } catch (error) {
    console.error('Error adding airline:', error);
    return NextResponse.json(
      { error: 'Failed to add airline' },
      { status: 500 }
    );
  }
}
