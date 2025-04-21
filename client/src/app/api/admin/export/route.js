import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/utils/db';

export async function GET(request) {
  try {
    // Get auth cookie
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    
    // For development/testing purposes, you can comment out this authentication check
    // or modify it based on your authentication system
    if (!authCookie) {
      return NextResponse.json({ error: 'You must be logged in to access this resource' }, { status: 401 });
    }

    let userData;
    try {
      userData = JSON.parse(authCookie.value);
    } catch (e) {
      console.error('Error parsing auth cookie:', e);
      return NextResponse.json({ error: 'Invalid authentication data' }, { status: 401 });
    }
    
    // Check admin role - temporarily comment this out if needed for testing
    // or adjust to match your authentication system's role structure
    // if (userData.role !== 'admin') {
    //   return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    // }

    // Get query parameters for filtering
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'bookings';
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const format = url.searchParams.get('format') || 'json';

    let data = [];
    let filename = '';

    // Fetch data based on the requested type
    switch (type) {
      case 'bookings':
        [data, filename] = await getBookingsData(startDate, endDate);
        break;
      case 'flights':
        [data, filename] = await getFlightsData(startDate, endDate);
        break;
      case 'passengers':
        [data, filename] = await getPassengersData();
        break;
      case 'revenue':
        [data, filename] = await getRevenueData(startDate, endDate);
        break;
      default:
        return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
    }

    // Format output based on requested format
    if (format === 'csv') {
      const csv = convertToCSV(data);
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}.csv"`
        }
      });
    } else {
      return NextResponse.json({
        data,
        count: data.length,
        filename: `${filename}.json`
      });
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper function to get bookings data
async function getBookingsData(startDate, endDate) {
  let query = `
    SELECT 
      b.booking_id,
      b.booking_time,
      b.status,
      u.name as user_name,
      u.email,
      p.name as passenger_name,
      f.flight_number,
      f.departure_time,
      f.arrival_time,
      dep.iata_code as departure_code,
      arr.iata_code as arrival_code,
      s.seat_number,
      s.class_type,
      f.basic_price,
      pr.premium_price,
      (f.basic_price + pr.premium_price) as total_price,
      pay.payment_method,
      pay.payment_status
    FROM 
      Booking b
      JOIN AirlineUser u ON b.user_id = u.user_id
      JOIN Passenger p ON b.passenger_id = p.passenger_id
      JOIN Price pr ON b.price_id = pr.price_id
      JOIN Flight f ON pr.flight_id = f.flight_id
      JOIN Airport dep ON f.departure_airport_id = dep.airport_id
      JOIN Airport arr ON f.arrival_airport_id = arr.airport_id
      JOIN Seat s ON pr.seat_id = s.seat_id
      LEFT JOIN Payment pay ON b.booking_id = pay.booking_id
  `;

  const params = [];
  
  if (startDate || endDate) {
    query += ' WHERE ';
    
    if (startDate) {
      query += 'b.booking_time >= ?';
      params.push(startDate);
      
      if (endDate) {
        query += ' AND b.booking_time <= ?';
        params.push(endDate);
      }
    } else if (endDate) {
      query += 'b.booking_time <= ?';
      params.push(endDate);
    }
  }
  
  query += ' ORDER BY b.booking_time DESC';

  const [rows] = await db.execute(query, params);
  
  // Format the filename
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `bookings_export_${dateStr}`;
  
  return [rows, filename];
}

// Helper function to get flights data
async function getFlightsData(startDate, endDate) {
  let query = `
    SELECT 
      f.flight_id,
      f.flight_number,
      f.departure_time,
      f.arrival_time,
      dep.airport_name as departure_airport,
      dep.iata_code as departure_code,
      arr.airport_name as arrival_airport,
      arr.iata_code as arrival_code,
      a.model as aircraft_model,
      al.airline_name,
      f.basic_price,
      fs.status,
      fs.last_updated as status_updated,
      (SELECT COUNT(*) FROM Booking b JOIN Price pr ON b.price_id = pr.price_id 
       WHERE pr.flight_id = f.flight_id) as bookings_count
    FROM 
      Flight f
      JOIN Airport dep ON f.departure_airport_id = dep.airport_id
      JOIN Airport arr ON f.arrival_airport_id = arr.airport_id
      JOIN Aircraft a ON f.aircraft_id = a.aircraft_id
      JOIN Airline al ON f.airline_id = al.airline_id
      LEFT JOIN Flight_Status fs ON f.flight_id = fs.flight_id
  `;

  const params = [];
  
  if (startDate || endDate) {
    query += ' WHERE ';
    
    if (startDate) {
      query += 'f.departure_time >= ?';
      params.push(startDate);
      
      if (endDate) {
        query += ' AND f.departure_time <= ?';
        params.push(endDate);
      }
    } else if (endDate) {
      query += 'f.departure_time <= ?';
      params.push(endDate);
    }
  }
  
  query += ' ORDER BY f.departure_time';

  const [rows] = await db.execute(query, params);
  
  // Format the filename
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `flights_export_${dateStr}`;
  
  return [rows, filename];
}

// Helper function to get passengers data
async function getPassengersData() {
  const query = `
    SELECT 
      p.passenger_id,
      p.name,
      p.passport_number,
      p.dob,
      u.name as user_name,
      u.email,
      (SELECT COUNT(*) FROM Booking b WHERE b.passenger_id = p.passenger_id) as bookings_count
    FROM 
      Passenger p
      LEFT JOIN AirlineUser u ON p.user_id = u.user_id
    ORDER BY p.name
  `;

  const [rows] = await db.execute(query);
  
  // Format the filename
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `passengers_export_${dateStr}`;
  
  return [rows, filename];
}

// Helper function to get revenue data
async function getRevenueData(startDate, endDate) {
  let query = `
    SELECT 
      DATE(b.booking_time) as date,
      COUNT(*) as bookings_count,
      SUM(f.basic_price) as base_revenue,
      SUM(pr.premium_price) as premium_revenue,
      SUM(f.basic_price + pr.premium_price) as total_revenue,
      s.class_type,
      dep.iata_code as departure_code,
      arr.iata_code as arrival_code
    FROM 
      Booking b
      JOIN Price pr ON b.price_id = pr.price_id
      JOIN Flight f ON pr.flight_id = f.flight_id
      JOIN Seat s ON pr.seat_id = s.seat_id
      JOIN Airport dep ON f.departure_airport_id = dep.airport_id
      JOIN Airport arr ON f.arrival_airport_id = arr.airport_id
  `;

  const params = [];
  
  if (startDate || endDate) {
    query += ' WHERE ';
    
    if (startDate) {
      query += 'b.booking_time >= ?';
      params.push(startDate);
      
      if (endDate) {
        query += ' AND b.booking_time <= ?';
        params.push(endDate);
      }
    } else if (endDate) {
      query += 'b.booking_time <= ?';
      params.push(endDate);
    }
  }
  
  query += ` 
    GROUP BY 
      DATE(b.booking_time), 
      s.class_type, 
      dep.iata_code, 
      arr.iata_code
    ORDER BY 
      date DESC, 
      total_revenue DESC
  `;

  const [rows] = await db.execute(query, params);
  
  // Format the filename
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `revenue_export_${dateStr}`;
  
  return [rows, filename];
}

// Helper function to convert data to CSV
function convertToCSV(jsonData) {
  if (jsonData.length === 0) {
    return '';
  }
  
  // Get headers
  const headers = Object.keys(jsonData[0]);
  
  // Create CSV string with headers
  let csvString = headers.join(',') + '\n';
  
  // Add data rows
  jsonData.forEach(item => {
    const row = headers.map(header => {
      // Handle values that might contain commas or quotes
      const value = item[header] === null || item[header] === undefined ? '' : item[header].toString();
      
      // Escape quotes and wrap in quotes if needed
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return '"' + value.replace(/"/g, '""') + '"';
      }
      return value;
    });
    
    csvString += row.join(',') + '\n';
  });
  
  return csvString;
} 