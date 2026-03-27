"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { getActiveOrders } from "@/app/actions/admin-actions"
import { Bell, BellOff, Volume2, VolumeX } from "lucide-react"
import { Archivo } from "next/font/google"

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["400", "600"],
    display: "swap",
})

// YouTube IFrame API Types
declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: any;
    }
}

export function OrderNotification() {
    const [soundEnabled, setSoundEnabled] = useState(false)
    const [knownOrderIds, setKnownOrderIds] = useState<Set<string>>(new Set())
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const [hasNewOrders, setHasNewOrders] = useState(false)
    
    // YouTube Player State
    const playerRef = useRef<any>(null)
    const [isPlayerReady, setIsPlayerReady] = useState(false)

    // Load YouTube IFrame API
    useEffect(() => {
        // Only load if not already loaded
        if (!window.YT) {
            const tag = document.createElement('script')
            tag.src = "https://www.youtube.com/iframe_api"
            const firstScriptTag = document.getElementsByTagName('script')[0]
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

            window.onYouTubeIframeAPIReady = () => {
                initializePlayer()
            }
        } else {
            initializePlayer()
        }

        function initializePlayer() {
            playerRef.current = new window.YT.Player('youtube-audio-player', {
                height: '0',
                width: '0',
                videoId: 'FZga2WWdFqo', // Provided by user
                playerVars: {
                    'autoplay': 0,
                    'controls': 0,
                    'loop': 1,
                    'playlist': 'FZga2WWdFqo' // Required for looping
                },
                events: {
                    'onReady': () => setIsPlayerReady(true),
                    'onStateChange': (event: any) => {
                        // If it ended and we still have new orders, loop it
                        if (event.data === window.YT.PlayerState.ENDED && hasNewOrders && soundEnabled) {
                            playerRef.current.playVideo()
                        }
                    }
                }
            })
        }

        // Load preference
        const savedPref = localStorage.getItem("basma-admin-sound")
        if (savedPref === "true") {
            setSoundEnabled(true)
        }
    }, [])

    const toggleSound = () => {
        const newState = !soundEnabled
        setSoundEnabled(newState)
        localStorage.setItem("basma-admin-sound", String(newState))
        
        if (!newState && playerRef.current) {
            playerRef.current.pauseVideo()
        } else if (newState && hasNewOrders && playerRef.current) {
            playerRef.current.playVideo()
        }
    }

    const stopAlert = () => {
        setHasNewOrders(false)
        if (playerRef.current) {
            playerRef.current.pauseVideo()
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
                setHasNewOrders(true)
                // Play sound if enabled
                if (soundEnabled && playerRef.current && isPlayerReady) {
                    playerRef.current.seekTo(0)
                    playerRef.current.playVideo()
                }
                setKnownOrderIds(currentIds)
            } else {
                // If the set of items changed otherwise, update the list 
                // but don't stop the alert if orders were removed
                if (currentIds.size !== knownOrderIds.size) {
                    setKnownOrderIds(currentIds)
                }
                
                // If there are no active orders at all, stop the alert automatically
                if (currentIds.size === 0 && hasNewOrders) {
                    stopAlert()
                }
            }

        } catch (error) {
            console.error("Error polling for orders:", error)
        }
    }, [knownOrderIds, isInitialLoad, soundEnabled, isPlayerReady, hasNewOrders])

    // Poll every 15 seconds
    useEffect(() => {
        const interval = setInterval(checkNewOrders, 15000)
        return () => clearInterval(interval)
    }, [checkNewOrders])

    return (
        <>
            {/* Hidden Player */}
            <div id="youtube-audio-player" className="hidden pointer-events-none opacity-0 h-0 w-0"></div>

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
            </div>
        </>
    )
}
