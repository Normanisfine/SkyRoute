import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET() {
  try {
    const userId = 1; // Replace with actual user ID from session

    const [rows] = await db.execute(`
      SELECT 
        b.booking_id,
        f.flight_number,
        dep.airport_name as departure_airport,
        arr.airport_name as arrival_airport,
        f.departure_time,
        f.arrival_time,
        b.status,
        p.premium_price as price
      FROM Booking b
      JOIN Price p ON b.price_id = p.price_id
      JOIN Flight f ON p.flight_id = f.flight_id
      JOIN Airport dep ON f.departure_airport_id = dep.airport_id
      JOIN Airport arr ON f.arrival_airport_id = arr.airport_id
      WHERE b.user_id = ?
      ORDER BY f.departure_time DESC
    `, [userId]);

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 