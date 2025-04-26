import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { executeQuery } from '@/utils/dbUtils';

export async function POST(request, { params }) {
  try {
    const bookingId = await params.id;
    const { weight, dimensions } = await request.json();
    
    // Input validation
    if (!weight || !dimensions) {
      return NextResponse.json(
        { error: 'Weight and dimensions are required' },
        { status: 400 }
      );
    }
    
    // Get user ID from auth cookie
    const cookieStore = cookies();
    const authCookie = await cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = JSON.parse(authCookie.value);
    const userId = userData.id;

    // Check if booking belongs to user
    const bookingData = await executeQuery(async (connection) => {
      const [rows] = await connection.execute(
        'SELECT booking_id FROM Booking WHERE booking_id = ? AND user_id = ?',
        [bookingId, userId]
      );
      
      if (rows.length === 0) {
        return { notFound: true };
      }
      
      // Add luggage
      const [result] = await connection.execute(
        'INSERT INTO Luggage (booking_id, weight, dimensions) VALUES (?, ?, ?)',
        [bookingId, weight, dimensions]
      );
      
      // Get the newly created luggage
      const [luggageRows] = await connection.execute(
        'SELECT luggage_id as id, weight, dimensions FROM Luggage WHERE luggage_id = ?',
        [result.insertId]
      );
      
      return { luggage: luggageRows[0] };
    });

    if (bookingData.notFound) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(bookingData);
  } catch (error) {
    console.error('Error adding luggage:', error);
    return NextResponse.json(
      { error: 'Failed to add luggage' },
      { status: 500 }
    );
  }
} 