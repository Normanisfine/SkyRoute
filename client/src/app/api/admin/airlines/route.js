import { NextResponse } from 'next/server';
import { executeQuery } from '@/utils/dbUtils';

export async function GET() {
  try {
    const airlines = await executeQuery(async (connection) => {
      const [rows] = await connection.execute('SELECT * FROM Airline');
      return rows;
    });
    
    return NextResponse.json(airlines);
  } catch (error) {
    console.error('Error fetching airlines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch airlines' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { airlineName, country } = await request.json();
    
    const result = await executeQuery(async (connection) => {
      const query = `
        INSERT INTO Airline (airline_name, country)
        VALUES (?, ?)
      `;

      const [result] = await connection.execute(query, [airlineName, country]);
      return { airlineId: result.insertId };
    });

    return NextResponse.json({ success: true, airlineId: result.airlineId });
  } catch (error) {
    console.error('Error adding airline:', error);
    return NextResponse.json(
      { error: 'Failed to add airline' },
      { status: 500 }
    );
  }
}
