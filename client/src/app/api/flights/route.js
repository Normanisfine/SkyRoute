import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET() {
  try {
    const query = `
      SELECT 
        f.*,
        dep.airport_name as departure_airport,
        arr.airport_name as arrival_airport
      FROM Flight f
      JOIN Airport dep ON f.departure_airport_id = dep.airport_id
      JOIN Airport arr ON f.arrival_airport_id = arr.airport_id
      ORDER BY f.departure_time DESC
    `;

    const [rows] = await db.execute(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching flights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flights' },
      { status: 500 }
    );
  }
}
