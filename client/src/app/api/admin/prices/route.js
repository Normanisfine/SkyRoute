import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET() {
  try {
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

    const [rows] = await db.execute(query);
    console.log('Prices fetched:', rows); // Debug log
    return NextResponse.json(rows);
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
    
    // First check if a price already exists for this flight and seat
    const checkQuery = `
      SELECT price_id FROM Price 
      WHERE flight_id = ? AND seat_id = ?
    `;
    
    const [existing] = await db.execute(checkQuery, [flightId, seatId]);
    
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Price already exists for this seat and flight' },
        { status: 400 }
      );
    }

    // If no existing price, insert new one
    const insertQuery = `
      INSERT INTO Price (flight_id, seat_id, premium_price, status)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.execute(insertQuery, [
      flightId,
      seatId,
      premiumPrice,
      status
    ]);

    return NextResponse.json({ 
      success: true, 
      priceId: result.insertId 
    });
  } catch (error) {
    console.error('Error adding price:', error);
    return NextResponse.json(
      { error: 'Failed to add price' },
      { status: 500 }
    );
  }
}
