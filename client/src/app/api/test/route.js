// src/app/api/test/route.js

export async function GET(request) {
    console.log('Test API called');
    return new Response(JSON.stringify({ message: 'Test API is working!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }