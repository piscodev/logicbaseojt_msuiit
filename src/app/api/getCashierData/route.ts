import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import pool from '@/app/lib/Database/db';
import { Cashier } from '@/app/lib/Interface/interface';
import { FieldPacket } from 'mysql2';
export async function GET(req: NextRequest) {
  if (req.method === 'GET') {
    let connection;
    try {
      connection = await pool.getConnection();
      
      const [rows]: [Cashier[], FieldPacket[]] = await connection.query(
        `
          SELECT u.name,
          c.rate
          FROM Cashier c
          JOIN User u ON c.user_id = u.id
          WHERE u.user_type = 'cashier'
          ORDER BY u.name ASC
        `
      ) as [Cashier[], FieldPacket[]];
      
      console.log('Result: ', rows);
      // Extract just the names from the result
      const cashiers = rows.map((row: Cashier, index:number) => ({
        key: index,
        name: row.name,
        rate: row.rate}));
      
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