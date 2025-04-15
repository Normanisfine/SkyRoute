import { NextResponse } from 'next/server';
import db from '@/utils/db';

// GET all flight statuses
export async function GET() {
  try {
    const [rows] = await db.execute(`
      SELECT fs.*, f.flight_number 
      FROM Flight_Status fs
      JOIN Flight f ON fs.flight_id = f.flight_id
    `);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new flight status
export async function POST(request) {
  try {
    const { flightId, status, lastUpdated } = await request.json();
    const [result] = await db.execute(`
      INSERT INTO Flight_Status (flight_id, status, last_updated)
      VALUES (?, ?, ?)
    `, [flightId, status, lastUpdated]);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 