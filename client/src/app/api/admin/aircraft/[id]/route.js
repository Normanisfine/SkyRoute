import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// 数据库连接配置
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'skyroute',
};

// GET - 获取单个航空器
export async function GET(request, { params }) {
    try {
        const { id } = params;
        const connection = await mysql.createConnection(dbConfig);

        const [rows] = await connection.execute(
            `SELECT a.*, al.airline_name 
       FROM Aircraft a
       LEFT JOIN Airline al ON a.airline_id = al.airline_id
       WHERE a.aircraft_id = ?`,
            [id]
        );

        await connection.end();

        if (rows.length === 0) {
            return NextResponse.json(
                { error: 'Aircraft not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error('Error fetching aircraft:', error);
        return NextResponse.json(
            { error: 'Failed to fetch aircraft data' },
            { status: 500 }
        );
    }
}

// PUT - 更新航空器
export async function PUT(request, { params }) {
    try {
        const { id } = params;
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

        // 检查航空器是否存在
        const [existingRows] = await connection.execute(
            'SELECT * FROM Aircraft WHERE aircraft_id = ?',
            [id]
        );

        if (existingRows.length === 0) {
            await connection.end();
            return NextResponse.json(
                { error: 'Aircraft not found' },
                { status: 404 }
            );
        }

        // 更新航空器数据
        await connection.execute(
            'UPDATE Aircraft SET model = ?, total_seats = ?, airline_id = ? WHERE aircraft_id = ?',
            [model, totalSeats, airlineId, id]
        );

        await connection.end();

        return NextResponse.json({
            message: 'Aircraft updated successfully'
        });
    } catch (error) {
        console.error('Error updating aircraft:', error);
        return NextResponse.json(
            { error: 'Failed to update aircraft' },
            { status: 500 }
        );
    }
}

// DELETE - 删除航空器
export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        const connection = await mysql.createConnection(dbConfig);

        // 检查航空器是否存在
        const [existingRows] = await connection.execute(
            'SELECT * FROM Aircraft WHERE aircraft_id = ?',
            [id]
        );

        if (existingRows.length === 0) {
            await connection.end();
            return NextResponse.json(
                { error: 'Aircraft not found' },
                { status: 404 }
            );
        }

        // 在删除航空器之前，检查是否有与之关联的座位和航班
        const [relatedFlights] = await connection.execute(
            'SELECT COUNT(*) as count FROM Flight WHERE aircraft_id = ?',
            [id]
        );

        const [relatedSeats] = await connection.execute(
            'SELECT COUNT(*) as count FROM Seat WHERE aircraft_id = ?',
            [id]
        );

        // 如果有关联记录，则提示约束错误
        if (relatedFlights[0].count > 0 || relatedSeats[0].count > 0) {
            await connection.end();
            return NextResponse.json(
                { error: 'Cannot delete aircraft with related flights or seats' },
                { status: 400 }
            );
        }

        // 删除航空器
        await connection.execute(
            'DELETE FROM Aircraft WHERE aircraft_id = ?',
            [id]
        );

        await connection.end();

        return NextResponse.json({
            message: 'Aircraft deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting aircraft:', error);
        return NextResponse.json(
            { error: 'Failed to delete aircraft' },
            { status: 500 }
        );
    }
}