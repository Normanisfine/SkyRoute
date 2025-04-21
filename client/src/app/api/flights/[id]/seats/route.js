import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET(request, { params }) {
  try {
    // Await params before accessing its properties
    const { id } = await params;
    const flightId = id;
    
    // Get all seats with their prices for this flight
    const [rows] = await db.execute(`
      SELECT 
        s.seat_id,
        s.seat_number,
        s.class_type,
        p.premium_price,
        f.basic_price,
        p.price_id,
        p.premium_price as premium,
        CASE WHEN b.booking_id IS NULL THEN 0 ELSE 1 END as is_booked
      FROM Seat s
      JOIN Aircraft a ON s.aircraft_id = a.aircraft_id
      JOIN Flight f ON f.aircraft_id = a.aircraft_id
      JOIN Price p ON (p.flight_id = f.flight_id AND p.seat_id = s.seat_id)
      LEFT JOIN Booking b ON (b.price_id = p.price_id)
      WHERE f.flight_id = ?
      ORDER BY s.seat_number
    `, [flightId]);

    // Group seats by class type
    const groupedSeats = {};
    rows.forEach(seat => {
      if (!groupedSeats[seat.class_type]) {
        groupedSeats[seat.class_type] = [];
      }
      
      const basePrice = parseFloat(seat.basic_price) || 0;
      const premiumPrice = parseFloat(seat.premium) || 0;
      
      groupedSeats[seat.class_type].push({
        id: seat.seat_id,
        number: seat.seat_number,
        premium: premiumPrice,
        totalPrice: basePrice + premiumPrice,
        basePrice: basePrice,
        priceId: seat.price_id,
        isBooked: seat.is_booked === 1
      });
    });

    return NextResponse.json(groupedSeats);
  } catch (error) {
    console.error('Error fetching seats:', error);
    return NextResponse.json({ error: 'Failed to fetch seats' }, { status: 500 });
  }
}
