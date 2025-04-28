import { NextResponse } from 'next/server';
import { executeQuery } from '@/utils/dbUtils';

export async function PUT(request, { params }) {
  try {
    const seatId = params.seatId;
    const { aircraftId, seatNumber, classType } = await request.json();

    if (!aircraftId || !seatNumber || !classType) {
      return NextResponse.json(
        { error: 'Aircraft, seat number, and class type are required' },
        { status: 400 }
      );
    }

    // Check for duplicate seat number in the same aircraft (excluding this seat)
    const duplicateCheck = await executeQuery(async (connection) => {
      const [existing] = await connection.execute(
        'SELECT seat_id FROM Seat WHERE aircraft_id = ? AND seat_number = ? AND seat_id != ?',
        [aircraftId, seatNumber, seatId]
      );
      return existing;
    });

    if (duplicateCheck.length > 0) {
      return NextResponse.json(
        { error: 'Seat number already exists for this aircraft' },
        { status: 400 }
      );
    }

    await executeQuery(async (connection) => {
      await connection.execute(
        'UPDATE Seat SET aircraft_id = ?, seat_number = ?, class_type = ? WHERE seat_id = ?',
        [aircraftId, seatNumber, classType, seatId]
      );
    });

    return NextResponse.json({ success: true, message: 'Seat updated successfully' });
  } catch (error) {
    console.error('Error updating seat:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update seat' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const seatId = params.seatId;
    await executeQuery(async (connection) => {
      await connection.execute('DELETE FROM Seat WHERE seat_id = ?', [seatId]);
    });
    return NextResponse.json({ success: true, message: 'Seat deleted successfully' });
  } catch (error) {
    console.error('Error deleting seat:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete seat' },
      { status: 500 }
    );
  }
}
