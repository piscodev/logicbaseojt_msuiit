import pool from "@/app/lib/Database/db";
import { CashiersTransaction } from "@/app/lib/Interface/route";
import { FieldPacket, ResultSetHeader } from "mysql2";

import { PoolConnection } from "mysql2/promise";
import { NextResponse } from "next/server";

export async function POST(req: Request)
{
    const { name, transactions } = await req.json()

    // const asd = await req.json()
    // console.log(asd)
    console.log("Name: ", name)
    console.log("Transacts: ", transactions)

    
    let conn: PoolConnection | null = null
    try
    {
        conn = await pool.getConnection()
        // Insert cashier
        const [cashierResult]: [ResultSetHeader, FieldPacket[]] = await conn.query("INSERT INTO cashiers (name) VALUES (?)", [name]) as [ResultSetHeader, FieldPacket[]]
        const cashierId = cashierResult.insertId

        // Insert transactions
        const transactionPromises = transactions.map((t: CashiersTransaction) =>
            conn?.query(
                "INSERT INTO transactions (cashier_id, particular, am, mid, pm) VALUES (?, ?, ?, ?, ?)",
                [cashierId, t.particular, t.am, t.mid, t.pm]
            )
        )

        if (transactionPromises.length === 0)
            return NextResponse.json({ error: "No transactions to insert" }, { status: 400 })

        // iterate over the promises and wait for all of them to resolve
        await Promise.all(transactionPromises)

        return NextResponse.json({ transactions }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to fetch cashiers' }, { status: 500 })
    } finally {
        if (conn)
            conn.release()
    }
}