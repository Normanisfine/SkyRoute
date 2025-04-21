import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/utils/db';

export async function DELETE(request, { params }) {
    try {
        const cookieStore = cookies();
        const authCookie = cookieStore.get('auth');
        
        if (!authCookie) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userData = JSON.parse(authCookie.value);
        const userId = userData.id;
        
        const id = params.id;
        
        // Check if passenger exists and belongs to user
        const [passengers] = await db.execute(
            'SELECT passenger_id FROM Passenger WHERE passenger_id = ? AND user_id = ?',
            [id, userId]
        );
        
        if (passengers.length === 0) {
            return NextResponse.json({ 
                error: 'Passenger not found or you do not have permission to delete it'
            }, { status: 404 });
        }
        
        // Check if passenger is used in any bookings
        const [bookings] = await db.execute(
            'SELECT booking_id FROM Booking WHERE passenger_id = ?',
            [id]
        );
        
        if (bookings.length > 0) {
            return NextResponse.json({ 
                error: 'Cannot delete passenger with existing bookings'
            }, { status: 409 });
        }
        
        // Delete passenger
        await db.execute(
            'DELETE FROM Passenger WHERE passenger_id = ?',
            [id]
        );
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting passenger:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
