"use client";

import { useEffect, useState } from "react";

import { BellFilled, BellOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { serviceWorker } from "@/utils/ServiceWorker"
import { useUserStore } from "@/stores/userStore";

const PUBLIC_VAPID_KEY = "BDY4oXnfhlW2Za7Da1N--NVl-zYFIIhAYBQkhCZ-ZwKzu4w2kovg1lWmlqhjCIFy-3jaI9mx1ev8gb09EPW8gaA";

const PushNotifications = () =>
{
    const user = useUserStore((state) => state.user)
    const [subscribed, setSubscribed] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() =>
    {
        setIsMounted(true)

        const checkSubscription = async () =>
        {
            await serviceWorker()
            if (!("PushManager" in window))
            {
                console.warn("Push notifications are not supported.")
                return
            }

            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.getSubscription()
            setSubscribed(!!subscription)
        }

        checkSubscription()
    }, [isMounted, user])

    if (!isMounted || !user)
        return null

    const subscribeToPush = async () =>
    {
        try
        {
            setLoading(true)

            const registration = await navigator.serviceWorker.ready
            let subscription = await registration.pushManager.getSubscription()
            if (!subscription)
            {
                console.log("No active subscription, subscribing now...");
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
                })
            } else console.log("Already subscribed, updating on server...")

            const response = await fetch("/api/notifications/subscribe",
            {
                method: "POST",
                body: JSON.stringify({ subscription, user_id: user?.user_id }),
                headers: { "Content-Type": "application/json" },
            })

            if (response.ok)
            {
                console.log("Subscribed to push notifications!")
                setSubscribed(true)
            }
        } catch (error) {
            console.error("Failed to subscribe to push notifications:", error)
        } finally {

            setLoading(false)
        }
    }

    const unsubscribeFromPush = async () =>
    {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        if (subscription)
        {
            setLoading(true)
            await subscription.unsubscribe()
            await fetch("/api/notifications/unsubscribe",
            {
                method: "POST",
                body: JSON.stringify(subscription),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) =>
            {
                if (res.ok)
                {
                    console.log("Unsubscribed from push notifications!");
                    setSubscribed(false)
                }
            }).catch((err) => console.error(err)).finally(() => setLoading(false))
        }
    }

    return (
        <Tooltip placement="bottom" title={subscribed ? "Notified to any updates" : "Click to notify any updates"}>
            <Button onClick={subscribed ? unsubscribeFromPush : subscribeToPush} loading={loading} shape='circle' size='large' icon={subscribed ? <BellFilled /> : <BellOutlined />} />
        </Tooltip>
    )
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string)
{
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
    const rawData = window.atob(base64)
    return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)))
}

export default PushNotifications