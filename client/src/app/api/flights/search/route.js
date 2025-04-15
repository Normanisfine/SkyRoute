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

        // Modified query to search flights within date range
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
                COUNT(DISTINCT CASE WHEN p.status = 'Available' THEN p.price_id END) as availableSeats
            FROM 
                Flight f
                JOIN Airport dep ON f.departure_airport_id = dep.airport_id
                JOIN Airport arr ON f.arrival_airport_id = arr.airport_id
                JOIN Airline al ON f.airline_id = al.airline_id
                LEFT JOIN Flight_Status fs ON f.flight_id = fs.flight_id
                LEFT JOIN Price p ON f.flight_id = p.flight_id
            WHERE 
                (dep.iata_code = ? OR LOWER(dep.city) = LOWER(?))
                AND (arr.iata_code = ? OR LOWER(arr.city) = LOWER(?))
                AND DATE(f.departure_time) >= ?
                ${returnDate ? 'AND DATE(f.departure_time) <= ?' : ''}
                AND fs.status != 'Cancelled'
            GROUP BY 
                f.flight_id
            HAVING 
                availableSeats > 0
            ORDER BY 
                f.departure_time
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
            departureTime: new Date(row.departureDateTime).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }).toLowerCase(),
            arrivalTime: new Date(row.arrivalDateTime).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }).toLowerCase(),
            departureDate: new Date(row.departureDateTime).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            duration: calculateDuration(row.departureDateTime, row.arrivalDateTime),
            price: row.basePrice,
            date: new Date(row.departureDateTime).toISOString().split('T')[0],
            stops: 0,
            status: row.flightStatus,
            availableSeats: row.availableSeats
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
