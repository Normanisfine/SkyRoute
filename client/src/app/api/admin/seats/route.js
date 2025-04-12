import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET() {
  try {
    const [rows] = await db.execute('SELECT * FROM Seat');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch seats' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { aircraftId, seatNumber, classType } = await request.json();
    
    const query = `
      INSERT INTO Seat (aircraft_id, seat_number, class_type)
      VALUES (?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      aircraftId,
      seatNumber,
      classType
    ]);

    return NextResponse.json({ success: true, seatId: result.insertId });
  } catch (error) {
    console.error('Error adding seat:', error);
    return NextResponse.json(
      { error: 'Failed to add seat' },
      { status: 500 }
    );
  }
}
