
import { FieldPacket, QueryResult, ResultSetHeader } from "mysql2";
import pool from '@/app/lib/Database/db';
import { NextRequest, NextResponse } from 'next/server';
import { message } from "antd";
// import { TransactionValuesState } from '@/app/lib/Interface/interface';
// import { DateTime } from "luxon";
interface AttendanceData {
    time_in: string,
    time_out: string,
    name: string
}
export async function POST(req: NextRequest) {
    if (req.method === 'POST') {
        const {name} = await req.json();
        console.log("Name: ", name)
        
        let connection;
        try {
            connection = await pool.getConnection();
            // await connection.beginTransaction();
            console.log('Connection established, begin transaction')
            
            const checkQuery = `
            SELECT * FROM Attendance
            WHERE cashier_id = (SELECT c.id FROM Cashier c
                JOIN User u ON c.user_id = u.id
                WHERE u.name = ?) AND DATE(time_in) = CURDATE() AND DATE(time_out) = CURDATE()
            `;
           

            const existingRecord:[AttendanceData[], FieldPacket[]] = await connection.query(checkQuery, [name]) as [AttendanceData[], FieldPacket[]];
            if(existingRecord[0].length>0){
                return NextResponse.json({ success: true, message:"Record for today already exists" , data:existingRecord[0][0]}, { status: 201 });
            } else {
                return NextResponse.json({ success: true, message:"Record for today doesn't exists" }, { status: 201 });
            }

            
        } catch (error) {
            if (connection) await connection.rollback();
            console.error('Transaction Error:', error);
            return NextResponse.json({ error: 'Database operation failed' }, { status: 500 });
        } finally {
            if (connection) connection.release();
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
    }
}