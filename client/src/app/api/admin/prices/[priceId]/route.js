import { NextResponse } from 'next/server';
import { executeQuery } from '@/utils/dbUtils';

export async function PUT(request, { params }) {
  try {
    const priceId = params.priceId;
    const { flightId, seatId, premiumPrice, status } = await request.json();

    // Validate input
    if (!flightId || !seatId || !premiumPrice || !status) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check for duplicate (flightId, seatId) except for this price
    const duplicateCheck = await executeQuery(async (connection) => {
      const [existing] = await connection.execute(
        'SELECT price_id FROM Price WHERE flight_id = ? AND seat_id = ? AND price_id != ?',
        [flightId, seatId, priceId]
      );
      return existing;
    });

    if (duplicateCheck.length > 0) {
      return NextResponse.json(
        { error: 'A price for this flight and seat already exists.' },
        { status: 400 }
      );
    }

    // Update the price
    await executeQuery(async (connection) => {
      await connection.execute(
        'UPDATE Price SET flight_id = ?, seat_id = ?, premium_price = ?, status = ? WHERE price_id = ?',
        [flightId, seatId, premiumPrice, status, priceId]
      );
    });

    return NextResponse.json({ success: true, message: 'Price updated successfully' });
  } catch (error) {
    console.error('Error updating price:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update price' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const priceId = params.priceId;
    await executeQuery(async (connection) => {
      await connection.execute('DELETE FROM Price WHERE price_id = ?', [priceId]);
    });
    return NextResponse.json({ success: true, message: 'Price deleted successfully' });
  } catch (error) {
    console.error('Error deleting price:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete price' },
      { status: 500 }
    );
  }
}
