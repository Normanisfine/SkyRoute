import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const originInput = searchParams.get('origin');
        const destinationInput = searchParams.get('destination');
        const departDate = searchParams.get('departDate');
        const returnDate = searchParams.get('returnDate');

        if (!originInput || !destinationInput || !departDate) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // Modified query to properly check seat availability from Price table
        const [rows] = await db.execute(`
            SELECT 
                f.flight_id as id,
                f.flight_number as flightNumber,
                f.departure_time as departureDateTime,
                f.arrival_time as arrivalDateTime,
                f.basic_price as basePrice,
                dep.iata_code as origin,
                dep.city as originCity,
                arr.iata_code as destination,
                arr.city as destinationCity,
                al.airline_name as airline,
                fs.status as flightStatus,
                s.class_type as seatClass,
                COUNT(DISTINCT CASE WHEN p.status = 'Available' THEN p.price_id END) as availableSeats,
                MIN(CASE WHEN p.status = 'Available' THEN p.premium_price END) as lowestPrice
            FROM 
                Flight f
                JOIN Airport dep ON f.departure_airport_id = dep.airport_id
                JOIN Airport arr ON f.arrival_airport_id = arr.airport_id
                JOIN Airline al ON f.airline_id = al.airline_id
                LEFT JOIN Flight_Status fs ON f.flight_id = fs.flight_id
                LEFT JOIN Price p ON f.flight_id = p.flight_id
                LEFT JOIN Seat s ON p.seat_id = s.seat_id
            WHERE 
                (dep.iata_code = ? OR LOWER(dep.city) = LOWER(?))
                AND (arr.iata_code = ? OR LOWER(arr.city) = LOWER(?))
                AND DATE(f.departure_time) >= ?
                ${returnDate ? 'AND DATE(f.departure_time) <= ?' : ''}
                AND fs.status != 'Cancelled'
                AND p.status = 'Available'
            GROUP BY 
                f.flight_id,
                f.flight_number,
                f.departure_time,
                f.arrival_time,
                f.basic_price,
                dep.iata_code,
                dep.city,
                arr.iata_code,
                arr.city,
                al.airline_name,
                fs.status,
                s.class_type
            HAVING 
                availableSeats > 0
            ORDER BY 
                f.departure_time, lowestPrice
        `, returnDate 
           ? [originInput, originInput, destinationInput, destinationInput, departDate, returnDate]
           : [originInput, originInput, destinationInput, destinationInput, departDate]
        );

        // Transform the data
        const flights = rows.map(row => ({
            id: row.id,
            flightNumber: row.flightNumber,
            airline: row.airline,
            origin: row.origin,
            originCity: row.originCity,
            destination: row.destination,
            destinationCity: row.destinationCity,
            departureDateTime: row.departureDateTime,
            arrivalDateTime: row.arrivalDateTime,
            departureTime: row.departureDateTime,
            arrivalTime: row.arrivalDateTime,
            basePrice: parseFloat(row.basePrice),
            lowestPrice: row.lowestPrice ? parseFloat(row.lowestPrice) : parseFloat(row.basePrice),
            status: row.flightStatus,
            availableSeats: parseInt(row.availableSeats),
            seatClass: row.seatClass
        }));

        return NextResponse.json(flights);
    } catch (error) {
        console.error('Error searching flights:', error);
        return NextResponse.json(
            { error: 'Failed to search flights' },
            { status: 500 }
        );
    }
}

function calculateDuration(departure, arrival) {
    const durationMs = new Date(arrival) - new Date(departure);
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}
