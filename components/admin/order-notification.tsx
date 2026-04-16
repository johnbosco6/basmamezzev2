"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { getActiveOrders } from "@/app/actions/admin-actions"
import { Bell, Volume2, AlertTriangle } from "lucide-react"
import { Archivo } from "next/font/google"
import { client } from "@/lib/sanity"

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["400", "600"],
    display: "swap",
})

export function OrderNotification() {
    const [hasNewOrders, setHasNewOrders] = useState(false)
    const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default")
    const [audioUnlocked, setAudioUnlocked] = useState(false)
    const [isSubscribing, setIsSubscribing] = useState(false)

    // ─── Use refs for mutable state to avoid re-creating callbacks ────────
    const knownOrderIdsRef = useRef<Set<string>>(new Set())
    const isInitialLoadRef = useRef(true)
    const hasNewOrdersRef = useRef(false)
    const audioUnlockedRef = useRef(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)

    // Keep refs in sync with state
    useEffect(() => { hasNewOrdersRef.current = hasNewOrders }, [hasNewOrders])
    useEffect(() => { audioUnlockedRef.current = audioUnlocked }, [audioUnlocked])

    // ─── Initialize audio element ────────────────────────────────────────
    useEffect(() => {
        // Create AudioContext for resuming suspended audio in background tabs
        try {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        } catch { }

        // Check current notification permission
        if ("Notification" in window) {
            setNotifPermission(Notification.permission)
        }

        // Auto-subscribe to push on mount if possible
        if ("Notification" in window && Notification.permission === "granted") {
            subscribeToPushInternal()
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
            }
        }
    }, [])

    // ─── Robust audio unlock: retry on every click/touch until success ───
    useEffect(() => {
        const unlockAudio = async () => {
            // Check ref (not state) to avoid stale closure
            if (audioUnlockedRef.current) return

            const audio = audioRef.current
            if (!audio) return

            try {
                // Resume AudioContext if suspended (fixes background tab issues)
                if (audioContextRef.current?.state === 'suspended') {
                    await audioContextRef.current.resume()
                }

                await audio.play()
                audio.pause()
                audio.currentTime = 0
                audioUnlockedRef.current = true
                setAudioUnlocked(true)
                console.log('[Notification] Audio unlocked successfully')

                // Only remove listeners AFTER successful unlock
                window.removeEventListener('click', unlockAudio)
                window.removeEventListener('touchstart', unlockAudio)
                window.removeEventListener('keydown', unlockAudio)
            } catch {
                // Play failed — keep listeners so we retry on next interaction
                console.log('[Notification] Audio unlock attempt failed, will retry on next interaction')
            }
        }

        window.addEventListener('click', unlockAudio)
        window.addEventListener('touchstart', unlockAudio)
        window.addEventListener('keydown', unlockAudio)

        return () => {
            window.removeEventListener('click', unlockAudio)
            window.removeEventListener('touchstart', unlockAudio)
            window.removeEventListener('keydown', unlockAudio)
        }
    }, []) // Empty deps is fine — we use refs internally

    // ─── Listen for service worker messages to trigger alarm ─────────────
    useEffect(() => {
        const handleSWMessage = (event: MessageEvent) => {
            if (event.data?.type === 'PLAY_ALARM') {
                console.log('[Notification] Service worker requested alarm playback')
                playAlarm()
            }
        }

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', handleSWMessage)
        }

        return () => {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.removeEventListener('message', handleSWMessage)
            }
        }
    }, [])

    // ─── Helper: VAPID key conversion ────────────────────────────────────
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

    // ─── Push subscription (internal, no state dependency) ───────────────
    const subscribeToPushInternal = async () => {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) return

        setIsSubscribing(true)
        try {
            const registration = await navigator.serviceWorker.ready
            let subscription = await registration.pushManager.getSubscription()

            if (!subscription) {
                const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
                if (!publicKey) throw new Error("VAPID public key missing")

                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicKey)
                })
            }

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
    }

    // ─── Request notification permission ─────────────────────────────────
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
                await subscribeToPushInternal()
            }
        } catch {
            console.warn("Notification permission request failed")
        }
    }, [])

    // ─── Play alarm (stable — no state dependencies) ─────────────────────
    const playAlarm = useCallback(() => {
        const audio = audioRef.current
        if (audio) {
            // Resume AudioContext if suspended (background tab fix)
            if (audioContextRef.current?.state === 'suspended') {
                audioContextRef.current.resume().catch(() => { })
            }

            audio.currentTime = 0
            audio.play().catch((err) => {
                console.warn("[Notification] Audio play failed:", err)
                // Retry after a short delay (sometimes works on second attempt)
                setTimeout(() => {
                    audio.play().catch(() => { })
                }, 200)
            })
        }

        // Vibrate aggressively — long pattern like a phone call
        if ("vibrate" in navigator) {
            const pattern: number[] = []
            for (let i = 0; i < 10; i++) {
                pattern.push(500, 200)
            }
            navigator.vibrate(pattern)
        }

        // Show browser notification with UNIQUE tag per alarm burst
        if ("Notification" in window && Notification.permission === "granted") {
            const uniqueTag = `basma-order-${Date.now()}`
            try {
                const notif = new Notification("🔔 Nowe Zamówienie!", {
                    body: "Nowe zamówienie czeka na potwierdzenie w panelu Basma!",
                    icon: "/icons/icon-192x192.png",
                    badge: "/icons/icon-192x192.png",
                    tag: uniqueTag,
                    requireInteraction: true,
                    silent: false,
                })
                notif.onclick = () => {
                    window.focus()
                    notif.close()
                }
            } catch {
                // Fallback to service worker notification
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

    // ─── Stop alarm (stable — no state dependencies) ─────────────────────
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
        hasNewOrdersRef.current = false
        stopAlarm()
    }, [stopAlarm])

    // ─── Test button ─────────────────────────────────────────────────────
    const testAlert = useCallback(async () => {
        if (notifPermission !== "granted") {
            await requestNotificationPermission()
        }
        playAlarm()
        setHasNewOrders(true)
        hasNewOrdersRef.current = true
        setTimeout(() => {
            stopAlarm()
            setHasNewOrders(false)
            hasNewOrdersRef.current = false
        }, 5000)
    }, [playAlarm, stopAlarm, notifPermission, requestNotificationPermission])

    // ─── Check for new orders (stable — uses refs, not state) ────────────
    const checkNewOrders = useCallback(async () => {
        try {
            const activeOrders = await getActiveOrders()
            const pendingOrders = activeOrders.filter((o: any) => o.status === 'pending')
            const currentPendingIds = new Set<string>(pendingOrders.map((o: any) => String(o._id)))

            if (isInitialLoadRef.current) {
                knownOrderIdsRef.current = currentPendingIds
                isInitialLoadRef.current = false
                if (currentPendingIds.size > 0) {
                    setHasNewOrders(true)
                    hasNewOrdersRef.current = true
                }
                return
            }

            let hasNew = false
            currentPendingIds.forEach((id) => {
                if (!knownOrderIdsRef.current.has(id)) {
                    hasNew = true
                }
            })

            if (hasNew) {
                setHasNewOrders(true)
                hasNewOrdersRef.current = true
                playAlarm()
                knownOrderIdsRef.current = currentPendingIds
            } else {
                // If no pending orders left, stop the alarm (syncs across devices)
                if (currentPendingIds.size === 0 && hasNewOrdersRef.current) {
                    console.log('[Notification] No pending orders left, stopping alarm.')
                    stopAlert()
                }
                // Update known IDs to reflect accepted orders
                if (currentPendingIds.size !== knownOrderIdsRef.current.size) {
                    knownOrderIdsRef.current = currentPendingIds
                }
            }
        } catch (error) {
            console.error("[Notification] Error checking orders:", error)
        }
    }, [playAlarm, stopAlert]) // Only depends on stable callbacks

    // ─── Sanity real-time listener + polling fallback (STABLE) ────────────
    useEffect(() => {
        // 1. Subscribe to Sanity real-time updates (never re-created)
        const query = '*[_type == "order"]'
        const subscription = client.listen(query).subscribe({
            next: () => {
                console.log('[Notification] Sanity real-time event received')
                checkNewOrders()
            },
            error: (err) => {
                console.error('[Notification] Sanity listener error:', err)
                // Listener will auto-reconnect, but polling is our safety net
            }
        })

        // 2. Initial check
        checkNewOrders()

        // 3. Polling fallback every 15 seconds — catches missed WebSocket events
        const pollInterval = setInterval(() => {
            checkNewOrders()
        }, 15000)

        return () => {
            subscription.unsubscribe()
            clearInterval(pollInterval)
        }
    }, [checkNewOrders])

    return (
        <>
            {/* DOM-based audio is far more reliable on mobile/background tabs */}
            <audio ref={audioRef} id="alarm-audio" src="/sounds/order-alarm.wav" preload="auto" loop className="hidden" />
            
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
        </>
    )
}
