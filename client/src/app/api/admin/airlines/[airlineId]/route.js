import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function PUT(request, { params }) {
  try {
    // Extract the airline ID from route parameters
    const { airlineId } = params;
    
    // Parse the request body
    const data = await request.json();
    
    // Extract airline data
    const { airlineName, country } = data;
    
    // Validate required fields
    if (!airlineName || !country) {
      return NextResponse.json(
        { error: 'Airline name and country are required' },
        { status: 400 }
      );
    }
    
    // Update the airline
    const sql = 'UPDATE Airline SET airline_name = ?, country = ? WHERE airline_id = ?';
    const values = [airlineName, country, airlineId];
    
    await db.execute(sql, values);
    
    // Return success response
    return NextResponse.json({ success: true, message: 'Airline updated successfully' });
  } catch (error) {
    console.error('Error updating airline:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update airline' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { airlineId } = params;
    
    // First check if there are related aircraft
    const [checkResult] = await db.execute(
      'SELECT COUNT(*) as count FROM Aircraft WHERE airline_id = ?',
      [airlineId]
    );
    
    if (checkResult[0].count > 0) {
      return NextResponse.json(
        { error: 'Cannot delete airline with associated aircraft' },
        { status: 400 }
      );
    }
    
    const query = 'DELETE FROM Airline WHERE airline_id = ?';
    await db.execute(query, [airlineId]);
    
    return NextResponse.json({ message: 'Airline deleted successfully' });
  } catch (error) {
    console.error('Error deleting airline:', error);
    return NextResponse.json(
      { error: 'Failed to delete airline: ' + error.message },
      { status: 500 }
    );
  }
} 