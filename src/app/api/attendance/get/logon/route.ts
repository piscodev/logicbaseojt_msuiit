// import pool from "@/app/lib/Database/db";
import { NextResponse } from "next/server";


export async function POST()
{
    // const { userId, timeStamp, imageSrc, hasTimedIn } = await req.json()
    // if (!timeStamp || !imageSrc)
    //     return NextResponse.json("Invalid request", { status: 400 })


    //if (hasTimedIn)
        // sequence . . .
    // else
        // sequeence . . .

    const now = new Date().getTime()

    // let conn = null
    // try
    // {
    //     conn = await pool.getConnection()
    //     // const queryTestong = await conn.query("SELECT * FROM users_cashiers_attendance WHERE na")

    //     await conn.execute("INSERT INTO users_cashiers_attendance (user_id, time_in, image_src) VALUES (?, ?, ?)", [userId, timeStamp, imageSrc])

    // } catch (error) {
    //     console.error(error)
    // } finally {

    //     if (conn)
    //         conn.release()
    // }

    return NextResponse.json(
    {
        timeStamp: now,
        cashier_data: {},
    })
}