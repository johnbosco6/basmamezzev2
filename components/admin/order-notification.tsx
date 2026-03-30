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
    const [soundEnabled, setSoundEnabled] = useState(false)
    const [knownOrderIds, setKnownOrderIds] = useState<Set<string>>(new Set())
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const [hasNewOrders, setHasNewOrders] = useState(false)
    const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default")

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

        // Load saved preference
        const savedPref = localStorage.getItem("basma-admin-sound")
        if (savedPref === "true") {
            setSoundEnabled(true)
        }

        // Check current notification permission
        if ("Notification" in window) {
            setNotifPermission(Notification.permission)
        }

        return () => {
            audio.pause()
            audio.src = ""
        }
    }, [])

    // Request notification permission when sound is enabled
    const requestNotificationPermission = useCallback(async () => {
        if (!("Notification" in window)) return
        if (Notification.permission === "granted") {
            setNotifPermission("granted")
            return
        }
        try {
            const permission = await Notification.requestPermission()
            setNotifPermission(permission)
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
            console.warn("Push notifications not supported")
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
                console.log("New Push Subscription created", subscription)
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

    const toggleSound = async () => {
        const newState = !soundEnabled
        setSoundEnabled(newState)
        localStorage.setItem("basma-admin-sound", String(newState))

        if (newState) {
            // Request standard notification permission
            await requestNotificationPermission()
            
            // Also attempt Web Push subscription (wakelock)
            await subscribeToPush()

            // If there are already new orders, start alerting
            if (hasNewOrders) {
                playAlarm()
            }
        } else {
            stopAlarm()
        }
    }

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

        // Show browser notification (works even in background tab)
        if ("Notification" in window && Notification.permission === "granted") {
            try {
                const notif = new Notification("🔔 Nowe Zamówienie!", {
                    body: "Nowe zamówienie czeka na potwierdzenie w panelu Basma!",
                    icon: "/icons/icon-192x192.png",
                    badge: "/icons/icon-192x192.png",
                    tag: "basma-new-order", // prevents duplicate notifications
                    requireInteraction: true, // stays until dismissed — wakes screen on Android
                    silent: false, // use system notification sound too
                })
                notif.onclick = () => {
                    window.focus()
                    notif.close()
                }
            } catch {
                // Fallback: try service worker notification (works when app is in background)
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
        // Stop audio
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }

        // Stop vibration
        if ("vibrate" in navigator) {
            navigator.vibrate(0)
        }
    }, [])

    const stopAlert = useCallback(() => {
        setHasNewOrders(false)
        stopAlarm()
    }, [stopAlarm])

    // Test button — lets admin verify the alarm works
    const testAlert = useCallback(() => {
        playAlarm()
        setHasNewOrders(true)
        // Auto-stop after 5 seconds
        setTimeout(() => {
            stopAlarm()
            setHasNewOrders(false)
        }, 5000)
    }, [playAlarm, stopAlarm])

    const checkNewOrders = useCallback(async () => {
        try {
            const activeOrders = await getActiveOrders()
            const currentIds = new Set<string>(activeOrders.map((o: any) => String(o._id)))

            if (isInitialLoad) {
                setKnownOrderIds(currentIds)
                setIsInitialLoad(false)
                return
            }

            // Check for genuinely new IDs
            let hasNew = false
            currentIds.forEach((id) => {
                if (!knownOrderIds.has(id)) {
                    hasNew = true
                }
            })

            if (hasNew) {
                setHasNewOrders(true)
                if (soundEnabled) {
                    playAlarm()
                }
                setKnownOrderIds(currentIds)
            } else {
                if (currentIds.size !== knownOrderIds.size) {
                    setKnownOrderIds(currentIds)
                }
                // Auto-stop if no active orders remain
                if (currentIds.size === 0 && hasNewOrders) {
                    stopAlert()
                }
            }
        } catch (error) {
            console.error("Error polling for orders:", error)
        }
    }, [knownOrderIds, isInitialLoad, soundEnabled, hasNewOrders, playAlarm, stopAlert])

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
                    className={`flex items-center gap-3 px-4 py-3 bg-red-600 text-white rounded-2xl shadow-2xl animate-bounce border-2 border-white/20 ${archivo.className}`}
                >
                    <Volume2 className="h-5 w-5 animate-pulse" />
                    <span className="text-sm font-bold uppercase tracking-tight">Nowe Zamówienie!</span>
                    <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full">STOP</span>
                </button>
            )}

            {/* Sound Toggle + Test */}
            <div className="flex items-center gap-2">
                <button
                    onClick={toggleSound}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md shadow-lg transition-all border ${
                        soundEnabled
                            ? "bg-[#BA9D76]/20 border-[#BA9D76]/50 text-[#BA9D76] hover:bg-[#BA9D76]/30"
                            : "bg-white/5 border-white/10 text-white/40 hover:text-white/80 hover:bg-white/10"
                    } ${archivo.className}`}
                    title={soundEnabled ? "Powiadomienia dźwiękowe włączone" : "Powiadomienia dźwiękowe wyłączone"}
                >
                    {soundEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                    <span className="text-xs font-semibold">
                        {soundEnabled ? "Dźwięk Aktywny" : "Dźwięk Wyłączony"}
                    </span>
                </button>

                {soundEnabled && (
                    <button
                        onClick={testAlert}
                        className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl backdrop-blur-md shadow-lg transition-all border bg-amber-500/20 border-amber-500/40 text-amber-400 hover:bg-amber-500/30 ${archivo.className}`}
                        title="Test alarmu — sprawdź czy dźwięk i wibracja działają"
                    >
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold uppercase">Test</span>
                    </button>
                )}
            </div>

            {/* Permission warning */}
            {soundEnabled && notifPermission !== "granted" && (
                <button
                    onClick={requestNotificationPermission}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-900/30 border border-amber-500/20 text-amber-400 text-[10px] font-semibold ${archivo.className}`}
                >
                    <AlertTriangle className="h-3 w-3" />
                    Kliknij, aby włączyć powiadomienia
                </button>
            )}
        </div>
    )
}
