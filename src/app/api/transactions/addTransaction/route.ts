
import { FieldPacket, ResultSetHeader } from "mysql2";
import pool from '@/app/lib/Database/db';
import { NextRequest, NextResponse } from 'next/server';
import { TransactionValuesState } from '@/app/lib/Interface/interface';
import { DateTime } from "luxon";
export async function POST(req: NextRequest) {
    if (req.method === 'POST') {
        const bodyData = await req.json();
        const date = bodyData.date;
        const {
            cashier_name, shift, cash, check, bpi_cc, bpi_dc, metro_cc, metro_dc, pay_maya, aub_cc, gcash, foodpanda, streetby, grabfood, mm_head, mm_commisary, mm_, mm_rm, mm_dm, mm_km, food_charge//, sub_total_trade_POS, grand_total_trade_POS, z_reading_POS, short_over_POS
        }: TransactionValuesState = bodyData.data;
        //console.log("Received: ", cashier_name, shift, cash, check, bpi_cc, bpi_dc, metro_cc, metro_dc, pay_maya, aub_cc, gcash, foodpanda, streetby, grabfood, mm_head, mm_commisary, mm_, mm_rm, mm_dm, mm_km, food_charge)
        // Validate if all fields are provided
        if (!cashier_name || !shift && (!cash || !check || !bpi_cc || !bpi_dc || !metro_cc || !metro_dc || !pay_maya || !aub_cc || !gcash || !foodpanda || !streetby || !grabfood || !mm_head || !mm_commisary || !mm_ || !mm_rm || !mm_dm || !mm_km || !food_charge)) {
            return NextResponse.json({ error: 'Some required fields are not filled' }, { status: 400 });
        }
  
        let connection;
        const formattedDate = DateTime.fromFormat(date,"yyyy-MM-dd").setZone('Asia/Manila')
        const formattedDateString = formattedDate.toFormat('yyyy-LL-dd')
        console.log("Adding transaction for date:", formattedDate)
        try {
            console.log('get connection')
            connection = await pool.getConnection();
            await connection.beginTransaction();
            console.log('Connection established, begin transaction')
  
            // Check if a shift report already exists for the given day and shift
            const existingShift:[TransactionValuesState[], FieldPacket[]]=  await connection.query(
                `SELECT t.id 
                FROM Transaction t
                JOIN Shift s ON t.shift_id = s.id
                WHERE t.date = ? AND s.name = ?`,
                [formattedDateString, shift]
            ) as [TransactionValuesState[], FieldPacket[]];
            console.log('existing shift data: ', existingShift[0])
            if (existingShift[0].length > 0) {
                await connection.rollback();
                const errorMessage = DateTime.now().setZone('Asia/Manila').hasSame(formattedDate, 'day') ? `Shift report for ${shift} already exists for today` : `Shift report for ${shift} already exists for ${formattedDateString}`
                return NextResponse.json({ error: errorMessage}, { status: 400 });
            }
            // 2. Create transaction
            const [txResult]: [ResultSetHeader, FieldPacket[]] = await connection.query(
                `INSERT INTO Transaction (cashier_id, shift_id, date)
                VALUES (
                (SELECT id FROM Cashier WHERE name = ?),
                (SELECT id FROM Shift WHERE name = ?),
                ?
                )`,
                [cashier_name, shift, formattedDateString]
            ) as [ResultSetHeader, FieldPacket[]];
        
            const txId = txResult.insertId;

            const particulars = [
                { name: 'Cash', amount: cash },
                { name: 'Check', amount: check },
                { name: 'BPI Credit Card', amount: bpi_cc },
                { name: 'BPI Debit Card', amount: bpi_dc },
                { name: 'Metro Credit Card', amount: metro_cc },
                { name: 'Metro Debit Card', amount: metro_dc },
                { name: 'Pay Maya', amount: pay_maya },
                { name: 'AUB Credit Card', amount: aub_cc },
                { name: 'GCash', amount: gcash },
                { name: 'Food Panda', amount: foodpanda },
                { name: 'Streetby', amount: streetby },
                { name: 'Grab Food', amount: grabfood },
                { name: 'MM-Head Office', amount: mm_head },
                { name: 'MM-Commissary', amount: mm_commisary },
                { name: 'MM-', amount: mm_ },
                { name: 'MM-RM', amount: mm_rm },
                { name: 'MM-DM', amount: mm_dm },
                { name: 'MM-KM', amount: mm_km },
                { name: 'Food Charge', amount: food_charge }
            ];


            for(const particular of particulars){
                const amount = Number(particular.amount);
                if(isNaN(amount)) continue;
                if(amount <= 0) continue;
                // Handle special MM- case with dynamic suffix
                let particularName = particular.name;
                if (particularName === 'MM-' && particular.amount && particular.amount > 0) {
                    // If we need to handle dynamic MM- suffixes from user input
                    // We'll need additional logic here to create/retrieve these
                    // This code assumes they're predefined in Particulars table
                    particularName = 'MM-'; // Keep as-is if predefined
                }
                try {
                    await connection.query(
                        `INSERT INTO TransactionDetail
                        (transaction_id, particular_id, amount)
                        VALUES(? , (SELECT id FROM Particular where name = ?) , ?)`,
                        [txId, particularName, amount]
                    )
                } catch (error) {
                    console.error(`Failed to insert ${particularName}: `, error);
                    throw new Error(`Invalid particular: ${particularName}`);
                }
            }

            await connection.commit();
            return NextResponse.json({ success: true }, { status: 201 });
        } catch (error) {
            if (connection) await connection.rollback();
            console.error('Transaction Error:', error);
            return NextResponse.json({ error: 'Database operation failed' }, { status: 500 });
        } finally {
            if (connection) connection.release();
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
    }
}