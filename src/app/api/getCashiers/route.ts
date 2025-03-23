import { NextResponse, NextRequest } from 'next/server';
import pool from '@/app/lib/Database/db';
import { User } from '@/app/lib/Interface/interface';
import { FieldPacket } from 'mysql2';
export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    let connection;
    const { user_admin_id } = await req.json()
    try {
      connection = await pool.getConnection();
      
      // Query to get all cashier names
      const [rows]: [User[],FieldPacket[]] = await connection.query(
        `
          SELECT CONCAT(u.first_name, ' ', u.last_name) AS name 
          FROM users_cashiers c
          JOIN users u ON c.user_id = u.user_id
          WHERE u.user_type = 'cashier' AND c.user_admin_id = ?
          ORDER BY CONCAT(u.first_name, ' ', u.last_name) ASC
        `,
        [user_admin_id]
      ) as [User[],FieldPacket[]];
      // Extract just the names from the result
      const cashiers = rows.map((row: User) => ({
        value: row.first_name+ " " + row.last_name}));
      
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