import { NextRequest, NextResponse } from 'next/server'
import pool from '@/app/lib/Database/db';
import { FieldPacket } from 'mysql2';
import { ParticularDefinition } from '@/app/lib/Interface/interface';
import { DateTime } from 'luxon';
interface TransactionsData {
    cashier_id: number;
    cashier_name: string;
    shift: 'AM' | 'MID' | 'PM';
    particular: string;
    particular_id: number
    amount: number;
    trade_total: number;
    non_trade_total: number;
    grand_total: number
  }
  
  interface CashierResult {
    cashier_id: number;
    name: string;
    shifts: {
      shift: string;
      transactions: {
        particular: string;
        particular_id: number
        am: number;
        mid: number;
        pm: number;
        total_trade_am: number;
        total_trade_mid: number;
        total_trade_pm: number;
        total_non_trade_am: number;
        total_non_trade_mid: number;
        total_non_trade_pm: number;
        grand_total_am: number;
        grand_total_mid: number;
        grand_total_pm: number;
        fee_percent: number
      }[];
    }[];
  }
export async function POST(req: NextRequest){
    if(req.method === 'POST'){
        let connection;
        try{
            const { date } = await req.json();
            connection = await pool.getConnection()
            const currentDate = DateTime.fromISO(date).setZone('Asia/Manila').toFormat('yyyy-LL-dd');
            console.log('Current date: ', currentDate);
            // Get transactions for the specified date
            // const [transactions]: [TransactionsData[], FieldPacket[]] = await connection.query(`
            //     SELECT 
            //     c.user_cashier_id AS cashier_id,
            //     GROUP_CONCAT(DISTINCT CONCAT(u.first_name, ' ', u.last_name) SEPARATOR ', ') AS cashier_name,
            //     s.shift_name AS shift,
            //     p.particular_name AS particular,
            //     p.particular_id AS id,
            //     COALESCE(SUM(td.amount), 0) AS amount,
            //     COALESCE(SUM(CASE WHEN p.particular_id <= 12 THEN td.amount ELSE 0 END), 0) AS trade_total,
            //     COALESCE(SUM(CASE WHEN p.particular_id > 12 THEN td.amount ELSE 0 END), 0) AS non_trade_total,
            //     COALESCE(SUM(CASE WHEN p.particular_id <= 20 THEN td.amount ELSE 0 END), 0) AS grand_total
            //     FROM transactions t
            //     JOIN users_cashiers c ON t.user_cashier_id = c.user_cashier_id
            //     JOIN users u ON c.user_id = u.user_id
            //     JOIN shift s ON t.shift_id = s.shift_id
            //     LEFT JOIN transactions_detail td ON t.transaction_id = td.transaction_id
            //     LEFT JOIN particulars p ON td.particular_id = p.particular_id
            //     WHERE t.transaction_date = ?
            //     GROUP BY c.user_cashier_id, s.shift_id, p.particular_id
            //     HAVING SUM(td.amount) > 0
            //     ORDER BY CONCAT(u.first_name, ' ', u.last_name), s.shift_id, p.particular_name
            // `, [currentDate]) as [TransactionsData[], FieldPacket[]];
            
            const [transactions]: [TransactionsData[], FieldPacket[]] = await connection.query(`
                SELECT 
                c.user_cashier_id AS cashier_id,
                u.first_name AS cashier_name,
                s.shift_name AS shift,
                p.particular_name AS particular,
                p.particular_id AS id,
                COALESCE(SUM(td.amount), 0) AS amount,
                COALESCE(SUM(CASE WHEN p.particular_id <= 12 THEN td.amount ELSE 0 END), 0) AS trade_total,
                COALESCE(SUM(CASE WHEN p.particular_id > 12 THEN td.amount ELSE 0 END), 0) AS non_trade_total,
                COALESCE(SUM(CASE WHEN p.particular_id <= 20 THEN td.amount ELSE 0 END), 0) AS grand_total
                FROM transactions t
                JOIN users_cashiers c ON t.user_cashier_id = c.user_cashier_id
                JOIN users u ON c.user_id = u.user_id
                JOIN shift s ON t.shift_id = s.shift_id
                LEFT JOIN transactions_detail td ON t.transaction_id = td.transaction_id
                LEFT JOIN particulars p ON td.particular_id = p.particular_id
                WHERE t.transaction_date = ?
                GROUP BY c.user_cashier_id, s.shift_id, p.particular_id
                HAVING SUM(td.amount) > 0
                ORDER BY CONCAT(u.first_name, ' ', u.last_name), s.shift_id, p.particular_name
            `, [currentDate]) as [TransactionsData[], FieldPacket[]];
            console.log('transactions: ', transactions);
            // Get all particulars
            const [particulars]:[ParticularDefinition[], FieldPacket[]] = await connection.query(`
                SELECT particular_id, particular_name, particular_fee_percent FROM particulars ORDER BY particular_id ASC
            `) as [ParticularDefinition[], FieldPacket[]];
            console.log("Particulars:", particulars)

            // Group transactions by cashier
            const cashierMap = new Map<number, CashierResult>();

            transactions.forEach(transaction => {
                if (!cashierMap.has(transaction.cashier_id)) {
                    cashierMap.set(transaction.cashier_id, {
                        cashier_id: transaction.cashier_id,
                        name: transaction.cashier_name,
                        shifts: []
                    });
                }

                const cashier = cashierMap.get(transaction.cashier_id)!;
                let shift = cashier.shifts.find(s => s.shift === transaction.shift);

                if (!shift) {
                shift = {
                        shift: transaction.shift,
                        transactions: particulars.map(p => ({
                        particular: p.particular_name,
                        particular_id: p.particular_id,
                        am: 0,
                        mid: 0,
                        pm: 0,
                        total_trade_am: 0,
                        total_trade_mid: 0,
                        total_trade_pm: 0,
                        total_non_trade_am: 0,
                        total_non_trade_mid: 0,
                        total_non_trade_pm: 0,
                        grand_total_am: 0,
                        grand_total_mid: 0,
                        grand_total_pm: 0,
                        fee_percent: p.particular_fee_percent
                        }))
                    };
                    cashier.shifts.push(shift);
                }
                const transactionEntry = shift.transactions.find(t => t.particular === transaction.particular);
                if (transactionEntry) {
                    switch (transaction.shift) {
                        case 'AM':
                        transactionEntry.am = transaction.amount;
                        transactionEntry.total_trade_am = transaction.trade_total;
                        transactionEntry.total_non_trade_am = transaction.non_trade_total;
                        transactionEntry.grand_total_am = transaction.grand_total;
                        break;
                        case 'MID':
                        transactionEntry.mid = transaction.amount;
                        transactionEntry.total_trade_mid = transaction.trade_total;
                        transactionEntry.total_non_trade_mid = transaction.non_trade_total;
                        transactionEntry.grand_total_mid = transaction.grand_total;
                        break;
                        case 'PM':
                        transactionEntry.pm = transaction.amount;
                        transactionEntry.total_trade_pm = transaction.trade_total
                        transactionEntry.total_non_trade_pm = transaction.non_trade_total
                        transactionEntry.grand_total_pm = transaction.grand_total
                        break;
                    }
                }
                console.log("Result Transaction entry: ", transactionEntry);
            });
            // Convert map to array
            const result = Array.from(cashierMap.values());
            console.log('Result: ', result);
            
            return NextResponse.json(
                { cashiers: result },
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
