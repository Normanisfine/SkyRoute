import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Clear the auth cookie - with await before cookies()
    const cookieStore = await cookies();
    cookieStore.set('auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
} 