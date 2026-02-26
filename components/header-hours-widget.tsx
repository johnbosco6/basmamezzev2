"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { Archivo } from "next/font/google"

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["200", "400", "600", "700"],
  display: "swap",
})

interface OpeningHours {
  day: number // 0 = Sunday, 1 = Monday, etc.
  breakfast: { start: string; end: string }
  restaurant: { start: string; end: string }
}

const OPENING_HOURS: OpeningHours[] = [
  // Sunday (0)
  { day: 0, breakfast: { start: "10:00", end: "12:00" }, restaurant: { start: "12:00", end: "23:00" } },
  // Monday (1)
  { day: 1, breakfast: { start: "12:00", end: "12:00" }, restaurant: { start: "12:00", end: "23:00" } },
  // Tuesday (2)
  { day: 2, breakfast: { start: "12:00", end: "12:00" }, restaurant: { start: "12:00", end: "23:00" } },
  // Wednesday (3)
  { day: 3, breakfast: { start: "12:00", end: "12:00" }, restaurant: { start: "12:00", end: "23:00" } },
  // Thursday (4)
  { day: 4, breakfast: { start: "12:00", end: "12:00" }, restaurant: { start: "12:00", end: "23:00" } },
  // Friday (5)
  { day: 5, breakfast: { start: "12:00", end: "12:00" }, restaurant: { start: "12:00", end: "24:00" } },
  // Saturday (6)
  { day: 6, breakfast: { start: "10:00", end: "12:00" }, restaurant: { start: "12:00", end: "24:00" } },
]

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

function getCurrentStatus() {
  const now = new Date()
  const currentDay = now.getDay()
  const currentTime = now.getHours() * 60 + now.getMinutes()

  const todayHours = OPENING_HOURS.find((h) => h.day === currentDay)
  if (!todayHours) return { isOpen: false, nextOpening: null }

  const openStart = timeToMinutes(todayHours.breakfast.start) // Using breakfast start as opening time
  const closeEnd = todayHours.restaurant.end === "24:00" ? 24 * 60 : timeToMinutes(todayHours.restaurant.end)

  // Check if currently open (from breakfast start to restaurant end)
  if (currentTime >= openStart && currentTime < closeEnd) {
    return { isOpen: true, nextOpening: null }
  }

  // Restaurant is closed, find next opening
  let nextOpening = null

  // Check if opens later today
  if (currentTime < openStart) {
    nextOpening = `${todayHours.breakfast.start}`
  } else {
    // Find next day's opening
    const tomorrow = (currentDay + 1) % 7
    const tomorrowHours = OPENING_HOURS.find((h) => h.day === tomorrow)
    if (tomorrowHours) {
      nextOpening = `Jutro ${tomorrowHours.breakfast.start}`
    }
  }

  return { isOpen: false, nextOpening }
}

export function HeaderHoursWidget() {
  const [status, setStatus] = useState(getCurrentStatus())
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
      setStatus(getCurrentStatus())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  return (
    <div className="backdrop-blur-md bg-white/15 border border-white/25 rounded-full px-4 py-2 shadow-lg">
      <div className="flex items-center gap-3">
        <Clock className="h-4 w-4 text-[#BA9D76]" />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono text-white ${archivo.className}`}>{formatTime(currentTime)}</span>
            <div className={`flex items-center gap-1 ${archivo.className}`}>
              <div className={`w-2 h-2 rounded-full ${status.isOpen ? "bg-green-400" : "bg-red-400"}`} />
              <span className={`text-xs font-light ${status.isOpen ? "text-green-400" : "text-red-400"}`}>
                {status.isOpen ? "OTWARTE" : "ZAMKNIĘTE"}
              </span>
            </div>
          </div>
          {!status.isOpen && status.nextOpening && (
            <span className={`text-xs text-white/70 font-light ${archivo.className}`}>
              Otwieramy: {status.nextOpening}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
