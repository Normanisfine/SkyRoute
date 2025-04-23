// src/app/api/login/route.js
import { cookies } from 'next/headers';
import db from '../../../utils/db';
import bcrypt from 'bcrypt';

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    // Query database for user by email including the role
    const [users] = await db.query(
      'SELECT * FROM AirlineUser WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return Response.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const user = users[0];

    // Compare password hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return Response.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Set authentication cookie with role information
    cookies().set('auth', JSON.stringify({
      id: user.user_id,
      email: user.email,
      name: user.name,
      role: user.role || 'customer' // Include role, default to 'customer' if not specified
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}