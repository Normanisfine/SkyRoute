import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { executeQuery, executeTransaction } from '@/utils/dbUtils';

export async function DELETE(request, { params }) {
    try {
        const cookieStore = await cookies();
        const authCookie = cookieStore.get('auth');
        
        if (!authCookie) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userData = JSON.parse(authCookie.value);
        const userId = userData.id;
        
        const id = params.id;
        
        // Use executeTransaction for this multi-step operation
        const result = await executeTransaction(async (connection) => {
            // Check if passenger exists and belongs to user
            const [passengers] = await connection.execute(
                'SELECT passenger_id FROM Passenger WHERE passenger_id = ? AND user_id = ?',
                [id, userId]
            );
            
            if (passengers.length === 0) {
                return { error: 'not_found' };
            }
            
            // Check if passenger is used in any bookings
            const [bookings] = await connection.execute(
                'SELECT booking_id FROM Booking WHERE passenger_id = ?',
                [id]
            );
            
            if (bookings.length > 0) {
                return { error: 'has_bookings' };
            }
            
            // Delete passenger
            await connection.execute(
                'DELETE FROM Passenger WHERE passenger_id = ?',
                [id]
            );
            
            return { success: true };
        });
        
        if (result.error === 'not_found') {
            return NextResponse.json({ 
                error: 'Passenger not found or you do not have permission to delete it'
            }, { status: 404 });
        }
        
        if (result.error === 'has_bookings') {
            return NextResponse.json({ 
                error: 'Cannot delete passenger with existing bookings'
            }, { status: 409 });
        }
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting passenger:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
