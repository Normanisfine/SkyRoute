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

    const userData = JSON.parse(authCookie.value);
    const userId = userData.id;

    const [rows] = await db.execute(`
      SELECT 
        sf.saved_flight_id,
        f.flight_number,
        dep.airport_name as departure_airport,
        dep.iata_code as departure_code,
        arr.airport_name as arrival_airport,
        arr.iata_code as arrival_code,
        f.departure_time,
        f.arrival_time,
        sf.saved_time,
        a.airline_name as airline
      FROM Saved_Flights sf
      JOIN Flight f ON sf.flight_id = f.flight_id
      JOIN Airport dep ON f.departure_airport_id = dep.airport_id
      JOIN Airport arr ON f.arrival_airport_id = arr.airport_id
      JOIN Airline a ON f.airline_id = a.airline_id
      WHERE sf.user_id = ?
      ORDER BY sf.saved_time DESC
    `, [userId]);

    const flightsWithDefaultPrice = rows.map(flight => ({
      ...flight,
      price: 450 // Default price
    }));

    return NextResponse.json(flightsWithDefaultPrice);
  } catch (error) {
    console.error('Error fetching saved flights:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const cookieStore = cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = JSON.parse(authCookie.value);
    const userId = userData.id;
    
    let savedFlightId;
    
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    if (lastSegment && lastSegment !== 'saved') {
      savedFlightId = lastSegment;
    } else {
      try {
        const body = await request.json();
        savedFlightId = body.savedFlightId;
      } catch (e) {
        return NextResponse.json({ error: 'Missing saved flight ID' }, { status: 400 });
      }
    }

    if (!savedFlightId) {
      return NextResponse.json({ error: 'Missing saved flight ID' }, { status: 400 });
    }

    await db.execute(
      'DELETE FROM Saved_Flights WHERE saved_flight_id = ? AND user_id = ?',
      [savedFlightId, userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting saved flight:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 