import pool from "@/app/lib/Database/db"
import { NextResponse } from "next/server"

export async function GET()
{
    let conn = null
    try
    {
        conn = await pool.getConnection()
        const [rows] = await conn.query('SELECT * FROM cashier')
        // const cashiers = rows.map((row: Cashier) => row.name)
        return NextResponse.json({ rows }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to fetch cashiers' }, { status: 500 })
    } finally {
        if (conn)
            conn.release()
    }
}