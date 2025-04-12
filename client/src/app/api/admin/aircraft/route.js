import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET() {
  try {
    const [rows] = await db.execute('SELECT * FROM Aircraft');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch aircraft' },
      { status: 500 }
    );
  }
}
