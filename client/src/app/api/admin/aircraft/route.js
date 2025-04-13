import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET() {
  try {
    const [rows] = await db.execute('SELECT * FROM Aircraft');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch aircraft' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { airline_id, aircraft_model, capacity } = await request.json();
    await db.execute(
      'INSERT INTO Aircraft (airline_id, aircraft_model, capacity) VALUES (?, ?, ?)',
      [airline_id, aircraft_model, capacity]
    );
    return NextResponse.json({ message: 'Aircraft created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create aircraft' }, { status: 500 });
  }
}
