
import { FieldPacket } from "mysql2";
import pool from '@/app/lib/Database/db';
import { NextRequest, NextResponse } from 'next/server';
interface ShiftHistoryData {
    time_in: string,
    time_out: string,
    total_hours_worked: number,
    shift_date: string,
    shift: string,
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
            // console.log('Connection established, begin transaction')
            
            // const query = `
            // SELECT 
            // DATE(a.time_in) AS shift_date,
            //     a.time_in,
            //     a.time_out,
            //     COALESCE(SUM(TIMESTAMPDIFF(MINUTE, a.time_in, a.time_out) / 60), 0) AS total_hours_worked,
            // CASE 
            //     WHEN TIME(a.time_out) BETWEEN '08:00:00' AND '11:59:59' THEN 'AM'
            //     WHEN TIME(a.time_out) BETWEEN '12:00:00' AND '15:59:59' THEN 'MID'
            //     WHEN TIME(a.time_out) BETWEEN '16:00:00' AND '19:59:59' THEN 'PM'
            //     ELSE 'UNKNOWN' -- For cases where time_out is outside the defined ranges
            // END AS shift
            // FROM users_cashiers_attendance a
            // WHERE user_cashier_id = (SELECT c.user_id FROM users_cashiers c
            //     JOIN users u ON c.user_id = u.user_id
            //     WHERE u.name = ?)
            // GROUP BY DATE(a.time_in), a.time_in, a.time_out
            // ORDER BY a.time_in DESC
            // `;
            
            const query = `
                SELECT
                    DATE(a.time_in) AS shift_date,
                    a.time_in,
                    a.time_out,
                    COALESCE(TIMESTAMPDIFF(MINUTE, a.time_in, a.time_out) / 60, 0) AS total_hours_worked,
                    a.shift
                FROM users_cashiers_attendance a
                JOIN users_cashiers c ON a.user_cashier_id = c.user_cashier_id
                JOIN users u ON c.user_id = u.user_id
                WHERE u.name = ?
                GROUP BY shift_date, a.time_in, a.time_out, a.shift
                ORDER BY a.time_in DESC
            `

            const [shiftHistory]:[ShiftHistoryData[], FieldPacket[]] = await connection.query(query, [name]) as [ShiftHistoryData[], FieldPacket[]];
            
            const data = shiftHistory.map((row: ShiftHistoryData, index:number) => ({
                key: index,
                name: name,
                shift_date: row.shift_date,
                shift: row.shift,
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