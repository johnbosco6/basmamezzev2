"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { getActiveOrders } from "@/app/actions/admin-actions"
import { Bell, BellOff } from "lucide-react"
import { Archivo } from "next/font/google"

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["400", "600"],
    display: "swap",
})

export function OrderNotification() {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [soundEnabled, setSoundEnabled] = useState(false)
    const [knownOrderIds, setKnownOrderIds] = useState<Set<string>>(new Set())
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    // Ensure audio element is created client-side
    useEffect(() => {
        audioRef.current = new Audio("/sounds/notification.mp3")
        // Check local storage for user preference
        const savedPref = localStorage.getItem("basma-admin-sound")
        if (savedPref === "true") {
            setSoundEnabled(true)
        }
    }, [])

    const toggleSound = () => {
        const newState = !soundEnabled
        setSoundEnabled(newState)
        localStorage.setItem("basma-admin-sound", String(newState))
        
        // Play sound once on enable to test and satisfy browser interaction policies
        if (newState && audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.play().catch(console.error)
        }
    }

    const checkNewOrders = useCallback(async () => {
        try {
            const activeOrders = await getActiveOrders()
            const currentIds = new Set<string>(activeOrders.map((o: any) => String(o._id)))

            if (isInitialLoad) {
                setKnownOrderIds(currentIds)
                setIsInitialLoad(false)
                return
            }

            // Check for really new IDs
            let hasNew = false
            currentIds.forEach((id) => {
                if (!knownOrderIds.has(id as string)) {
                    hasNew = true
                }
            })

            if (hasNew) {
                // Play sound if enabled
                if (soundEnabled && audioRef.current) {
                    audioRef.current.currentTime = 0
                    audioRef.current.play().catch((err) => {
                        console.warn("Autoplay blocked or audio failed:", err)
                    })
                }
                setKnownOrderIds(currentIds)
            } else if (currentIds.size !== knownOrderIds.size) {
                 // Order might have been completed/cancelled (removed from active)
                 setKnownOrderIds(currentIds)
            }

        } catch (error) {
            console.error("Error polling for orders:", error)
        }
    }, [knownOrderIds, isInitialLoad, soundEnabled])

    // Poll every 15 seconds
    useEffect(() => {
        checkNewOrders()
        const interval = setInterval(checkNewOrders, 15000)
        return () => clearInterval(interval)
    }, [checkNewOrders])

    return (
        <button
            onClick={toggleSound}
            className={`fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md shadow-lg transition-all border ${
                soundEnabled 
                    ? "bg-[#BA9D76]/20 border-[#BA9D76]/50 text-[#BA9D76] hover:bg-[#BA9D76]/30" 
                    : "bg-white/5 border-white/10 text-white/40 hover:text-white/80 hover:bg-white/10"
            } ${archivo.className}`}
            title={soundEnabled ? "Powiadomienia dźwiękowe włączone" : "Powiadomienia dźwiękowe wyłączone (kliknij, by włączyć)"}
        >
            {soundEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            <span className="text-xs font-semibold">
                {soundEnabled ? "Dźwięk Wł." : "Dźwięk Wył."}
            </span>
        </button>
    )
}
