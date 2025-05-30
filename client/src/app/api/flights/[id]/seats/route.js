import { NextResponse } from 'next/server';
import { executeQuery } from '@/utils/dbUtils';

export async function GET(request, { params }) {
  try {
    // Await params before accessing its properties
    const { id } = await params;
    const flightId = id;
    
    // Use executeQuery to properly manage connections
    const seats = await executeQuery(async (connection) => {
      // Get all seats with their prices for this flight
      const [rows] = await connection.execute(`
        SELECT 
          s.seat_id,
          s.seat_number,
          s.class_type,
          p.premium_price,
          f.basic_price,
          p.price_id,
          p.premium_price as premium,
          p.status
        FROM Seat s
        JOIN Aircraft a ON s.aircraft_id = a.aircraft_id
        JOIN Flight f ON f.aircraft_id = a.aircraft_id
        JOIN Price p ON (p.flight_id = f.flight_id AND p.seat_id = s.seat_id)
        WHERE f.flight_id = ?
        ORDER BY s.seat_number
      `, [flightId]);

      return rows;
    });

    // Group seats by class type
    const groupedSeats = {};
    seats.forEach(seat => {
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
        isBooked: seat.status === 'Booked'
      });
    });

    return NextResponse.json(groupedSeats);
  } catch (error) {
    console.error('Error fetching seats:', error);
    return NextResponse.json({ error: 'Failed to fetch seats' }, { status: 500 });
  }
}
