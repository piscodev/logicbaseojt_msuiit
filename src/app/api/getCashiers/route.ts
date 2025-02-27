import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import pool from '@/app/lib/Database/db';
import { Cashier } from '@/app/lib/Interface/route';
import { FieldPacket } from 'mysql2';
export async function GET(req: NextRequest) {
  if (req.method === 'GET') {
    let connection;
    try {
      connection = await pool.getConnection();
      
      // Query to get all cashier names
      const [rows]: [Cashier[],FieldPacket[]] = await connection.query(
        'SELECT * FROM cashier ORDER BY name ASC'
      ) as [Cashier[],FieldPacket[]];
      console.log('Result: ', rows);
      // Extract just the names from the result
      const cashiers = rows.map((row: Cashier) => ({
        value: row.name}));
      
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