import { NextResponse } from 'next/server';
import { executeQuery } from '@/utils/dbUtils';

// GET specific flight status
export async function GET(request, { params }) {
  try {
    const id = params.id;
    
    const status = await executeQuery(async (connection) => {
      const [rows] = await connection.execute(`
        SELECT * FROM Flight_Status 
        WHERE flight_id = ?
      `, [id]);
      return rows[0];
    });
    
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT (update) flight status
export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const { status, lastUpdated } = await request.json();
    
    const result = await executeQuery(async (connection) => {
      const [result] = await connection.execute(`
        UPDATE Flight_Status 
        SET status = ?, last_updated = ?
        WHERE flight_id = ?
      `, [status, lastUpdated, id]);
      return result;
    });
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE flight status
export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    
    const result = await executeQuery(async (connection) => {
      const [result] = await connection.execute(`
        DELETE FROM Flight_Status 
        WHERE flight_id = ?
      `, [id]);
      return result;
    });
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 