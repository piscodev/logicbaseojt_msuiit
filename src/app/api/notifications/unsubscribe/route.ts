import pool from "@/app/lib/Database/db";
import { FieldPacket } from "mysql2";
import { NextResponse } from "next/server";

export interface _PushSubscription {
    keys: {
      p256dh: string
      auth: string
    };
  }
  
  export interface Subscribers {
    auth: string | ""
    data: string | ""
  }

export async function POST(req: Request)
{
    const subscriber_payload = await req.json()
    console.log(subscriber_payload)

    let conn = null
    try
    {
        const _psubscription: _PushSubscription = subscriber_payload as _PushSubscription

        conn = await pool.getConnection()

        const qValues = [_psubscription.keys.auth || ""].filter(Boolean)
        const [rows]: [Subscribers[], FieldPacket[]] = await conn.query('SELECT * FROM users_notification_subscriptions WHERE auth = ?', [qValues]) as [Subscribers[], FieldPacket[]]
        if (rows.length === 1)
        {
            const auth = _psubscription.keys.auth
            const qStr = `DELETE FROM users_notification_subscriptions WHERE auth = ?`
            const isInserted = await conn.execute(qStr, [auth])
            if (!isInserted)
                return NextResponse.json({ message: 0}, { status: 400 })

            return NextResponse.json({ message: 1 }, { status: 200 })
        } //else return NextResponse.json({ message: "Already subscribed!" }, { status: 400 })

        return NextResponse.json({ message: 0 }, { status: 200 })
    } catch (error) {
        console.log(error)
    } finally {

        if (conn)
            conn.release()
    }
}