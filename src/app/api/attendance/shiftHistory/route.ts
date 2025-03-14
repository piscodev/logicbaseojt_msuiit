
import { FieldPacket } from "mysql2";
import pool from '@/app/lib/Database/db';
import { NextRequest, NextResponse } from 'next/server';
interface ShiftHistoryData {
    time_in: string,
    time_out: string,
    total_hours_worked: number,
    shift_date: string,
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
            
            const query = `
            SELECT 
            DATE(a.time_in) AS shift_date,
                a.time_in,
                a.time_out,
                COALESCE(SUM(TIMESTAMPDIFF(MINUTE, a.time_in, a.time_out) / 60), 0) AS total_hours_worked
            FROM Attendance a
            WHERE cashier_id = (SELECT c.id FROM Cashier c
                JOIN User u ON c.user_id = u.id
                WHERE u.name = ?)
            GROUP BY DATE(a.time_in)
            `;
           

            const [shiftHistory]:[ShiftHistoryData[], FieldPacket[]] = await connection.query(query, [name]) as [ShiftHistoryData[], FieldPacket[]];
            
            const data = shiftHistory.map((row: ShiftHistoryData, index:number) => ({
                key: index,
                name: name,
                shift_date: row.shift_date,
                time_in: row.time_in,
                time_out: row.time_out,
                total_hours_worked: row.total_hours_worked,
            }));
            return NextResponse.json(
                { data },
                { status: 200 }
                );

            
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