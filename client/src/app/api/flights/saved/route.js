import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { executeQuery, executeTransaction } from '@/utils/dbUtils';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userData = JSON.parse(authCookie.value);
    const userId = userData.id;
    
    const savedFlights = await executeQuery(async (connection) => {
      const [rows] = await connection.execute(`
        SELECT 
          sf.saved_flight_id,
          sf.user_id,
          sf.flight_id,
          f.flight_number,
          f.departure_time,
          f.arrival_time,
          f.basic_price,
          dep.airport_name as departure_airport,
          dep.iata_code as departure_code,
          arr.airport_name as arrival_airport,
          arr.iata_code as arrival_code,
          al.airline_name
        FROM 
          Saved_Flights sf
          JOIN Flight f ON sf.flight_id = f.flight_id
          JOIN Airport dep ON f.departure_airport_id = dep.airport_id
          JOIN Airport arr ON f.arrival_airport_id = arr.airport_id
          JOIN Airline al ON f.airline_id = al.airline_id
        WHERE 
          sf.user_id = ?
      `, [userId]);
      
      return rows;
    });
    
    return NextResponse.json(savedFlights);
  } catch (error) {
    console.error('Error fetching saved flights:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userData = JSON.parse(authCookie.value);
    const userId = userData.id;
    
    const { flightId } = await request.json();
    
    const result = await executeTransaction(async (connection) => {
      // Check if already saved
      const [existingRows] = await connection.execute(
        'SELECT saved_flight_id FROM Saved_Flights WHERE user_id = ? AND flight_id = ?',
        [userId, flightId]
      );
      
      if (existingRows.length > 0) {
        return { alreadySaved: true };
      }
      
      // Save the flight
      const [result] = await connection.execute(
        'INSERT INTO Saved_Flights (user_id, flight_id) VALUES (?, ?)',
        [userId, flightId]
      );
      
      return { saved: true, id: result.insertId };
    });
    
    if (result.alreadySaved) {
      return NextResponse.json({ message: 'Flight already saved' });
    }
    
    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error saving flight:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userData = JSON.parse(authCookie.value);
    const userId = userData.id;
    
    const { searchParams } = new URL(request.url);
    const flightId = searchParams.get('flightId');
    
    await executeQuery(async (connection) => {
      await connection.execute(
        'DELETE FROM Saved_Flights WHERE user_id = ? AND flight_id = ?',
        [userId, flightId]
      );
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting saved flight:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 