import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { executeQuery } from '@/utils/dbUtils';

export async function PUT(request, { params }) {
  try {
    const { id, luggageId } = await params;
    
    // Get the request body
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

    // Check if booking belongs to user and update luggage
    const result = await executeQuery(async (connection) => {
      // Verify booking belongs to user
      const [bookingRows] = await connection.execute(
        'SELECT booking_id FROM Booking WHERE booking_id = ? AND user_id = ?',
        [id, userId]
      );
      
      if (bookingRows.length === 0) {
        return { notFound: true, type: 'booking' };
      }
      
      // Verify luggage belongs to the booking
      const [luggageRows] = await connection.execute(
        'SELECT luggage_id FROM Luggage WHERE luggage_id = ? AND booking_id = ?',
        [luggageId, id]
      );
      
      if (luggageRows.length === 0) {
        return { notFound: true, type: 'luggage' };
      }
      
      // Update luggage
      await connection.execute(
        'UPDATE Luggage SET weight = ?, dimensions = ? WHERE luggage_id = ?',
        [weight, dimensions, luggageId]
      );
      
      // Get the updated luggage
      const [updatedRows] = await connection.execute(
        'SELECT luggage_id as id, weight, dimensions FROM Luggage WHERE luggage_id = ?',
        [luggageId]
      );
      
      return { luggage: updatedRows[0], success: true };
    });

    if (result.notFound) {
      return NextResponse.json(
        { error: `${result.type === 'booking' ? 'Booking' : 'Luggage'} not found` }, 
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating luggage:', error);
    return NextResponse.json(
      { error: 'Failed to update luggage' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id, luggageId } = await params;
    
    // Get user ID from auth cookie
    const cookieStore = cookies();
    const authCookie = await cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = JSON.parse(authCookie.value);
    const userId = userData.id;

    // Check if booking belongs to user and delete luggage
    const result = await executeQuery(async (connection) => {
      // Verify booking belongs to user
      const [bookingRows] = await connection.execute(
        'SELECT booking_id FROM Booking WHERE booking_id = ? AND user_id = ?',
        [id, userId]
      );
      
      if (bookingRows.length === 0) {
        return { notFound: true, type: 'booking' };
      }
      
      // Verify luggage belongs to the booking
      const [luggageRows] = await connection.execute(
        'SELECT luggage_id FROM Luggage WHERE luggage_id = ? AND booking_id = ?',
        [luggageId, id]
      );
      
      if (luggageRows.length === 0) {
        return { notFound: true, type: 'luggage' };
      }
      
      // Delete luggage
      await connection.execute(
        'DELETE FROM Luggage WHERE luggage_id = ?',
        [luggageId]
      );
      
      return { success: true };
    });

    if (result.notFound) {
      return NextResponse.json(
        { error: `${result.type === 'booking' ? 'Booking' : 'Luggage'} not found` }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting luggage:', error);
    return NextResponse.json(
      { error: 'Failed to delete luggage' },
      { status: 500 }
    );
  }
} 