import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/Database/db";
import { FieldPacket } from "mysql2";
//const FILE_PATH = path.join(process.cwd(), "data", "subscriptions.json");

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

export async function POST(req: NextRequest)
{
  let conn
  try
  {
    const body = await req.json()
    const subscriber_payload = body.subscription
    const user_id = body.user_id

    if (!subscriber_payload || !subscriber_payload.keys)
      return NextResponse.json({ error: "Invalid subscription payload!" }, { status: 400 })

    conn = await pool.getConnection()
    const psubscription: PushSubscription = subscriber_payload
    const _psubscription: _PushSubscription = subscriber_payload as _PushSubscription

    // Read existing subscriptions
    //const fileData = await fs.readFile(FILE_PATH, "utf8");

    const qValues = [_psubscription.keys.auth || ""].filter(Boolean)
    const [rows]: [Subscribers[], FieldPacket[]] = await conn.query('SELECT * FROM users_notification_subscriptions WHERE auth = ?', [qValues]) as [Subscribers[], FieldPacket[]]
    if (rows.length === 0)
    {
      const auth = _psubscription.keys.auth
      const qStr = `INSERT INTO users_notification_subscriptions (user_id, auth, data) VALUES (?, ?, ?)`
      const isInserted = await conn.execute(qStr, [user_id, auth, JSON.stringify(psubscription)])
      if (!isInserted)
        return NextResponse.json({ message: "Subscription failed to insert..."}, { status: 400 })

      return NextResponse.json({ message: "Subscribed successfully!" }, { status: 200 })
    } else return NextResponse.json({ message: "Already subscribed!" }, { status: 400 })

    // const subscriptions = JSON.parse(fileData) as PushSubscription[]

    // Prevent duplicates
    // if (!rows.find((sub) => sub.endpoint === psubscription.endpoint)) {
    //   subscriptions.push(subscription);
    //   await fs.writeFile(FILE_PATH, JSON.stringify(subscriptions, null, 2), "utf8");
    // }

    // return NextResponse.json({ message: "Subscribed successfully!" });
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 })
  } finally {

    if (conn)
      conn.release()
  }
}