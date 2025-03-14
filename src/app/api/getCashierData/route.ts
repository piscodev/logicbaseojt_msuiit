import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import pool from '@/app/lib/Database/db';
import { Cashier } from '@/app/lib/Interface/interface';
import { FieldPacket } from 'mysql2';
export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    let connection;
    const { startDate, endDate } = await req.json()
    try {
      connection = await pool.getConnection();
      let query =  `
        SELECT 
            u.name,
            c.rate,
            COALESCE(SUM(TIMESTAMPDIFF(MINUTE, a.time_in, a.time_out) / 60), 0) AS total_hours_worked
        FROM 
            Cashier c
        JOIN 
            User u ON c.user_id = u.id
        LEFT JOIN 
            Attendance a ON c.id = a.cashier_id
        WHERE 
            u.user_type = 'cashier'
        `;
        // If start and end date are provided, filter by those dates
        if (startDate && endDate) {
            query += `
                AND a.time_in >= ? AND a.time_in <= ?
            `;
        } else {
            // If no date range is provided, default to the current month
            query += `
                AND a.time_in >= DATE_FORMAT(CURDATE(), '%Y-%m-01')  
                AND a.time_in < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')
            `;
        }

        query += `
            GROUP BY 
                u.name, c.rate
            ORDER BY 
                u.name ASC
        `;
      const [rows]: [Cashier[], FieldPacket[]] = await connection.query(query, [
        startDate && endDate ? startDate : undefined,
        startDate && endDate ? endDate : undefined
      ]) as [Cashier[], FieldPacket[]];
      
      console.log('Result: ', rows);
      // Extract just the names from the result
      const cashiers = rows.map((row: Cashier, index:number) => ({
        key: index,
        name: row.name,
        rate: row.rate,
        total_hours_worked: row.total_hours_worked,
        earnings: Number(row.rate)*Number(row.total_hours_worked)
    }));
      
      return NextResponse.json(
        { cashiers },
        { status: 200 }
      );
      
    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch cashiers' },
        { status: 500 }
      );
    } finally {
      if (connection) connection.release();
    }
  }
  
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}