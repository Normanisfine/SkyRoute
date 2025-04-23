import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { executeQuery, executeTransaction } from '@/utils/dbUtils';

// Helper function to check admin role
async function checkAdminRole(request) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth');
  
  if (!authCookie) {
    return false;
  }
  
  try {
    const userData = JSON.parse(authCookie.value);
    return userData.role === 'admin';
  } catch (error) {
    console.error('Failed to parse auth cookie:', error);
    return false;
  }
}

export async function POST(request) {
  // Check if user is admin
  const isAdmin = await checkAdminRole(request);
  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    );
  }
  
  try {
    const {
      flightNumber,
      departureAirportId,
      arrivalAirportId,
      departureTime,
      arrivalTime,
      aircraftId,
      airlineId,
      basicPrice,
      status
    } = await request.json();

    const result = await executeTransaction(async (connection) => {
      // Insert flight
      const [flightResult] = await connection.execute(`
        INSERT INTO Flight (
          flight_number,
          departure_airport_id,
          arrival_airport_id,
          departure_time,
          arrival_time,
          aircraft_id,
          airline_id,
          basic_price
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        flightNumber,
        departureAirportId,
        arrivalAirportId,
        departureTime,
        arrivalTime,
        aircraftId,
        airlineId,
        basicPrice
      ]);

      // Insert flight status
      await connection.execute(`
        INSERT INTO Flight_Status (flight_id, status, last_updated)
        VALUES (?, ?, NOW())
      `, [flightResult.insertId, status || 'On-Time']);
      
      return { insertId: flightResult.insertId };
    });
    
    return NextResponse.json({ 
      success: true, 
      insertId: result.insertId 
    });
  } catch (error) {
    console.error('Error adding flight:', error);
    return NextResponse.json(
      { error: 'Failed to add flight' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  // Check if user is admin
  const isAdmin = await checkAdminRole(request);
  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    );
  }
  
  try {
    const flights = await executeQuery(async (connection) => {
      const [rows] = await connection.execute(`
        SELECT DISTINCT
          f.flight_id,
          f.flight_number,
          f.departure_airport_id,
          f.arrival_airport_id,
          f.departure_time,
          f.arrival_time,
          f.aircraft_id,
          f.airline_id,
          f.basic_price,
          fs.status,
          fs.last_updated,
          dep.airport_name as departure_airport,
          arr.airport_name as arrival_airport
        FROM Flight f
        LEFT JOIN Flight_Status fs ON f.flight_id = fs.flight_id
        LEFT JOIN Airport dep ON f.departure_airport_id = dep.airport_id
        LEFT JOIN Airport arr ON f.arrival_airport_id = arr.airport_id
        ORDER BY f.flight_id
      `);
      return rows;
    });
    
    return NextResponse.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
