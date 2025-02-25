// import { NextResponse } from 'next/server';
// import { NextRequest } from 'next/server';
// import pool from '../../lib/Database/db';
// import { FieldPacket } from 'mysql2';
// import { DateTime } from 'luxon';
// interface RowData {
//   shift: 'AM' | 'MID' | 'PM';
//   particular: string | null;
//   amount: number | null;
//   fee_percent: number | null;
//   cashier: string;
// }


// export interface TransactionRow {
//   key: string;
//   particular: string;
//   am: number | string;  // Allow string for cashier name
//   mid: number | string;
//   pm: number | string;
//   gross_total: number;
//   net_total: number;
// }

// export async function POST(req: NextRequest) {
//   if (req.method === 'POST') {
//     let connection;
//     try {
//       const { date } = await req.json();
//       if (!date || typeof date !== 'string') {
//         return NextResponse.json(
//           { error: "Valid date is required" },
//           { status: 400 }
//         );
//       }

//       connection = await pool.getConnection();
      
//       const currentDate = DateTime.fromISO(date).setZone('Asia/Manila').toFormat('yyyy-LL-dd');
//       const [rows]: [RowData[], FieldPacket[]] = await connection.query(`
//         SELECT 
//           s.name AS shift,
//           p.name AS particular,
//           td.amount,
//           p.fee_percent,
//           c.name AS cashier
//         FROM Transaction t
//         JOIN Shift s ON t.shift_id = s.id
//         JOIN Cashier c ON t.cashier_id = c.id
//         LEFT JOIN TransactionDetail td ON t.id = td.transaction_id
//         LEFT JOIN Particular p ON td.particular_id = p.id
//         WHERE t.date = ?
//         ORDER BY s.id ASC, p.name ASC
//       `, [currentDate]) as  [RowData[], FieldPacket[]];

//       // Collect cashiers per shift
//       const cashiers: Record<string, string> = {
//         AM: '',
//         MID: '',
//         PM: ''
//       };

//       const particularsMap = new Map<string, {
//         particular: string;
//         am: number;
//         mid: number;
//         pm: number;
//         feePercent: number;
//       }>();

//       rows.forEach((row) => {
//         // Store cashier for each shift
//         if (!cashiers[row.shift]) {
//           cashiers[row.shift] = row.cashier;
//         }

//         // Process amounts
//         if (row.particular && row.amount !== null) {
//           const current = particularsMap.get(row.particular) || {
//             particular: row.particular,
//             am: 0,
//             mid: 0,
//             pm: 0,
//             feePercent: row.fee_percent || 0
//           };

//           switch (row.shift) {
//             case 'AM':
//               current.am += Number(row.amount);
//               break;
//             case 'MID':
//               current.mid += Number(row.amount);
//               break;
//             case 'PM':
//               current.pm += Number(row.amount);
//               break;
//           }

//           particularsMap.set(row.particular, current);
//         }
//       });

//       // Create cashier row
//       const cashierRow: TransactionRow = {
//         key: '0',
//         particular: 'Cashier',
//         am: cashiers.AM,
//         mid: cashiers.MID,
//         pm: cashiers.PM,
//         gross_total: 0,
//         net_total: 0
//       };

//       // Convert particulars to array
//       const particulars = Array.from(particularsMap.values())
//         .map((item, index) => {
//           const gross = Number(item.am) + Number(item.mid) + Number(item.pm);
//           const net = gross * Number((1 - (item.feePercent / 100)));
          
//           return {
//             key: (index + 1).toString(), // Start keys from 1
//             particular: item.particular,
//             am: item.am,
//             mid: item.mid,
//             pm: item.pm,
//             gross_total: gross,
//             net_total: net
//           };
//         });

//       // Combine cashier row with particulars
//       const result = [cashierRow, ...particulars];

//       return NextResponse.json(
//         { data: result },
//         { status: 200 }
//       );

//     } catch (error) {
//       console.error('Database error:', error);
//       return NextResponse.json(
//         { error: 'Failed to fetch transactions' },
//         { status: 500 }
//       );
//     } finally {
//       if (connection) connection.release();
//     }
//   }

//   return NextResponse.json(
//     { error: 'Method not allowed' },
//     { status: 405 }
//   );
// }
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import pool from '../../lib/Database/db';
import { FieldPacket } from 'mysql2';
import { DateTime } from 'luxon';
interface ParticularDefinition {
  id: number;
  name: string;
  type: 'Trade' | 'Non-Trade';
  fee_percent: number;
}

interface TransactionData {
  particular: string;
  shift: 'AM' | 'MID' | 'PM';
  amount: number;
  cashier: string;
}

export interface TransactionRow {
  key: string;
  particular: string;
  am: string | number;
  mid: string | number;
  pm: string | number;
  gross_total: string | number;
  net_total: string | number;
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

      // Get all predefined particulars in order
      const [particulars]: [ParticularDefinition[], FieldPacket[]] = await connection.query(`
        SELECT id, name, type, fee_percent 
        FROM Particular
        ORDER BY FIELD(id, 
          1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18
        )
      `) as [ParticularDefinition[], FieldPacket[]];

      const currentDate = DateTime.fromISO(date).setZone('Asia/Manila').toFormat('yyyy-LL-dd');
      // Get transaction data for the date
      const [transactions]: [TransactionData[], FieldPacket[]] = await connection.query(`
        SELECT 
          p.name AS particular,
          s.name AS shift,
          SUM(td.amount) AS amount,
          c.name AS cashier
        FROM Transaction t
        JOIN Shift AS s ON t.shift_id = s.id
        JOIN Cashier AS c ON t.cashier_id = c.id
        LEFT JOIN TransactionDetail AS td ON t.id = td.transaction_id
        LEFT JOIN Particular AS p ON td.particular_id = p.id
        WHERE t.date = ?
        GROUP BY p.name, s.name
      `, [currentDate]) as [TransactionData[], FieldPacket[]];

      // Create transaction map
      const transactionMap = new Map<string, {
        AM?: { amount: number, cashier: string },
        MID?: { amount: number, cashier: string },
        PM?: { amount: number, cashier: string }
      }>();

      const cashiers = { AM: '', MID: '', PM: '' };
      
      transactions.forEach(tx => {
        const key = tx.particular;
        if (!transactionMap.has(key)) {
          transactionMap.set(key, {});
        }
        const entry = transactionMap.get(key)!;
        entry[tx.shift] = {
          amount: tx.amount,
          cashier: tx.cashier
        };
        
        // Store cashier for shift
        cashiers[tx.shift] = tx.cashier;
      });

      // Create cashier row
      const cashierRow: TransactionRow = {
        key: '0',
        particular: 'Cashier',
        am: cashiers.AM || '',
        mid: cashiers.MID || '',
        pm: cashiers.PM || '',
        gross_total: '',
        net_total: ''
      };

      // Generate rows for all particulars
      const tradeRows: TransactionRow[] = [];
      const nonTradeRows: TransactionRow[] = [];
      let subTotalTradeAM: number = 0;
      let subTotalTradeMID: number = 0;
      let subTotalTradePM: number = 0;
      let subTotalNonTradeAM: number = 0;
      let subTotalNonTradeMID: number = 0;
      let subTotalNonTradePM: number = 0;
      let grossTradeTotal: number = 0;
      let netTradeTotal: number = 0;
      let grossNonTradeTotal: number = 0;
      let netNonTradeTotal: number = 0;
      particulars.forEach((particular, index) => {
        const txData = transactionMap.get(particular.name) || {};
        const amNum = Number(txData.AM?.amount)
        const midNum = Number(txData.MID?.amount)
        const pmNum = Number(txData.PM?.amount)
        const am = amNum.toFixed(2) || '';
        const mid = midNum.toFixed(2) || '';
        const pm = pmNum.toFixed(2) || '';
        console.log("  ")
        // console.log('Index: ', index)
        // console.log('Particular: ', particular)
        const numericValues = [Number(txData.AM?.amount), Number(txData.MID?.amount), Number(txData.PM?.amount)]
          .filter(v => typeof v === 'number');
        
        const gross = numericValues.reduce((sum, v) => sum + (v || 0), 0);
        const net = gross * Number((1 - (particular.fee_percent / 100)));
        let currentKey;
        if(particular.type === 'Trade'){
            currentKey = (index + 1).toString();
            grossTradeTotal += gross;
            netTradeTotal += net;
        } else {
            currentKey = (index + 2).toString();
            grossNonTradeTotal += gross;
            netNonTradeTotal += net;
        }
        // console.log(`Current key: ${currentKey} ; current index: ${index} ; current type: ${particular.type}`)
        const row: TransactionRow = {
          key: currentKey,
          particular: particular.name,
          am: am === '' ? '' : Number(am),
          mid: mid === '' ? '' : Number(mid),
          pm: pm === '' ? '' : Number(pm),
          gross_total: gross,
          net_total: net
        };
        
        if (particular.type === 'Trade') {
            if(am !== '' && txData.AM?.amount)
            subTotalTradeAM += Number(txData.AM?.amount)
            if(mid !== '' && txData.MID?.amount)
            subTotalTradeMID += Number(txData.MID?.amount)
            if(pm !== '' && txData.PM?.amount)
            subTotalTradePM += Number(txData.PM?.amount)
            tradeRows.push(row);
            if(index==11){
                const tradeTotal: TransactionRow = {
                    key: '13',
                    particular: 'SUB TOTAL TRADE POS',
                    am: subTotalTradeAM,
                    mid: subTotalTradeMID,
                    pm: subTotalTradePM,
                    gross_total: grossTradeTotal,
                    net_total: netTradeTotal,
                }
                tradeRows.push(tradeTotal);
            }
        } else {
            if(am !== '')
            subTotalNonTradeAM += Number(amNum)
            if(mid !== '')
            subTotalNonTradeMID += Number(midNum)
            if(pm !== '')
            subTotalNonTradePM += Number(pmNum)
            
            nonTradeRows.push(row);
            if(index==17){
                const nonTrade:TransactionRow = {
                    key: '20',
                    particular: 'SUB TOTAL NON TRADE POS',
                    am: subTotalNonTradeAM,
                    mid: subTotalNonTradeMID,
                    pm: subTotalNonTradePM,
                    gross_total: grossNonTradeTotal,
                    net_total: netNonTradeTotal
                };
                nonTradeRows.push(nonTrade)
            }
        }
      });

      return NextResponse.json({
        data: [cashierRow, ...tradeRows, ...nonTradeRows]
      }, { status: 200 });

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