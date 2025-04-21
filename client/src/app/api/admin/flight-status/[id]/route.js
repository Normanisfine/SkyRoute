import { NextResponse } from 'next/server';
import db from '@/utils/db';

// GET specific flight status
export async function GET(request, { params }) {
  try {
    const id = params.id;
    const [rows] = await db.execute(`
      SELECT * FROM Flight_Status 
      WHERE flight_id = ?
    `, [id]);
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT (update) flight status
export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const { status, lastUpdated } = await request.json();
    const [result] = await db.execute(`
      UPDATE Flight_Status 
      SET status = ?, last_updated = ?
      WHERE flight_id = ?
    `, [status, lastUpdated, id]);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE flight status
export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    const [result] = await db.execute(`
      DELETE FROM Flight_Status 
      WHERE flight_id = ?
    `, [id]);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 