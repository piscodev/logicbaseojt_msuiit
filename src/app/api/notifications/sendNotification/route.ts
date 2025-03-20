import { NextResponse } from "next/server";
import webpush from "web-push";
import pool from "@/app/lib/Database/db";
import { FieldPacket } from "mysql2";
export const dynamic = 'force-dynamic'

// const FILE_PATH = path.join(process.cwd(), "data", "subscriptions.json");


const PUBLIC_VAPID_KEY = "BIK1qzjrQRCZMsOzO6GH4HeXKOBivuy0npF21_eJONISLMFHPjxwDbcuZNs7bWH-P62GPHjcywsqdoiMJ6O87A8";
const PRIVATE_VAPID_KEY = "cylMrhbw_OdJSgOSDGs6GNe16c31jUE3Z_evaZV452w";

webpush.setVapidDetails(
  "mailto:teamsapphire003@gmail.com",
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
)

interface Subscribers {
    auth: string | ""
    data: string | ""
}

export async function POST(res: Request)
{
    if (res.method === "POST")
    {
        let conn
        try
        {
            const { title, desc } = await res.json() // payload sa notification
            if (!title || !desc)
                return NextResponse.json({ error: "Title and description are required!" })

            // const fileData = await fs.readFile(FILE_PATH, "utf8");
            // const subscriptions = JSON.parse(fileData) as webpush.PushSubscription[];
            conn = await pool.getConnection()
            const [results]: [Subscribers[], FieldPacket[]] = await conn.query('SELECT * FROM users_notification_subscriptions', []) as [Subscribers[], FieldPacket[]]
            if (!results)
                return NextResponse.json({ message: "No subscribers available" }, { status: 400 })

            // const subscribers = [] as webpush.PushSubscription[]
            // for (const result of results)
            // {
            //     const data_string = JSON.stringify(result.data)
            //     const subscriptions = JSON.parse(data_string)
            //     subscribers.push(subscriptions)
            // }

            const subscribers = results.map(result => JSON.parse(JSON.stringify(result.data))) as webpush.PushSubscription[]

            const notificationPayload = JSON.stringify( { title: title, body: desc })
            await Promise.all(subscribers.map(async (sub) =>
            {
                try {
                    await webpush.sendNotification(sub, notificationPayload)
                } catch (err) {
                    console.error(err)
                }
            }))

            // subscribers.forEach(async (sub) =>
            // {
            //     try
            //     {
            //         return await webpush.sendNotification(sub, notificationPayload)
            //     } catch (err) {
            //         return console.error(err)
            //     }
            // })

            return NextResponse.json(subscribers)
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
        } finally {

            if (conn)
                conn.release()
        }
    } else return NextResponse.json({ message: "Invalid request method" }, { status: 405 });
}

// purpose: for testing purpose; when opened in browser, sends a notification throughout all subscribers
export async function GET()
{
    let conn
    try
    {
        // const fileData = await fs.readFile(FILE_PATH, "utf8");
        // const subscriptions = JSON.parse(fileData) as webpush.PushSubscription[];
        conn = await pool.getConnection()
        const [results]: [Subscribers[], FieldPacket[]] = await conn.query('SELECT * FROM users_notification_subscriptions', []) as [Subscribers[], FieldPacket[]]
        if (!results)
            return NextResponse.json({ message: "No subscribers available" }, { status: 400 })

        const subscribers = [] as webpush.PushSubscription[]
        for (const result of results)
        {
            const data_string = JSON.stringify(result.data)
            const subscriptions = JSON.parse(data_string)
            subscribers.push(subscriptions)
        }

        const notificationPayload = JSON.stringify(
        {
            title: "🔔 Persistent Push Notification",
            body: "This is a push notification stored in a JSON file!",
        })
        subscribers.forEach(async (sub) => {
            try {
                return await webpush.sendNotification(sub, notificationPayload)
            } catch (err) {
                return console.error(err);
            }
        })

        return NextResponse.json(subscribers)
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
    } finally {

        if (conn)
            conn.release()
    }
}