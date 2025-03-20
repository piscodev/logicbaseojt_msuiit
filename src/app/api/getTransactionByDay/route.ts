import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import pool from '../../lib/Database/db';
import { FieldPacket } from 'mysql2';
import { DateTime } from 'luxon';
import { ParticularDefinition } from '@/app/lib/Interface/interface';

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
        SELECT particular_id, particular_name, particular_type, particular_fee_percent 
        FROM particulars
        ORDER BY FIELD(id, 
          1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18
        )
      `) as [ParticularDefinition[], FieldPacket[]];

      const currentDate = DateTime.fromISO(date).setZone('Asia/Manila').toFormat('yyyy-LL-dd');
      // Get transaction data for the date
      const [transactions]: [TransactionData[], FieldPacket[]] = await connection.query(`
        SELECT 
          p.name AS particulars,
          s.name AS shift,
          SUM(td.amount) AS amount,
          MAX(u.name) AS users_cashiers
        FROM transactions t
        JOIN shift AS s ON t.shift_id = s.shift_id
        JOIN users_cashiers AS c ON t.cashier_id = c.user_cashier_id
        JOIN users AS u ON c.user_id = u.user_id
        LEFT JOIN transactions_detail AS td ON t.transaction_id = td.transaction_id
        LEFT JOIN particulars AS p ON td.particular_id = p.particular_id
        WHERE t.transaction_date = ?
        GROUP BY p.name, s.name
      `, [currentDate]) as [TransactionData[], FieldPacket[]];
        console.log("Transactions: ", transactions)
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
        particular: 'CASHIER',
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
      let grandPOSAM: number = 0;
      let grandPOSMID: number = 0;
      let grandPOSPM: number = 0;
      let grandPOSGross: number = 0;
      let grandPOSNet: number = 0;
      particulars.forEach((particular, index) => {
        const txData = transactionMap.get(particular.name) || {};
        const amNum = Number(txData.AM?.amount)
        const midNum = Number(txData.MID?.amount)
        const pmNum = Number(txData.PM?.amount)
        const am = amNum.toFixed(2) || '';
        const mid = midNum.toFixed(2) || '';
        const pm = pmNum.toFixed(2) || '';
        const numericValues = [Number(txData.AM?.amount), Number(txData.MID?.amount), Number(txData.PM?.amount)]
          .filter(v => typeof v === 'number');
        
        const gross = numericValues.reduce((sum, v) => Number(sum) + (Number(v) || 0), 0);
        const net = gross * Number((1 - (particular.fee_percent / 100)));
        let currentKey;
        if(particular.type === 'Trade'){
            currentKey = (index + 1).toString();
            grossTradeTotal += Number(gross);
            netTradeTotal += Number(net);
        } else {
            currentKey = (index + 2).toString();
            grossNonTradeTotal += Number(gross);
            netNonTradeTotal += Number(net);
        }
        const row: TransactionRow = {
          key: currentKey,
          particular: particular.name.toUpperCase(),
          am: am === '' ? '' : Number(am),
          mid: mid === '' ? '' : Number(mid),
          pm: pm === '' ? '' : Number(pm),
          gross_total: gross.toFixed(2),
          net_total: net.toFixed(2)
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
                    gross_total: grossTradeTotal.toFixed(2),
                    net_total: netTradeTotal.toFixed(2),
                }
                grandPOSAM = subTotalTradeAM;
                grandPOSMID = subTotalTradeMID;
                grandPOSPM = subTotalTradePM;
                grandPOSGross = grossTradeTotal;
                grandPOSNet = netTradeTotal;

                tradeRows.push(tradeTotal);
            }
        } else {
            if(am !== '' && txData.AM?.amount)
            subTotalNonTradeAM += Number(txData.AM?.amount)
            if(mid !== '' && txData.MID?.amount)
            subTotalNonTradeMID += Number(txData.MID?.amount)
            if(pm !== '' && txData.PM?.amount)
            subTotalNonTradePM += Number(txData.PM?.amount)
            
            nonTradeRows.push(row);
            if(index==17){
                const nonTrade:TransactionRow = {
                    key: '20',
                    particular: 'SUB TOTAL NON TRADE POS',
                    am: subTotalNonTradeAM,
                    mid: subTotalNonTradeMID,
                    pm: subTotalNonTradePM,
                    gross_total: grossNonTradeTotal.toFixed(2),
                    net_total: netNonTradeTotal.toFixed(2),
                };
                nonTradeRows.push(nonTrade)
                grandPOSAM += subTotalNonTradeAM
                grandPOSMID += subTotalNonTradeMID;
                grandPOSPM += subTotalNonTradePM;
                grandPOSGross += grossNonTradeTotal;
                grandPOSNet += netNonTradeTotal;
                const grandTotalPosRow:TransactionRow = {
                    key: '21',
                    particular: 'GRAND TOTAL POS',
                    am: grandPOSAM,
                    mid: grandPOSMID,
                    pm: grandPOSPM,
                    gross_total: grandPOSGross.toFixed(2),
                    net_total: grandPOSNet.toFixed(2)
                };
                nonTradeRows.push(grandTotalPosRow)
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