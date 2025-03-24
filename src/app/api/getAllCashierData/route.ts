import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import pool from '@/app/lib/Database/db';
// import { Cashier } from '@/app/lib/Interface/interface';
// import { User } from '@/app/lib/Interface/interface';
interface CashierResult {
    user_cashier_id: number
    name: string
    email: string
    user_type: string
    last_login: string
    address:string
    active:number
    gender:string
    contact_number:string
    total_hours_worked: number
    total_earnings: number
    lane_id: number
}
import { FieldPacket } from 'mysql2';
export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    let connection;
    const { user_admin_id } = await req.json()
    try {
      connection = await pool.getConnection();
      // Query to get all cashier names
        const [rows]: [CashierResult[],FieldPacket[]] = await connection.query(
            `
            SELECT 
                CONCAT(u.first_name, ' ', u.last_name) AS name,
                u.last_login,
                u.active,
                u.address,
                u.gender,
                u.contact_number,
                c.user_cashier_id,
                COALESCE(SUM(TIMESTAMPDIFF(MINUTE, a.time_in, a.time_out) / 60), 0) AS total_hours_worked,
                COALESCE(SUM(TIMESTAMPDIFF(MINUTE, a.time_in, a.time_out) / 60) * c.rate, 0) AS total_earnings,
                cl.lane_id AS lane_id
            FROM users_cashiers c
            JOIN users u ON c.user_id = u.user_id
            LEFT JOIN users_cashiers_attendance a ON c.user_cashier_id = a.user_cashier_id
            LEFT JOIN users_cashiers_lane cl 
                ON c.user_cashier_id = cl.cashier1_id OR c.user_cashier_id = cl.cashier2_id OR c.user_cashier_id = cl.cashier3_id
            WHERE u.user_type = 'cashier' AND c.user_admin_id = ?
            GROUP BY 
              u.user_id,
              u.last_login,
              u.active,
              u.address,
              u.gender,
              u.contact_number,
              c.user_cashier_id,
              cl.lane_id
            ORDER BY CONCAT(u.first_name, ' ', u.last_name) ASC
            `,
            [user_admin_id]
        ) as [CashierResult[],FieldPacket[]];
        // Extract just the names from the result
        const data = rows.map((row: CashierResult) => ({
            key: String(row.user_cashier_id),
            id: row.user_cashier_id,
            name: row.name,
            last_login: row.last_login,
            address: row.address,
            active: row.active,
            gender: row.gender,
            contact_number: row.contact_number,
            total_hours_worked: row.total_hours_worked,
            total_earnings: row.total_earnings,
            lane_id: row.lane_id 
        }));
        
        return NextResponse.json(
            { data },
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