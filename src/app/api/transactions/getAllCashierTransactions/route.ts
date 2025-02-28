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
    amount: number;
  }
  
  interface CashierResult {
    cashier_id: number;
    name: string;
    shifts: {
      shift: string;
      transactions: {
        particular: string;
        am: number;
        mid: number;
        pm: number;
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
            const [transactions]: [TransactionsData[], FieldPacket[]] = await connection.query(`
                SELECT 
                c.id AS cashier_id,
                c.name AS cashier_name,
                s.name AS shift,
                p.name AS particular,
                COALESCE(SUM(td.amount), 0) AS amount
                FROM Transaction t
                JOIN Cashier c ON t.cashier_id = c.id
                JOIN Shift s ON t.shift_id = s.id
                LEFT JOIN TransactionDetail td ON t.id = td.transaction_id
                LEFT JOIN Particular p ON td.particular_id = p.id
                WHERE t.date = ?
                GROUP BY c.id, s.id, p.id
                HAVING SUM(td.amount) > 0
                ORDER BY c.name, s.id, p.name
            `, [currentDate]) as [TransactionsData[], FieldPacket[]];
            console.log('transactions: ', transactions);
            // // Get all cashiers
            // const [cashiers]: [Cashier[],FieldPacket[]] = await connection.query(`
            //     SELECT id, name FROM Cashier ORDER BY name ASC
            // `) as [Cashier[],FieldPacket[]];

            // Get all particulars
            const [particulars]:[ParticularDefinition[], FieldPacket[]] = await connection.query(`
                SELECT id, name FROM Particular ORDER BY id ASC
            `) as [ParticularDefinition[], FieldPacket[]];


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
                        particular: p.name,
                        am: 0,
                        mid: 0,
                        pm: 0
                        }))
                    };
                    cashier.shifts.push(shift);
                }
                const transactionEntry = shift.transactions.find(t => t.particular === transaction.particular);
                if (transactionEntry) {
                    switch (transaction.shift) {
                        case 'AM':
                        transactionEntry.am = transaction.amount;
                        break;
                        case 'MID':
                        transactionEntry.mid = transaction.amount;
                        break;
                        case 'PM':
                        transactionEntry.pm = transaction.amount;
                        break;
                    }
                }
            });
            // Convert map to array
            const result = Array.from(cashierMap.values());
















            // Structure the response
            // const result = cashiers.map(cashier => {
            //     const cashierTransactions = transactions.filter(t => t.cashier_id === cashier.id);
                
            //     const shifts = ['am', 'mid', 'pm'].map(shift => {
            //     const shiftData = cashierTransactions.filter(t => t.shift.toLowerCase() === shift);
                
            //     const transactionMap = particulars.reduce((acc:Record<string, number>, particular) => {
            //         const found = shiftData.find(t => t.particular === particular.name);
            //         acc[particular.name] = found ? found.amount : 0;
            //         return acc;
            //     }, {});

            //     return {
            //         shift,
            //         transactions: Object.entries(transactionMap).map(([particular, amount]) => ({
            //         particular,
            //         am: shift === 'am' ? amount : 0,
            //         mid: shift === 'mid' ? amount : 0,
            //         pm: shift === 'pm' ? amount : 0
            //         }))
            //     };
            //     });

            //     return {
            //     cashier_id: cashier.id,
            //     name: cashier.name,
            //     shifts
            //     };
            // });


            // console.log('Result: ', rows);
            // Extract just the names from the result
            // const cashiers = rows.map((row: Cashier) => ({
            //     cashier_id: row.id,
            //     name: row.name
            // }));
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
