import { NextResponse } from 'next/server';
import db from '@/utils/db';

const getUserIdFromCookie = async (request) => {
  const authCookie = request.cookies.get('auth');
  if (!authCookie) {
    throw new Error('Not authenticated');
  }
  return JSON.parse(authCookie.value).id;
};

export async function GET(request) {
  try {
    const userId = await getUserIdFromCookie(request);

    const [rows] = await db.execute(
      'SELECT user_id, name, email, phone, passport_number FROM AirlineUser WHERE user_id = ?',
      [userId]
    );

    if (!rows[0]) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// update profile
export async function PUT(request) {
  try {
    const userId = await getUserIdFromCookie(request);
    const body = await request.json();
    
    const { name, email, phone, passport_number } = body;

    // Check if all required fields are present
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // First check if the passport number is already in use by another user
    if (passport_number) {
      const [existingUsers] = await db.execute(
        'SELECT user_id FROM AirlineUser WHERE passport_number = ? AND user_id != ?',
        [passport_number, userId]
      );
      
      if (existingUsers.length > 0) {
        return NextResponse.json({ 
          error: 'This passport number is already registered to another user',
          field: 'passport_number'
        }, { status: 409 });
      }
    }

    // If no conflict, proceed with the update
    await db.execute(
      'UPDATE AirlineUser SET name = ?, email = ?, phone = ?, passport_number = ? WHERE user_id = ?',
      [name, email, phone || null, passport_number || null, userId]
    );

    return NextResponse.json({ 
      success: true,
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ 
      error: error.message
    }, { status: 500 });
  }
}