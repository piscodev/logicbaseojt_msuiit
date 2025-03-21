self.addEventListener("push", async (event) =>
{
    if (event.data)
    {
        const { title, body } = event.data.json()
        self.registration.showNotification(title,
        {
            body: body,
            icon: "/LogoIcon.png",
            badge: "/LogoIcon.png",
        })

        self.clients.matchAll().then((clients) => clients.forEach((client) => client.postMessage({ title, body })))
    }
})

self.addEventListener("notificationclick", (event) =>
{
    event.notification.close()
    event.waitUntil(
      clients.openWindow("https://moneycachehub.vercel.app/dashboard/attendance")
    )
})