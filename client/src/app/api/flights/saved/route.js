import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/utils/db';

export async function GET() {
  try {
    const cookieStore = cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = JSON.parse(authCookie.value).userId;

    const [rows] = await db.execute(`
      SELECT 
        sf.saved_flight_id,
        f.flight_number,
        dep.airport_name as departure_airport,
        arr.airport_name as arrival_airport,
        f.departure_time,
        f.arrival_time,
        sf.saved_time
      FROM Saved_Flights sf
      JOIN Flight f ON sf.flight_id = f.flight_id
      JOIN Airport dep ON f.departure_airport_id = dep.airport_id
      JOIN Airport arr ON f.arrival_airport_id = arr.airport_id
      WHERE sf.user_id = ?
      ORDER BY sf.saved_time DESC
    `, [userId]);

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const cookieStore = cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = JSON.parse(authCookie.value).userId;
    const savedFlightId = params.savedFlightId;

    await db.execute(
      'DELETE FROM Saved_Flights WHERE saved_flight_id = ? AND user_id = ?',
      [savedFlightId, userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 