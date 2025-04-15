import { NextResponse } from 'next/server';
import db from '@/utils/db';

const getUserIdFromCookie = async (request) => {
  const authCookie = request.cookies.get('auth');
  if (!authCookie) {
    throw new Error('Not authenticated');
  }
  return JSON.parse(authCookie.value).userId;
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

export async function PUT(request) {
  try {
    const userId = await getUserIdFromCookie(request);
    const { name, email, phone, passport_number } = await request.json();

    await db.execute(
      'UPDATE AirlineUser SET name = ?, email = ?, phone = ?, passport_number = ? WHERE user_id = ?',
      [name, email, phone, passport_number, userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
} 