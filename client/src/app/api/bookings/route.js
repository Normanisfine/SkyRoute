import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET(request) {
    try {
        // 从请求中获取用户ID（实际应用中这里会从认证会话中获取）
        // 为简单起见，这里我们假设用户ID是1
        const userId = 1; // 正式环境中应该从认证系统获取

        // 构建查询，获取用户的所有预订信息及相关详情
        const [rows] = await db.execute(`
      SELECT 
        b.booking_id as id,
        b.booking_time,
        b.status as bookingStatus,
        f.flight_number as flightNumber,
        f.departure_time as departureDateTime,
        f.arrival_time as arrivalDateTime,
        f.basic_price as price,
        dep.iata_code as origin,
        arr.iata_code as destination,
        p.name as passenger,
        s.seat_number as seat,
        s.class_type as classType,
        al.airline_name as airline,
        fs.status as flightStatus
      FROM 
        Booking b
      JOIN 
        Price pr ON b.price_id = pr.price_id
      JOIN 
        Flight f ON pr.flight_id = f.flight_id
      JOIN 
        Airport dep ON f.departure_airport_id = dep.airport_id
      JOIN 
        Airport arr ON f.arrival_airport_id = arr.airport_id
      JOIN 
        Passenger p ON b.passenger_id = p.passenger_id
      JOIN 
        Seat s ON pr.seat_id = s.seat_id
      JOIN 
        Aircraft ac ON s.aircraft_id = ac.aircraft_id
      JOIN 
        Airline al ON f.airline_id = al.airline_id
      LEFT JOIN 
        Flight_Status fs ON f.flight_id = fs.flight_id
      WHERE 
        b.user_id = ?
      ORDER BY 
        b.booking_time DESC
    `, [userId]);

        // 转换数据格式以匹配前端需求
        const bookings = rows.map(row => {
            // 计算飞行时间
            const departureTime = new Date(row.departureDateTime);
            const arrivalTime = new Date(row.arrivalDateTime);
            const durationMs = arrivalTime - departureTime;
            const hours = Math.floor(durationMs / (1000 * 60 * 60));
            const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

            return {
                id: row.id,
                flightNumber: row.flightNumber,
                origin: row.origin,
                destination: row.destination,
                departureTime: departureTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }).toLowerCase(),
                arrivalTime: arrivalTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }).toLowerCase(),
                duration: `${hours} h ${minutes} m`,
                passenger: row.passenger,
                seat: row.seat,
                date: departureTime.toISOString().split('T')[0],
                status: row.bookingStatus === 'Paid' ? 'Confirmed' : row.bookingStatus,
                airline: row.airline,
                price: row.price,
                classType: row.classType,
                isRoundTrip: false // 这个信息需要通过其他方式确定，例如查询是否有相同旅客的往返行程
            };
        });

        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch bookings' },
            { status: 500 }
        );
    }
} 