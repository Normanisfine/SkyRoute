import { NextResponse } from 'next/server';
import { executeQuery } from '@/utils/dbUtils';

// GET - 获取所有航空器
export async function GET() {
  try {
    const aircraft = await executeQuery(async (connection) => {
      const [rows] = await connection.execute(`
        SELECT 
          a.*, 
          al.airline_name 
        FROM Aircraft a
        JOIN Airline al ON a.airline_id = al.airline_id
      `);
      return rows;
    });
    
    return NextResponse.json(aircraft);
  } catch (error) {
    console.error('Error fetching aircraft:', error);
    return NextResponse.json(
      { error: 'Failed to fetch aircraft' },
      { status: 500 }
    );
  }
}

// POST - 创建新航空器
export async function POST(request) {
  try {
    const { model, totalSeats, airlineId } = await request.json();
    
    const result = await executeQuery(async (connection) => {
      const [result] = await connection.execute(
        'INSERT INTO Aircraft (model, total_seats, airline_id) VALUES (?, ?, ?)',
        [model, totalSeats, airlineId]
      );
      return { aircraftId: result.insertId };
    });

    return NextResponse.json({ 
      success: true, 
      aircraftId: result.aircraftId 
    });
  } catch (error) {
    console.error('Error adding aircraft:', error);
    return NextResponse.json(
      { error: 'Failed to add aircraft' },
      { status: 500 }
    );
  }
}
