import { NextResponse } from 'next/server';
import { executeQuery } from '@/utils/dbUtils';

export async function GET() {
  try {
    const seats = await executeQuery(async (connection) => {
      const [rows] = await connection.execute(`
        SELECT 
          s.*,
          a.model as aircraft_model
        FROM Seat s
        JOIN Aircraft a ON s.aircraft_id = a.aircraft_id
      `);
      return rows;
    });
    
    return NextResponse.json(seats);
  } catch (error) {
    console.error('Error fetching seats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch seats' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { aircraftId, seatNumber, classType } = await request.json();
    
    const result = await executeQuery(async (connection) => {
      // Check if seat already exists
      const [existing] = await connection.execute(
        'SELECT seat_id FROM Seat WHERE aircraft_id = ? AND seat_number = ?',
        [aircraftId, seatNumber]
      );
      
      if (existing.length > 0) {
        return { error: 'exists' };
      }
      
      const [result] = await connection.execute(
        'INSERT INTO Seat (aircraft_id, seat_number, class_type) VALUES (?, ?, ?)',
        [aircraftId, seatNumber, classType]
      );
      
      return { seatId: result.insertId };
    });
    
    if (result.error === 'exists') {
      return NextResponse.json(
        { error: 'Seat already exists for this aircraft' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      seatId: result.seatId 
    });
  } catch (error) {
    console.error('Error adding seat:', error);
    return NextResponse.json(
      { error: 'Failed to add seat' },
      { status: 500 }
    );
  }
}
