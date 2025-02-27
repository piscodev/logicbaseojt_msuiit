import pool from "@/app/lib/Database/db"
import { CashiersTransaction } from "@/app/lib/Interface/route";
import { FieldPacket } from "mysql2"
import { NextResponse } from "next/server"

const numericFields = [
    "amount", "cash", "check_", "bpi_cc", "bpi_dc", "metro_cc", "metro_dc", 
    "pay_maya", "aub_cc", "gcash", "foodpanda", "streetby", "grabfood", 
    "mm_head", "mm_commisary", "mm_", "mm_rm", "mm_dm", "mm_km", "food_charge"
];

interface Testongg {
    id: number;
    name: string;
    transactions: {
        id: number;
        cashier_id: number;
        shift_id: number;
        am: number;
        mid: number;
        pm: number;
        date: string;
        transaction_id: number;
        particular_id: number;
        testong: Record<string, number>;
    }[];
}

export async function GET() {
    let conn = null;
    try {
        conn = await pool.getConnection();

        // Fetch cashiers
        const [cashiers]: [Testongg[], FieldPacket[]] = await conn.query('SELECT * FROM cashier') as [Testongg[], FieldPacket[]];

        // Fetch transactions
        const [transactions]: [CashiersTransaction[], FieldPacket[]] = await conn.query(
            'SELECT * FROM transaction AS t LEFT JOIN transactiondetail ON transactiondetail.transaction_id = t.id'
        ) as [CashiersTransaction[], FieldPacket[]];

        const result = cashiers.map((cashier: Testongg) => ({
            name: cashier.name,
            transactions: transactions
                .filter((t) => t.cashier_id === cashier.id)
                .flatMap((t: CashiersTransaction) => {
                    const testongData = Object.fromEntries(numericFields.map((key) => [key, Number(t[key as keyof CashiersTransaction])]));
                    
                    const shifts: { am?: Record<string, number>; mid?: Record<string, number>; pm?: Record<string, number> } = {};

                    // Categorize transactions into AM, MID, or PM if their value is greater than 1
                    if (t.am > 1) shifts.am = { ...testongData };
                    if (t.mid > 1) shifts.mid = { ...testongData };
                    if (t.pm > 1) shifts.pm = { ...testongData };

                    return Object.entries(shifts).map(([shift, testong]) => ({
                        id: t.id,
                        cashier_id: t.cashier_id,
                        shift_id: t.shift_id,
                        shift,
                        date: t.date,
                        transaction_id: t.transaction_id,
                        particular_id: t.particular_id,
                        testong
                    }));
                }),
        }));

        return NextResponse.json({ cashiers: result }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch cashiers' }, { status: 500 });
    } finally {
        if (conn) conn.release();
    }
}