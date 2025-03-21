import { NextResponse } from 'next/server';
import pool from '@/app/lib/Database/db';
import { ResultSetHeader, FieldPacket } from 'mysql2';

export async function POST(req: Request) {
  try {
    // Parse request body
    const { laneId, assignedCashiers }: { laneId: number; assignedCashiers: number[] } = await req.json();
    console.log('laneId:', laneId);
    console.log('assignedCashiers:', assignedCashiers);
    if (!laneId || !Array.isArray(assignedCashiers)) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    // Fill cashier slots and pad with null if fewer than 3
    const cashierIds = [
      assignedCashiers[0] || null,
      assignedCashiers[1] || null,
      assignedCashiers[2] || null,
    ];

    const connection = await pool.getConnection();
    try {
      // Update the CashierLane with the new cashier assignments
      const [result]: [ResultSetHeader, FieldPacket[]] = await connection.execute(
        `
        UPDATE users_cashiers_lane
        SET
          cashier1_id = ?,
          cashier2_id = ?,
          cashier3_id = ?
        WHERE lane_id = ?
        `,
        [...cashierIds, laneId]
      ) as [ResultSetHeader, FieldPacket[]];

      if (result.affectedRows === 0) {
        return NextResponse.json({ error: 'Cashier lane not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: 'Cashier lane updated successfully' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating cashier lane:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
