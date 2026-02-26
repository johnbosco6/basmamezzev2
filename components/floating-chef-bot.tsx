"use client"

import { useState, useEffect, useMemo } from "react"
import { Clock, Phone, Mail, ChefHat, X, Sparkles, Utensils, Flame, Leaf, Heart, Facebook, Instagram, Star, Calendar } from "lucide-react"
import { Archivo } from "next/font/google"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { menuData } from "@/app/menu/menu-data"

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["200", "400", "600", "700"],
    display: "swap",
})

interface OpeningHours {
    day: number
    breakfast: { start: string; end: string }
    restaurant: { start: string; end: string }
}

const OPENING_HOURS: OpeningHours[] = [
    { day: 0, breakfast: { start: "10:00", end: "12:00" }, restaurant: { start: "12:00", end: "23:00" } },
    { day: 1, breakfast: { start: "12:00", end: "12:00" }, restaurant: { start: "12:00", end: "23:00" } },
    { day: 2, breakfast: { start: "12:00", end: "12:00" }, restaurant: { start: "12:00", end: "23:00" } },
    { day: 3, breakfast: { start: "12:00", end: "12:00" }, restaurant: { start: "12:00", end: "23:00" } },
    { day: 4, breakfast: { start: "12:00", end: "12:00" }, restaurant: { start: "12:00", end: "23:00" } },
    { day: 5, breakfast: { start: "12:00", end: "12:00" }, restaurant: { start: "12:00", end: "24:00" } },
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

    const openStart = timeToMinutes(todayHours.breakfast.start)
    const closeEnd = todayHours.restaurant.end === "24:00" ? 24 * 60 : timeToMinutes(todayHours.restaurant.end)

    if (currentTime >= openStart && currentTime < closeEnd) {
        return { isOpen: true, nextOpening: null }
    }

    let nextOpening = null
    if (currentTime < openStart) {
        nextOpening = `${todayHours.breakfast.start}`
    } else {
        const tomorrow = (currentDay + 1) % 7
        const tomorrowHours = OPENING_HOURS.find((h) => h.day === tomorrow)
        if (tomorrowHours) {
            nextOpening = `Jutro ${tomorrowHours.breakfast.start}`
        }
    }

    return { isOpen: false, nextOpening }
    return { isOpen: false, nextOpening }
}

const FACTS = [
    "Hummus oznacza po arabsku po prostu 'ciecierzyca'.",
    "Baklava ma 33 warstwy ciasta, co symbolizuje lata życia Chrystusa.",
    "Kawa po turecku jest wpisana na listę niematerialnego dziedzictwa UNESCO.",
    "Słowo 'Mezze' pochodzi od perskiego 'mazze', co oznacza 'smak'.",
    "W kulturze Bliskiego Wschodu gościnność jest najważniejszą cnotą.",
]

type Mood = "spicy" | "light" | "sweet" | "hearty"

const MOODS: { id: Mood; label: string; icon: any; color: string }[] = [
    { id: "spicy", label: "Pikantne", icon: Flame, color: "text-red-500" },
    { id: "light", label: "Lekkie", icon: Leaf, color: "text-green-500" },
    { id: "sweet", label: "Słodkie", icon: Sparkles, color: "text-yellow-500" },
    { id: "hearty", label: "Syte", icon: Heart, color: "text-orange-500" },
]

const RECOMMENDATIONS: Record<Mood, string[]> = {
    spicy: ["szakszuka-kofta", "syrian-sandwich", "adana-kebap", "spicy-eggplant", "harissa"],
    light: ["tabbouleh", "fattoush", "greek-sandwich", "labneh", "hummus-classic"],
    sweet: ["kunafa", "dubai-dream", "creme-brulee-basma", "labneh-sweet"],
    hearty: ["meat-platter-2", "lamb-chops", "kofty-jagniece", "szakszuka-kofta"],
}

export function FloatingChefBot() {
    const [isOpen, setIsOpen] = useState(false)
    const [status, setStatus] = useState(getCurrentStatus())
    const [currentTime, setCurrentTime] = useState(new Date())
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
    const [currentFact, setCurrentFact] = useState(FACTS[0])
    const [recommendation, setRecommendation] = useState<any | null>(null)

    useEffect(() => {
        setCurrentFact(FACTS[Math.floor(Math.random() * FACTS.length)])
    }, [isOpen])

    const handleMoodSelect = (mood: Mood) => {
        setSelectedMood(mood)
        const possibleIds = RECOMMENDATIONS[mood]
        const randomId = possibleIds[Math.floor(Math.random() * possibleIds.length)]

        // Find the item in menuData
        let foundItem = null
        for (const section of menuData) {
            for (const category of section.categories) {
                const item = category.items.find(i => i.id === randomId)
                if (item) {
                    foundItem = item
                    break
                }
            }
            if (foundItem) break
        }
        setRecommendation(foundItem)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date())
            setStatus(getCurrentStatus())
        }, 60000)

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
        <>
            {/* Floating Chef Bot Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 group"
                aria-label="Basma Quick Help"
            >
                <div className="relative">
                    {/* Pulsing glow effect */}
                    <div className="absolute inset-0 bg-[#BA9D76] rounded-full blur-xl opacity-50 animate-pulse"></div>

                    {/* Main button */}
                    <div className="relative bg-gradient-to-br from-[#597FB1] to-[#326096] p-4 rounded-full shadow-2xl border-2 border-[#BA9D76]/50 backdrop-blur-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(186,157,118,0.6)] animate-float">
                        <ChefHat className="h-8 w-8 text-white" />
                    </div>

                    {/* Notification badge */}
                    <div className="absolute -top-1 -right-1 bg-[#BA9D76] text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white shadow-lg">
                        !
                    </div>
                </div>
            </button>

            {/* Popup Card */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Card */}
                    <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] animate-slide-up">
                        <div className="bg-gradient-to-br from-[#597FB1] via-[#326096] to-[#2B2B2B] rounded-2xl shadow-2xl border-2 border-[#BA9D76]/50 overflow-hidden backdrop-blur-xl">
                            {/* Header with Time Widget */}
                            <div className="bg-gradient-to-r from-[#BA9D76]/30 to-[#BA9D76]/20 border-b border-[#BA9D76]/30 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <ChefHat className="h-5 w-5 text-[#BA9D76]" />
                                        <h3 className={`text-white font-semibold ${archivo.className}`}>Basma Quick Help</h3>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-white/70 hover:text-white transition-colors duration-200"
                                        aria-label="Zamknij"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Time Widget */}
                                <div className="backdrop-blur-md bg-white/15 border border-white/25 rounded-lg px-3 py-2">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-[#BA9D76]" />
                                        <div className="flex flex-col flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm font-mono text-white ${archivo.className}`}>
                                                    {formatTime(currentTime)}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <div className={`w-2 h-2 rounded-full ${status.isOpen ? "bg-green-400" : "bg-red-400"}`} />
                                                    <span
                                                        className={`text-xs font-light ${status.isOpen ? "text-green-400" : "text-red-400"} ${archivo.className}`}
                                                    >
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
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">

                                {/* Order Online Button */}
                                <a
                                    href="https://www.pyszne.pl/menu/basma-mezze-grill"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full"
                                >
                                    <Button className="w-full bg-[#FF8000] hover:bg-[#E67300] text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse">
                                        <Utensils className="mr-2 h-4 w-4" />
                                        <span className={archivo.className}>Zamów Online (Pyszne.pl)</span>
                                    </Button>
                                </a>

                                {/* Special Events Menu Button */}
                                <Link href="/menu#specjalne-okazje" onClick={() => setIsOpen(false)} className="block w-full">
                                    <Button className="w-full bg-gradient-to-r from-[#BA9D76] to-[#8B7355] hover:from-[#A68B66] hover:to-[#7A6548] text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        <span className={archivo.className}>Menu na Specjalne Okazje</span>
                                    </Button>
                                </Link>

                                {/* Mood Selector */}
                                <div className="space-y-3">
                                    <h4 className={`text-sm font-semibold text-[#BA9D76] uppercase tracking-wide ${archivo.className}`}>
                                        Na co masz ochotę?
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {MOODS.map((mood) => (
                                            <button
                                                key={mood.id}
                                                onClick={() => handleMoodSelect(mood.id)}
                                                className={`p-2 rounded-lg border transition-all duration-300 flex flex-col items-center gap-1
                                                    ${selectedMood === mood.id
                                                        ? "bg-[#BA9D76]/20 border-[#BA9D76] text-white"
                                                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30"
                                                    }`}
                                            >
                                                <mood.icon className={`h-5 w-5 ${mood.color}`} />
                                                <span className={`text-xs ${archivo.className}`}>{mood.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Recommendation Result */}
                                {recommendation && (
                                    <div className="bg-white/10 rounded-lg p-3 border border-[#BA9D76]/30 animate-slide-up">
                                        <p className={`text-xs text-[#BA9D76] mb-1 ${archivo.className}`}>Polecam spróbować:</p>
                                        <h5 className={`text-white font-semibold mb-1 ${archivo.className}`}>{recommendation.name}</h5>
                                        <p className={`text-white/70 text-xs line-clamp-2 mb-2 ${archivo.className}`}>{recommendation.description}</p>
                                        <Link href="/menu" onClick={() => setIsOpen(false)}>
                                            <span className="text-xs text-[#BA9D76] hover:underline cursor-pointer">Zobacz w menu →</span>
                                        </Link>
                                    </div>
                                )}

                                {/* Did You Know */}
                                <div className="bg-[#BA9D76]/10 rounded-lg p-3 border border-[#BA9D76]/20">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Sparkles className="h-3 w-3 text-[#BA9D76]" />
                                        <span className={`text-xs font-semibold text-[#BA9D76] ${archivo.className}`}>Czy wiesz, że...</span>
                                    </div>
                                    <p className={`text-white/80 text-xs italic ${archivo.className}`}>
                                        "{currentFact}"
                                    </p>
                                </div>

                                <div className="h-px bg-white/10" />

                                {/* Social & Rating */}
                                <div className="grid grid-cols-2 gap-3">
                                    <a
                                        href="https://www.tripadvisor.com/Restaurant_Review-g274818-d33304979-Reviews-Basma_Mezze_Grill-Lublin_Lublin_Province_Eastern_Poland.html"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="col-span-2"
                                    >
                                        <Button variant="outline" className="w-full border-[#BA9D76] text-[#BA9D76] hover:bg-[#BA9D76] hover:text-white transition-colors">
                                            <Star className="mr-2 h-4 w-4" />
                                            <span className={archivo.className}>Oceń nas na TripAdvisor</span>
                                        </Button>
                                    </a>

                                    <a
                                        href="https://www.facebook.com/Basmamezze"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button className="w-full bg-[#1877F2] text-white hover:bg-[#1877F2]/90 transition-colors border-none">
                                            <Facebook className="mr-2 h-4 w-4" fill="currentColor" strokeWidth={0} />
                                            <span className={archivo.className}>Facebook</span>
                                        </Button>
                                    </a>

                                    <a
                                        href="https://www.instagram.com/basma.mezze/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button className="w-full bg-[#E4405F] text-white hover:bg-[#E4405F]/90 transition-colors border-none">
                                            <Instagram className="mr-2 h-4 w-4" strokeWidth={2.5} />
                                            <span className={archivo.className}>Instagram</span>
                                        </Button>
                                    </a>
                                </div>

                                <div className="h-px bg-white/10" />
                                {/* Reservation Section */}
                                <div className="space-y-2">
                                    <h4 className={`text-sm font-semibold text-[#BA9D76] uppercase tracking-wide ${archivo.className}`}>
                                        Rezerwacje
                                    </h4>
                                    <a
                                        href="tel:+48574933988"
                                        className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#BA9D76]/50 transition-all duration-300 group"
                                    >
                                        <div className="bg-[#BA9D76]/20 p-2 rounded-lg group-hover:bg-[#BA9D76]/30 transition-colors duration-300">
                                            <Phone className="h-4 w-4 text-[#BA9D76]" />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-xs text-white/70 font-light ${archivo.className}`}>Zadzwoń teraz</p>
                                            <p className={`text-white font-semibold ${archivo.className}`}>+48 574 933 988</p>
                                        </div>
                                    </a>
                                </div>

                                {/* Contact Email */}
                                <div className="space-y-2">
                                    <h4 className={`text-sm font-semibold text-[#BA9D76] uppercase tracking-wide ${archivo.className}`}>
                                        Skontaktuj się z nami
                                    </h4>
                                    <a
                                        href="mailto:basmalublin@gmail.com"
                                        className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#BA9D76]/50 transition-all duration-300 group"
                                    >
                                        <div className="bg-[#BA9D76]/20 p-2 rounded-lg group-hover:bg-[#BA9D76]/30 transition-colors duration-300">
                                            <Mail className="h-4 w-4 text-[#BA9D76]" />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-xs text-white/70 font-light ${archivo.className}`}>Email</p>
                                            <p className={`text-white font-semibold text-sm ${archivo.className}`}>basmalublin@gmail.com</p>
                                        </div>
                                    </a>
                                </div>

                                {/* Menu Button */}
                                <Link href="/menu" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full bg-[#BA9D76]/80 hover:bg-[#BA9D76] text-white border border-[#BA9D76]/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                        <span className={archivo.className}>Zobacz Menu</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(2deg);
          }
          50% {
            transform: translateY(-5px) rotate(-2deg);
          }
          75% {
            transform: translateY(-15px) rotate(1deg);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
        </>
    )
}
