
export const serviceWorker = async () =>
    {
        if ("serviceWorker" in navigator)
        {
            try
            {
                await navigator.serviceWorker.register("/sw.js")
                console.log("Service Worker registered!")
            } catch (error) {
                console.error("Service Worker registration failed:", error)
            }
        }
    }