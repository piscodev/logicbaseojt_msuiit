import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import pool from '@/app/lib/Database/db';
import { FieldPacket } from 'mysql2';
interface ResultData {
  id: number
  rate: number
  name: string
  total_hours_worked?: number
  total_earnings ?: number
  active: number
  last_login: string
  address: string
  age: number,
  gender: string,
  email: string,
  cl_name: string | null,
}
export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    let connection;
    const { startDate, endDate } = await req.json()
    try {
      connection = await pool.getConnection();
      let query =  `
        SELECT 
            CONCAT(u.first_name, ' ', u.last_name) AS name,
            c.rate,
            COALESCE(SUM(TIMESTAMPDIFF(MINUTE, a.time_in, a.time_out) / 60), 0) AS total_hours_worked,
            u.active,
            u.last_login,
            u.address,
            u.age,
            u.gender,
            u.email,
            cl.name AS cl_name
        FROM 
            users_cashiers c
        JOIN 
            users u ON c.user_id = u.user_id
        LEFT JOIN 
            users_cashiers_attendance a ON c.user_id = a.user_id
        LEFT JOIN
          users_cashiers_lane cl ON 
          c.user_cashier_id = cl.cashier1_id OR
          c.user_cashier_id = cl.cashier2_id OR
          c.user_cashier_id = cl.cashier3_id
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
                CONCAT(u.first_name, ' ', u.last_name) AS name, c.rate, u.active, u.last_login, u.address, u.age, u.gender, u.email, cl.name
            ORDER BY 
                CONCAT(u.first_name, ' ', u.last_name) AS name ASC
        `;
      const [rows]: [ResultData[], FieldPacket[]] = await connection.query(query, [
        startDate && endDate ? startDate : undefined,
        startDate && endDate ? endDate : undefined
      ]) as [ResultData[], FieldPacket[]];
      
      console.log('Result: ', rows);
      // Extract just the names from the result
      const cashiers = rows.map((row: ResultData, index:number) => ({
        key: index,
        name: row.name,
        rate: row.rate,
        total_hours_worked: row.total_hours_worked,
        earnings: Number(row.rate)*Number(row.total_hours_worked),
        active: row.active,
        last_login: row.last_login,
        address: row.address,
        age: row.age,
        gender: row.gender,
        email: row.email,
        cl_name: row.cl_name || null,
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