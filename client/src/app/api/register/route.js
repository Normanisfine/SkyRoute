// src/app/api/register/route.js
import db from '../../../utils/db';
import bcrypt from 'bcrypt';

export async function POST(request) {
    console.log('api called');
  const { name, email, phone, passport_number, password } = await request.json();
  
  try {
    console.log('Received registration data:', { name, email, phone, passport_number });

    // Check if user already exists
    const [existingUsers] = await db.query(
      'SELECT * FROM AirlineUser WHERE email = ? OR passport_number = ?',
      [email, passport_number]
    );
    
    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      if (existingUser.email === email) {
        console.log('Email already in use');
        return Response.json({ message: 'Email already in use' }, { status: 400 });
      }
      if (existingUser.passport_number === passport_number) {
        console.log('Passport number already registered');
        return Response.json({ message: 'Passport number already registered' }, { status: 400 });
      }
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Password hashed successfully');

    // Insert new user
    const result = await db.query(
      'INSERT INTO AirlineUser (name, email, phone, passport_number, password) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, passport_number, hashedPassword]
    );
    console.log('User inserted:', result);

    return Response.json({ success: true });
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}