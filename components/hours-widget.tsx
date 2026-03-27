"use client"

import { useState, useEffect } from "react"
import { Clock, CheckCircle, XCircle } from "lucide-react"
import { Archivo } from "next/font/google"
import { OPENING_HOURS } from "@/lib/hours"

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["200", "400", "600", "700"],
  display: "swap",
})

function timeToMinutes(time: string): number {
  if (time === "00:00" || time === "24:00") return 24 * 60
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

function getCurrentStatus() {
  const now = new Date()
  const currentDay = now.getDay()
  const currentTime = now.getHours() * 60 + now.getMinutes()

  const todayHours = OPENING_HOURS.find((h) => h.day === currentDay)
  if (!todayHours) return { isOpen: false, nextOpening: null }

  const openStart = timeToMinutes(todayHours.start)
  const closeEnd = timeToMinutes(todayHours.end)

  // Check if currently open (from breakfast start to restaurant end)
  if (currentTime >= openStart && currentTime < closeEnd) {
    return { isOpen: true, nextOpening: null }
  }

  // Restaurant is closed, find next opening
  let nextOpening = null

  // Check if opens later today
  if (currentTime < openStart) {
    nextOpening = `Dziś o ${todayHours.start}`
  } else {
    // Find next day's opening
    const tomorrow = (currentDay + 1) % 7
    const tomorrowHours = OPENING_HOURS.find((h) => h.day === tomorrow)
    if (tomorrowHours) {
      const dayNames = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"]
      nextOpening = `${dayNames[tomorrow]} o ${tomorrowHours.start}`
    }
  }

  return { isOpen: false, nextOpening }
}

export function HoursWidget() {
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
    <div className="backdrop-blur-lg bg-white/10 border border-[#BA9D76]/25 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="h-6 w-6 text-[#BA9D76]" />
        <h3 className={`text-lg font-semibold text-white ${archivo.className}`}>Status Restauracji</h3>
      </div>

      <div className="space-y-4">
        {/* Current Time */}
        <div className="text-center">
          <div className={`text-2xl font-bold text-white font-mono ${archivo.className}`}>
            {formatTime(currentTime)}
          </div>
          <div className={`text-sm text-white/70 font-light ${archivo.className}`}>
            {currentTime.toLocaleDateString("pl-PL", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
          {status.isOpen ? (
            <>
              <CheckCircle className="h-6 w-6 text-green-400" />
              <div className="text-center">
                <div className={`text-lg font-semibold text-green-400 ${archivo.className}`}>OTWARTE</div>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-6 w-6 text-red-400" />
              <div className="text-center">
                <div className={`text-lg font-semibold text-red-400 ${archivo.className}`}>ZAMKNIĘTE</div>
                {status.nextOpening && (
                  <div className={`text-sm text-white/80 font-light ${archivo.className}`}>
                    Otwieramy: {status.nextOpening}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Today's Hours */}
        <div className="space-y-2">
          <h4 className={`text-sm font-medium text-[#BA9D76] ${archivo.className}`}>Dzisiejsze Godziny:</h4>
          <div className={`space-y-1 text-sm text-white/80 font-light ${archivo.className}`}>
            <div className="flex justify-between">
              <span>Godziny otwarcia:</span>
              <span>{[0, 6].includes(currentTime.getDay()) ? (currentTime.getDay() === 0 ? "10:00 - 23:00" : "10:00 - 00:00") : ([5].includes(currentTime.getDay()) ? "12:00 - 00:00" : "12:00 - 23:00")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
