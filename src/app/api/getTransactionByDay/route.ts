import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import pool from '../../lib/Database/db';
import { FieldPacket } from 'mysql2';
import { DateTime } from 'luxon';

interface RowData {
  shift: 'AM' | 'MID' | 'PM';
  cashier: string;
  particular: string | null;
  amount: number | null;
  fee_percent: number | null;
  date: string;
}

interface ParticularItem {
  name: string;
  amount: number;
  netAmount: number;
}

interface ShiftDetails {
  cashier: string;
  date: string;
  particulars: ParticularItem[];
  grossTotal: number;
  netTotal: number;
}

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    let connection;
    try {
      const { date } = await req.json();
      if (!date || typeof date !== 'string') {
        return NextResponse.json(
          { error: "Valid date is required" },
          { status: 400 }
        );
      }

      connection = await pool.getConnection();
      console.log("DATE: ", date);
      const currentDate = DateTime.fromISO(date).setZone('Asia/Manila').toFormat('yyyy-LL-dd')
      const [rows]: [RowData[], FieldPacket[]] = await connection.query(`
        SELECT 
        s.name AS 'shift', 
        c.name AS 'cashier', 
        p.name AS 'particular',
        td.amount, 
        p.fee_percent, 
        t.date
        FROM Transaction AS t
        JOIN Shift AS s ON t.shift_id = s.id 
        JOIN Cashier AS c ON t.cashier_id = c.id
        LEFT JOIN TransactionDetail AS td ON t.id = td.transaction_id
        LEFT JOIN Particular AS p ON td.particular_id = p.id
        WHERE date = ?
        ORDER BY s.id ASC;
      `, [currentDate]) as [RowData[], FieldPacket[]];
      console.log("Rows: ", rows)
      const shifts: Record<string, ShiftDetails> = {};
      
      rows.forEach((row: RowData) => {
        const shift = row.shift;
        if (!shifts[shift]) {
          shifts[shift] = {
            cashier: row.cashier,
            date: row.date,
            particulars: [],
            grossTotal: 0,
            netTotal: 0
          };
        }

        if (row.particular && row.amount !== null && row.amount > 0) {
          const feePercent = row.fee_percent ?? 0;
          const netAmount = row.amount * (1 - (feePercent / 100));
          const particularItem: ParticularItem = {
            name: row.particular,
            amount: row.amount,
            netAmount: Number(netAmount.toFixed(2))
          };
          
          shifts[shift].particulars.push(particularItem);
          shifts[shift].grossTotal += Number(row.amount);
          shifts[shift].netTotal += Number(netAmount);
        }
      });

      // Convert to proper number format
      Object.values(shifts).forEach((shift) => {
        shift.grossTotal = shift.grossTotal;//.toFixed(2);
        shift.netTotal = shift.netTotal;//.toFixed(2);
      });

      return NextResponse.json(
        { shifts },
        { status: 200 }
      );

    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch transactions' },
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