import { NextResponse } from 'next/server';
import { executeQuery } from '@/utils/dbUtils';

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
    
    await executeQuery(async (connection) => {
      // Update the airline
      const sql = 'UPDATE Airline SET airline_name = ?, country = ? WHERE airline_id = ?';
      const values = [airlineName, country, airlineId];
      
      await connection.execute(sql, values);
    });
    
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
    
    const result = await executeQuery(async (connection) => {
      // First check if there are related aircraft
      const [checkResult] = await connection.execute(
        'SELECT COUNT(*) as count FROM Aircraft WHERE airline_id = ?',
        [airlineId]
      );
      
      if (checkResult[0].count > 0) {
        return { hasRelations: true };
      }
      
      const query = 'DELETE FROM Airline WHERE airline_id = ?';
      await connection.execute(query, [airlineId]);
      
      return { hasRelations: false };
    });
    
    if (result.hasRelations) {
      return NextResponse.json(
        { error: 'Cannot delete airline with associated aircraft' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ message: 'Airline deleted successfully' });
  } catch (error) {
    console.error('Error deleting airline:', error);
    return NextResponse.json(
      { error: 'Failed to delete airline: ' + error.message },
      { status: 500 }
    );
  }
} 