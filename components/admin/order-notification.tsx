"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { getActiveOrders } from "@/app/actions/admin-actions"
import { Bell, BellOff, Volume2, VolumeX, AlertTriangle } from "lucide-react"
import { Archivo } from "next/font/google"

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["400", "600"],
    display: "swap",
})

export function OrderNotification() {
    const [soundEnabled] = useState(true) // Always enabled by default
    const [knownOrderIds, setKnownOrderIds] = useState<Set<string>>(new Set())
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const [hasNewOrders, setHasNewOrders] = useState(false)
    const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default")
    const [audioUnlocked, setAudioUnlocked] = useState(false)

    // Audio ref — local WAV file, much more reliable than YouTube
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Initialize audio + load preferences
    useEffect(() => {
        // Create audio element
        const audio = new Audio("/sounds/order-alarm.wav")
        audio.loop = true
        audio.volume = 1.0
        audio.preload = "auto"
        audioRef.current = audio

        // Check current notification permission
        if ("Notification" in window) {
            setNotifPermission(Notification.permission)
        }

        // Auto-subscribe to push on mount if possible
        const initPush = async () => {
            if (Notification.permission === "granted") {
                await subscribeToPush()
            }
        }
        initPush()

        // One-time listener to unlock audio (browser requirement)
        const unlockAudio = () => {
            if (audioRef.current && !audioUnlocked) {
                audioRef.current.play().then(() => {
                    audioRef.current?.pause()
                    setAudioUnlocked(true)
                }).catch(() => {})
                window.removeEventListener('click', unlockAudio)
                window.removeEventListener('touchstart', unlockAudio)
            }
        }
        window.addEventListener('click', unlockAudio)
        window.addEventListener('touchstart', unlockAudio)

        return () => {
            audio.pause()
            audio.src = ""
            window.removeEventListener('click', unlockAudio)
            window.removeEventListener('touchstart', unlockAudio)
        }
    }, [])

    // Request notification permission
    const requestNotificationPermission = useCallback(async () => {
        if (!("Notification" in window)) return
        if (Notification.permission === "granted") {
            setNotifPermission("granted")
            return
        }
        try {
            const permission = await Notification.requestPermission()
            setNotifPermission(permission)
            if (permission === "granted") {
                await subscribeToPush()
            }
        } catch {
            console.warn("Notification permission request failed")
        }
    }, [])

    const [isSubscribing, setIsSubscribing] = useState(false)

    // Helper: Convert VAPID key for browser
    const urlBase64ToUint8Array = (base64String: string) => {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
        const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
        const rawData = window.atob(base64)
        const outputArray = new Uint8Array(rawData.length)
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i)
        }
        return outputArray
    }

    const subscribeToPush = useCallback(async () => {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            return
        }

        setIsSubscribing(true)
        try {
            const registration = await navigator.serviceWorker.ready
            
            // Check for existing subscription
            let subscription = await registration.pushManager.getSubscription()
            
            if (!subscription) {
                const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
                if (!publicKey) throw new Error("VAPID public key missing")

                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicKey)
                })
            }

            // Send to server
            await fetch("/api/push/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(subscription)
            })
            
            setNotifPermission("granted")
        } catch (error) {
            console.error("Push subscription failed:", error)
        } finally {
            setIsSubscribing(false)
        }
    }, [])

    const playAlarm = useCallback(() => {
        // Play audio
        if (audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.play().catch((err) => {
                console.warn("Audio play failed (requires user interaction):", err)
            })
        }

        // Vibrate aggressively — long pattern like a phone call
        if ("vibrate" in navigator) {
            // Pattern: vibrate 500ms, pause 200ms — repeat 10 times
            const pattern: number[] = []
            for (let i = 0; i < 10; i++) {
                pattern.push(500, 200)
            }
            navigator.vibrate(pattern)
        }

        // Show browser notification
        if ("Notification" in window && Notification.permission === "granted") {
            try {
                const notif = new Notification("🔔 Nowe Zamówienie!", {
                    body: "Nowe zamówienie czeka na potwierdzenie w panelu Basma!",
                    icon: "/icons/icon-192x192.png",
                    badge: "/icons/icon-192x192.png",
                    tag: "basma-new-order",
                    requireInteraction: true,
                    silent: false,
                })
                notif.onclick = () => {
                    window.focus()
                    notif.close()
                }
            } catch {
                if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({
                        type: "SHOW_NOTIFICATION",
                        title: "🔔 Nowe Zamówienie!",
                        body: "Nowe zamówienie czeka na potwierdzenie w panelu Basma!",
                    })
                }
            }
        }
    }, [])

    const stopAlarm = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
        if ("vibrate" in navigator) {
            navigator.vibrate(0)
        }
    }, [])

    const stopAlert = useCallback(() => {
        setHasNewOrders(false)
        stopAlarm()
    }, [stopAlarm])

    // Test button
    const testAlert = useCallback(async () => {
        // First try to request permission if not granted
        if (notifPermission !== "granted") {
            await requestNotificationPermission()
        }
        playAlarm()
        setHasNewOrders(true)
        setTimeout(() => {
            stopAlarm()
            setHasNewOrders(false)
        }, 5000)
    }, [playAlarm, stopAlarm, notifPermission, requestNotificationPermission])

    const checkNewOrders = useCallback(async () => {
        try {
            const activeOrders = await getActiveOrders()
            const currentIds = new Set<string>(activeOrders.map((o: any) => String(o._id)))

            if (isInitialLoad) {
                setKnownOrderIds(currentIds)
                setIsInitialLoad(false)
                return
            }

            let hasNew = false
            currentIds.forEach((id) => {
                if (!knownOrderIds.has(id)) {
                    hasNew = true
                }
            })

            if (hasNew) {
                setHasNewOrders(true)
                playAlarm()
                setKnownOrderIds(currentIds)
            } else {
                if (currentIds.size !== knownOrderIds.size) {
                    setKnownOrderIds(currentIds)
                }
                if (currentIds.size === 0 && hasNewOrders) {
                    stopAlert()
                }
            }
        } catch (error) {
            console.error("Error polling for orders:", error)
        }
    }, [knownOrderIds, isInitialLoad, hasNewOrders, playAlarm, stopAlert])

    // Poll every 15 seconds
    useEffect(() => {
        const interval = setInterval(checkNewOrders, 15000)
        return () => clearInterval(interval)
    }, [checkNewOrders])

    return (
        <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
            {/* Active Alert Banner */}
            {hasNewOrders && (
                <button
                    onClick={stopAlert}
                    className={`flex items-center gap-3 px-6 py-4 bg-red-600 text-white rounded-2xl shadow-[0_20px_50px_rgba(220,38,38,0.5)] animate-bounce border-2 border-white/20 sm:px-4 sm:py-3 ${archivo.className}`}
                >
                    <Volume2 className="h-6 w-6 animate-pulse" />
                    <span className="text-base sm:text-sm font-black uppercase tracking-tighter">STOP ALARM!</span>
                    <span className="text-[12px] bg-black/30 px-3 py-1 rounded-full font-bold">ZAKOŃCZ</span>
                </button>
            )}

            {/* Test Alert Button (Small & Discrete) */}
            <div className="flex items-center gap-2">
                <button
                    onClick={testAlert}
                    className={`flex items-center gap-2 px-4 py-2.5 sm:px-3 sm:py-2 rounded-xl backdrop-blur-md shadow-lg transition-all border bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-[#BA9D76]/20 hover:border-[#BA9D76]/40 ${archivo.className}`}
                    title="Testuj powiadomienia (dźwięk + wibracja)"
                >
                    <Bell className="h-4 w-4" />
                    <span className="text-[11px] font-black uppercase tracking-widest sm:text-[10px]">Testuj Alert</span>
                </button>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 px-4 py-2.5 sm:px-3 sm:py-2 rounded-xl backdrop-blur-md bg-[#BA9D76]/10 border border-[#BA9D76]/20 text-[#BA9D76]">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="text-[11px] font-black uppercase tracking-widest sm:text-[10px]">LIVE</span>
                </div>
            </div>

            {/* Permission warning */}
            {notifPermission !== "granted" && (
                <button
                    onClick={requestNotificationPermission}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-900/30 border border-amber-500/20 text-amber-400 text-[10px] font-semibold animate-pulse ${archivo.className}`}
                >
                    <AlertTriangle className="h-3 w-3" />
                    KLIKNIJ ABY WŁĄCZYĆ POWIADOMIENIA PUSH
                </button>
            )}
        </div>
    )
}
