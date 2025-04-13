import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/utils/db';

export async function GET() {
  try {
    // Get auth cookie
    const cookieStore = cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json({ role: 'guest' }, { status: 200 });
    }
    
    // Parse user data
    const userData = JSON.parse(authCookie.value);
    const userId = userData.id;
    
    // Check in database for user role
    const [users] = await db.query(
      'SELECT role FROM AirlineUser WHERE user_id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return NextResponse.json({ role: 'guest' }, { status: 200 });
    }
    
    return NextResponse.json({ role: users[0].role }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user role:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user role' },
      { status: 500 }
    );
  }
} 