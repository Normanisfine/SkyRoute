import { NextResponse } from 'next/server';
import { executeQuery } from '@/utils/dbUtils';

// GET all flight statuses
export async function GET() {
  try {
    const flightStatuses = await executeQuery(async (connection) => {
      const [rows] = await connection.execute(`
        SELECT 
          fs.*,
          f.flight_number
        FROM Flight_Status fs
        JOIN Flight f ON fs.flight_id = f.flight_id
      `);
      return rows;
    });
    
    return NextResponse.json(flightStatuses);
  } catch (error) {
    console.error('Error fetching flight statuses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flight statuses' },
      { status: 500 }
    );
  }
}

// POST new flight status
export async function POST(request) {
  try {
    const { flightId, status } = await request.json();
    
    const result = await executeQuery(async (connection) => {
      // Check if there's already a status for this flight
      const [existing] = await connection.execute(
        'SELECT * FROM Flight_Status WHERE flight_id = ?',
        [flightId]
      );
      
      if (existing.length > 0) {
        // Update existing status
        await connection.execute(
          'UPDATE Flight_Status SET status = ?, last_updated = NOW() WHERE flight_id = ?',
          [status, flightId]
        );
        return { updated: true, flightId };
      } else {
        // Insert new status
        await connection.execute(
          'INSERT INTO Flight_Status (flight_id, status, last_updated) VALUES (?, ?, NOW())',
          [flightId, status]
        );
        return { inserted: true, flightId };
      }
    });

    return NextResponse.json({ 
      success: true,
      updated: result.updated,
      inserted: result.inserted,
      flightId: result.flightId
    });
  } catch (error) {
    console.error('Error updating flight status:', error);
    return NextResponse.json(
      { error: 'Failed to update flight status' },
      { status: 500 }
    );
  }
} 