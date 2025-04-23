import { NextResponse } from 'next/server';
import { executeQuery, executeTransaction } from '@/utils/dbUtils';

export async function GET() {
  try {
    const prices = await executeQuery(async (connection) => {
      const query = `
        SELECT 
          p.price_id,
          p.flight_id,
          p.seat_id,
          p.premium_price,
          p.status,
          f.flight_number,
          s.seat_number,
          s.class_type
        FROM Price p
        JOIN Flight f ON p.flight_id = f.flight_id
        JOIN Seat s ON p.seat_id = s.seat_id
        ORDER BY p.flight_id, s.seat_number
      `;

      const [rows] = await connection.execute(query);
      return rows;
    });
    
    return NextResponse.json(prices);
  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prices' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { flightId, seatId, premiumPrice, status } = await request.json();
    
    const result = await executeTransaction(async (connection) => {
      // First check if a price already exists for this flight and seat
      const checkQuery = `
        SELECT price_id FROM Price 
        WHERE flight_id = ? AND seat_id = ?
      `;
      
      const [existing] = await connection.execute(checkQuery, [flightId, seatId]);
      
      if (existing.length > 0) {
        return { error: 'exists' };
      }

      // If no existing price, insert new one
      const insertQuery = `
        INSERT INTO Price (flight_id, seat_id, premium_price, status)
        VALUES (?, ?, ?, ?)
      `;

      const [result] = await connection.execute(insertQuery, [
        flightId,
        seatId,
        premiumPrice,
        status
      ]);

      return { priceId: result.insertId };
    });

    if (result.error === 'exists') {
      return NextResponse.json(
        { error: 'Price already exists for this seat and flight' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      priceId: result.priceId 
    });
  } catch (error) {
    console.error('Error adding price:', error);
    return NextResponse.json(
      { error: 'Failed to add price' },
      { status: 500 }
    );
  }
}
