import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json({ isAdmin: false });
    }
    
    const userData = JSON.parse(authCookie.value);
    const isAdmin = userData.role === 'admin';
    
    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error('Error checking admin role:', error);
    return NextResponse.json({ isAdmin: false });
  }
} 