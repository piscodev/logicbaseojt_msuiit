import { FieldPacket } from "mysql2";
import pool from '@/app/lib/Database/db';
import { NextRequest, NextResponse } from 'next/server';

interface AttendanceData {
    time_in: string;
    time_out: string | null;
    name: string;
}

export async function POST(req: NextRequest) {
    const { name } = await req.json();
    console.log("Name: ", name);

    let connection;
    try {
        connection = await pool.getConnection();
        console.log('Connection established');

        const checkInOutQuery = `
            SELECT * FROM Attendance
            WHERE cashier_id = (SELECT c.id FROM Cashier c
                JOIN User u ON c.user_id = u.id
                WHERE u.name = ?) 
            AND DATE(time_in) = CURDATE() 
            AND DATE(time_out) = CURDATE()
        `;

        const checkInQuery = `
            SELECT * FROM Attendance
            WHERE cashier_id = (SELECT c.id FROM Cashier c
                JOIN User u ON c.user_id = u.id
                WHERE u.name = ?) 
            AND DATE(time_in) = CURDATE() 
            AND time_out IS NULL
        `;

        const [existingInOutRecord]: [AttendanceData[], FieldPacket[]] = await connection.query(checkInOutQuery, [name]) as [AttendanceData[], FieldPacket[]] ;
        
        if (existingInOutRecord.length > 0) {
            return NextResponse.json({ success: true, message: "Record for today already exists", data: existingInOutRecord[0] }, { status: 201 });
        } 
        
        const [existingInRecord]: [AttendanceData[], FieldPacket[]] = await connection.query(checkInQuery, [name]) as [AttendanceData[], FieldPacket[]] ;
        
        if (existingInRecord.length > 0) {
            return NextResponse.json({ success: true, message: "Record for time in already exists", data: existingInRecord[0] }, { status: 201 });
        }

        return NextResponse.json({ success: true, message: "Record for today doesn't exist" }, { status: 201 });

    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Database operation failed' }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
