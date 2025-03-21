import { NextResponse } from "next/server";
import webpush from "web-push";
import pool from "@/app/lib/Database/db";
import { FieldPacket } from "mysql2";

export const dynamic = 'force-dynamic'


const PUBLIC_VAPID_KEY = "BDY4oXnfhlW2Za7Da1N--NVl-zYFIIhAYBQkhCZ-ZwKzu4w2kovg1lWmlqhjCIFy-3jaI9mx1ev8gb09EPW8gaA";
const PRIVATE_VAPID_KEY = "MXC0nAqVUITyT7ebbMC3HGzbnzrcBEVx_I3To8eCAb0";

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
            if (results.length === 0)
                return NextResponse.json({ message: "No subscribers available" }, { status: 400 })

            // const subscribers = [] as webpush.PushSubscription[]
            // for (const result of results)
            // {
            //     // const data_string = JSON.stringify(result.data)
            //     const subscriptions = JSON.parse(result.data)
            //     console.log(subscriptions)
            //     subscribers.push(subscriptions)
            // }

            // const subscribers = results.map(result => JSON.parse(JSON.stringify(result.data))) as webpush.PushSubscription[]
            const subscribers = results.map(result => JSON.parse(result.data)) as webpush.PushSubscription[]
            const notificationPayload = JSON.stringify({ title: title, body: desc })
            await Promise.all(subscribers.map(async (sub) =>
            {
                try {
                    await webpush.sendNotification(sub, notificationPayload)
                } catch (err) {
                    console.error(err)
                }
            }))

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

export async function GET() {
    let conn;
    try {
        conn = await pool.getConnection();
        const [results]: [Subscribers[], FieldPacket[]] = await conn.query('SELECT * FROM users_notification_subscriptions', []) as [Subscribers[], FieldPacket[]];

        if (results.length === 0) {
            return NextResponse.json({ message: "No subscribers available" }, { status: 400 });
        }

        // Extract subscriber data
        const subscribers = results.map(result => JSON.parse(result.data)) as webpush.PushSubscription[];

        const notificationPayload = JSON.stringify({
            title: "🔔 Persistent Push Notification",
            body: "This is a push notification stored in a JSON file!",
        });

        await Promise.all(
            subscribers.map(async (sub) => {
                try {
                    await webpush.sendNotification(sub, notificationPayload);
                } catch (err) {
                    console.error("Push notification error:", err);
                }
            })
        );

        return NextResponse.json({ message: "Test notification sent successfully!" });
    } catch (error) {
        console.error("Error in sending test notification:", error);
        return NextResponse.json({ error: error || "Failed to send test notification" }, { status: 500 });
    } finally {
        if (conn) conn.release();
    }
}