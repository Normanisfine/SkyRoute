import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { executeQuery } from '@/utils/dbUtils';

export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const authCookie = cookieStore.get('auth');
        
        if (!authCookie) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userData = JSON.parse(authCookie.value);
        const userId = userData.id;

        // Use executeQuery to properly manage connections
        const passengers = await executeQuery(async (connection) => {
            // Query uses dob column name
            const [rows] = await connection.execute(`
                SELECT 
                    passenger_id as id,
                    name,
                    passport_number,
                    dob
                FROM Passenger
                WHERE user_id = ?
                ORDER BY name
            `, [userId]);

            return rows;
        });

        return NextResponse.json(passengers);
    } catch (error) {
        console.error('Error fetching passengers:', error);
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
        
        const { name, passport_number, dob } = await request.json();
        
        // Validate required fields
        if (!name || !passport_number || !dob) {
            return NextResponse.json({ 
                error: 'Missing required fields'
            }, { status: 400 });
        }
        
        // Use executeQuery to properly manage connections
        const result = await executeQuery(async (connection) => {
            // Insert query uses dob column name
            const [result] = await connection.execute(
                'INSERT INTO Passenger (user_id, name, passport_number, dob) VALUES (?, ?, ?, ?)',
                [userId, name, passport_number, dob]
            );
            
            return { insertId: result.insertId };
        });
        
        // Return the new passenger with ID
        return NextResponse.json({
            id: result.insertId,
            name,
            passport_number,
            dob
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating passenger:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
