import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// 数据库连接配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'skyroute',
};

// GET - 获取所有航空器
export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // 获取航空器数据，包括关联的航空公司信息
    const [rows] = await connection.execute(`
      SELECT a.*, al.airline_name 
      FROM Aircraft a
      LEFT JOIN Airline al ON a.airline_id = al.airline_id
      ORDER BY a.aircraft_id DESC
    `);

    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching aircraft:', error);
    return NextResponse.json(
      { error: 'Failed to fetch aircraft data' },
      { status: 500 }
    );
  }
}

// POST - 创建新航空器
export async function POST(request) {
  try {
    const data = await request.json();
    const { model, totalSeats, airlineId } = data;

    // 验证必填字段
    if (!model || !totalSeats || !airlineId) {
      return NextResponse.json(
        { error: 'Model, total seats and airline ID are required' },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // 插入航空器数据
    const [result] = await connection.execute(
      'INSERT INTO Aircraft (model, total_seats, airline_id) VALUES (?, ?, ?)',
      [model, totalSeats, airlineId]
    );

    await connection.end();

    return NextResponse.json({
      message: 'Aircraft created successfully',
      aircraft_id: result.insertId
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating aircraft:', error);
    return NextResponse.json(
      { error: 'Failed to create aircraft' },
      { status: 500 }
    );
  }
}
