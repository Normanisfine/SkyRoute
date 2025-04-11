import React from 'react';
import db from '../../utils/db';

// This is a Server Component by default in the App Router
export default async function Bookings() {
  // Fetch data directly in the component
  const [rows] = await db.query('SELECT * FROM User'); // Replace with your table
  const data = JSON.parse(JSON.stringify(rows));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-5xl font-bold">Bookings</h1>
      <ul className="mt-6">
        {data.map((item, index) => (
          <li key={index} className="text-xl text-gray-600">
            {item.name} - {item.details} {/* Adjust based on your table columns */}
          </li>
        ))}
      </ul>
    </div>
  );
}
