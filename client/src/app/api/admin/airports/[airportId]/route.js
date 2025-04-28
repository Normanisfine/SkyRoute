import { NextResponse } from 'next/server';
import { executeTransaction } from '@/utils/dbUtils';

export async function PUT(request, { params }) {
  try {
    const airportId = params.airportId;
    const {
      airportName,
      city,
      country,
      iataCode,
      icaoCode
    } = await request.json();

    await executeTransaction(async (connection) => {
      await connection.execute(
        `UPDATE Airport
         SET airport_name = ?, city = ?, country = ?, iata_code = ?, icao_code = ?
         WHERE airport_id = ?`,
        [airportName, city, country, iataCode, icaoCode, airportId]
      );
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating airport:', error);
    return NextResponse.json({ error: 'Failed to update airport' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const airportId = params.airportId;

    await executeTransaction(async (connection) => {
      // Check for related flights (as departure or arrival)
      const [relatedFlights] = await connection.execute(
        `SELECT COUNT(*) as count FROM Flight WHERE departure_airport_id = ? OR arrival_airport_id = ?`,
        [airportId, airportId]
      );
      if (relatedFlights[0].count > 0) {
        throw new Error('Cannot delete airport with related flights.');
      }

      // Check for related baggage claims
      const [relatedBaggage] = await connection.execute(
        `SELECT COUNT(*) as count FROM Baggage_Claim WHERE airport_id = ?`,
        [airportId]
      );
      if (relatedBaggage[0].count > 0) {
        throw new Error('Cannot delete airport with related baggage claims.');
      }

      // If no relations, delete the airport
      await connection.execute(
        `DELETE FROM Airport WHERE airport_id = ?`,
        [airportId]
      );
    });

    return NextResponse.json({ message: 'Airport deleted successfully' });
  } catch (error) {
    console.error('Error deleting airport:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete airport' },
      { status: 400 }
    );
  }
}
