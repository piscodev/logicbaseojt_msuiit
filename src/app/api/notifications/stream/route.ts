import { NextResponse } from "next/server";

let clients: WritableStreamDefaultWriter[] = []
let latestNotification: { title: string; body: string } | null = null

// Function to send notifications to all connected clients
function sendNotificationToClients()
{
    if (!latestNotification)
        return

    const encoder = new TextEncoder()
    clients.forEach((writer) => writer.write(encoder.encode(`data: ${JSON.stringify(latestNotification)}\n\n`)))
    latestNotification = null
}

// SSE connection handler
export async function GET(req: Request)
{
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()
    const encoder = new TextEncoder()

    clients.push(writer)

    // Send the latest notification if available
    if (latestNotification)
        writer.write(encoder.encode(`data: ${JSON.stringify(latestNotification)}\n\n`))

    // Handle client disconnection
    req.signal.addEventListener("abort", () =>
    {
        clients = clients.filter((client) => client !== writer)
        writer.close()
    })

    return new NextResponse(readable,
    {
        headers:
        {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    })
}

// API to trigger a new notification
export async function POST(req: Request)
{
    const { title, body } = await req.json()

    if (!title || !body)
        return NextResponse.json({ error: "Title and body are required!" }, { status: 400})

    latestNotification = { title, body }
    // const sess = await getSession()
    // if (sess.id !== sess.id)
        sendNotificationToClients() // Push notification to all clients

    return NextResponse.json({ success: true })
}