"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { useCart } from "@/context/cart-context"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
    ArrowLeft, ShoppingBag, User, Phone, Mail, MessageSquare,
    CheckCircle, Minus, Plus, Trash2, MapPin, Truck,
    Package, AlertCircle, Loader2, Home, Building2, ChevronDown, Search,
    CreditCard, Banknote, Wallet, X
} from "lucide-react"
import { Archivo } from "next/font/google"
import { Button } from "@/components/ui/button"
import { LUBLIN_STREETS } from "@/lib/lublin-streets"

const archivo = Archivo({ subsets: ["latin"], weight: ["200", "400", "600", "700"], display: "swap" })

// ─── Restaurant coordinates (Krakowskie Przedmieście 3, Lublin) ───────────────
const RESTAURANT_LAT = 51.2468
const RESTAURANT_LON = 22.5685

// ─── Delivery fee tiers ───────────────────────────────────────────────────────
function getDeliveryFee(km: number): number {
    if (km <= 3) return 12
    if (km <= 5) return 14
    if (km <= 6) return 16
    if (km <= 7) return 18
    if (km <= 8) return 20
    if (km <= 9) return 22
    return 24
}

function getDeliveryLabel(km: number): string {
    if (km <= 3) return "0–3 km"
    if (km <= 5) return "3–5 km"
    if (km <= 6) return "5–6 km"
    if (km <= 7) return "6–7 km"
    if (km <= 8) return "7–8 km"
    if (km <= 9) return "8–9 km"
    return "9+ km"
}

// ─── Haversine distance (km) ──────────────────────────────────────────────────
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ─── Nominatim geocode an address string → {lat, lon, display} ────────────────
async function geocodeAddress(address: string): Promise<{ lat: number; lon: number; display: string } | null> {
    try {
        const encoded = encodeURIComponent(address + ", Lublin, Polska")
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1&countrycodes=pl`,
            { headers: { "Accept-Language": "pl" } }
        )
        const data = await res.json()
        if (data && data.length > 0) {
            return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), display: data[0].display_name }
        }
    } catch { }
    return null
}

type OrderType = "delivery" | "pickup"

interface DeliveryInfo {
    lat: number
    lon: number
    distanceKm: number
    fee: number
}

export default function CheckoutPage() {
    const { items, removeItem, updateQty, totalPrice, totalItems, clearCart } = useCart()
    const router = useRouter()

    const [orderType, setOrderType] = useState<OrderType>("delivery")
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        // delivery address
        street: "",
        houseNumber: "",
        apartmentNumber: "",
        floorNumber: "",
        postcode: "",
        city: "Lublin",
        // extra
        notes: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Delivery distance/fee state
    const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null)
    const [geocodingAddress, setGeocodingAddress] = useState(false)
    const [locationError, setLocationError] = useState("")
    const [addressConfirmed, setAddressConfirmed] = useState(false)
    const [acceptedTerms, setAcceptedTerms] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<'p24' | 'cash' | 'card_on_delivery'>('p24')
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

    // Street dropdown state
    const [streetDropdownOpen, setStreetDropdownOpen] = useState(false)
    const [streetSearch, setStreetSearch] = useState("")
    const streetDropdownRef = useRef<HTMLDivElement>(null)

    // Filter streets based on search
    const filteredStreets = useMemo(() => {
        if (!streetSearch.trim()) return LUBLIN_STREETS
        const lower = streetSearch.toLowerCase()
        return LUBLIN_STREETS.filter(s => s.toLowerCase().includes(lower))
    }, [streetSearch])

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (streetDropdownRef.current && !streetDropdownRef.current.contains(e.target as Node)) {
                setStreetDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        if ((items.length === 0 || totalPrice < 40) && !isSubmitting) {
            const t = setTimeout(() => { if (items.length === 0 || totalPrice < 40) router.push("/menu") }, 800)
            return () => clearTimeout(t)
        }
    }, [items.length, totalPrice, isSubmitting, router])

    // ── Auto-geocode when street + houseNumber are filled ─────────────────────
    useEffect(() => {
        // Only auto-calculate for delivery orders
        if (orderType !== "delivery") return
        // Need at least street and house number
        if (!form.street.trim() || !form.houseNumber.trim()) {
            setDeliveryInfo(null)
            setAddressConfirmed(false)
            setLocationError("")
            return
        }

        const debounceTimer = setTimeout(async () => {
            setGeocodingAddress(true)
            setLocationError("")
            setDeliveryInfo(null)
            setAddressConfirmed(false)

            // Build the address string
            const addressParts = [
                `${form.street} ${form.houseNumber}`,
            ]
            if (form.postcode.trim()) addressParts.push(form.postcode)
            addressParts.push(form.city || "Lublin")
            const fullAddress = addressParts.join(", ")

            try {
                const result = await geocodeAddress(fullAddress)
                if (result) {
                    const km = haversineKm(RESTAURANT_LAT, RESTAURANT_LON, result.lat, result.lon)
                    setDeliveryInfo({
                        lat: result.lat,
                        lon: result.lon,
                        distanceKm: km,
                        fee: getDeliveryFee(km),
                    })
                    setAddressConfirmed(true)
                } else {
                    setLocationError("Nie udało się znaleźć podanego adresu. Sprawdź dane lub skontaktuj się z nami: +48 574 933 988")
                }
            } catch {
                setLocationError("Błąd podczas obliczania kosztu dostawy. Spróbuj ponownie lub zadzwoń: +48 574 933 988")
            } finally {
                setGeocodingAddress(false)
            }
        }, 800)

        return () => clearTimeout(debounceTimer)
    }, [form.street, form.houseNumber, form.postcode, form.city, orderType])

    const validate = () => {
        const e: Record<string, string> = {}
        if (!form.name.trim()) e.name = "Imię i nazwisko jest wymagane"
        if (!form.phone.trim()) e.phone = "Numer telefonu jest wymagany"
        else if (!/^[\d\s\+\-()]{7,}$/.test(form.phone)) e.phone = "Podaj prawidłowy numer"
        if (orderType === "delivery") {
            if (!form.street.trim()) e.street = "Ulica jest wymagana"
            if (!form.houseNumber.trim()) e.houseNumber = "Numer budynku jest wymagany"
            if (!deliveryInfo) e._delivery = "Poczekaj chwilę — koszt dostawy jest obliczany..."
        }
        if (!acceptedTerms) e.terms = "Musisz zaakceptować regulamin, aby złożyć zamówienie"
        return e
    }

    const deliveryFee = orderType === "delivery" && deliveryInfo ? deliveryInfo.fee : 0
    const grandTotal = totalPrice + deliveryFee

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length > 0) { setErrors(errs); return }
        setErrors({})
        setIsPaymentModalOpen(true)
    }

    const handleFinalConfirm = async () => {
        setIsPaymentModalOpen(false)
        setIsSubmitting(true)
        const orderNumber = Math.floor(1000 + Math.random() * 9000).toString()
        const orderData = {
            orderNumber,
            name: form.name,
            phone: form.phone,
            email: form.email,
            orderType,
            deliveryAddress: orderType === "delivery" ? {
                street: form.street,
                houseNumber: form.houseNumber,
                apartmentNumber: form.apartmentNumber,
                floorNumber: form.floorNumber,
                postcode: form.postcode,
                city: form.city,
                distanceKm: deliveryInfo?.distanceKm.toFixed(1),
                fee: deliveryInfo?.fee,
            } : null,
            notes: form.notes,
            items,
            subtotal: totalPrice,
            deliveryFee,
            totalPrice: grandTotal,
        }

        // Save to Sanity (non-blocking — but we log for debugging)
        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...orderData, paymentMethod }),
            })

            if (!response.ok) {
                const data = await response.json()
                console.error("Sanity save failed:", data.error)
            } else {
                console.log("Order saved to Sanity successfully")
            }
        } catch (err) {
            console.error("Network error saving to Sanity:", err)
        }


        // Always save to sessionStorage
        sessionStorage.setItem("basma-order", JSON.stringify({ ...orderData, paymentMethod }))

        // Branching based on payment method
        if (paymentMethod === 'p24') {
            // Trigger Przelewy24 Payment
            try {
                const p24Response = await fetch("/api/payments/p24/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        orderNumber,
                        totalAmount: grandTotal,
                        email: form.email || "klient@basma.pl", // Fallback if optional email missing
                        name: form.name,
                        phone: form.phone,
                        orderType,
                        deliveryAddress: orderData.deliveryAddress
                    }),
                })

                if (p24Response.ok) {
                    const { redirectUrl } = await p24Response.json()
                    clearCart()
                    // Redirect to P24
                    window.location.href = redirectUrl
                } else {
                    const errorData = await p24Response.json()
                    throw new Error(errorData.error || "Błąd inicjalizacji płatności")
                }
            } catch (err: any) {
                console.error("Payment redirect failed:", err)
                alert(`Wystąpił błąd podczas inicjalizacji płatności: ${err.message}. Spróbuj ponownie lub skontaktuj się z nami.`)
                setIsSubmitting(false)
            }
        } else {
            // Cash or Card on Delivery
            clearCart()
            router.push("/order-confirmation")
        }
    }


    // Delivery pricing table component
    const PricingTable = () => (
        <div className="grid grid-cols-2 gap-1.5 text-xs mt-3">
            {[
                { label: "0–3 km", price: "12 zł", max: 3 },
                { label: "3–5 km", price: "14 zł", max: 5 },
                { label: "5–6 km", price: "16 zł", max: 6 },
                { label: "6–7 km", price: "18 zł", max: 7 },
                { label: "7–8 km", price: "20 zł", max: 8 },
                { label: "8–9 km", price: "22 zł", max: 9 },
                { label: "9+ km", price: "24 zł", max: Infinity },
            ].map((tier, i, arr) => {
                const prevMax = i === 0 ? 0 : arr[i - 1].max
                const active = deliveryInfo && deliveryInfo.distanceKm > prevMax && deliveryInfo.distanceKm <= tier.max
                return (
                    <div key={tier.label} className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${active ? "bg-[#BA9D76]/15 border-[#BA9D76]/50 text-[#BA9D76] font-semibold" : "bg-gray-50 border-gray-200 text-gray-500 font-light"}`}>
                        <span className={archivo.className}>{tier.label}</span>
                        <span className={archivo.className}>{tier.price}</span>
                    </div>
                )
            })}
        </div>
    )

    return (
        <div className={`min-h-screen bg-gradient-to-br from-[#f8f6f2] to-white ${archivo.className}`}>
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#597FB1]/90 backdrop-blur-md border-b border-white/10 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/menu">
                        <Button variant="ghost" size="sm" className="text-white hover:text-[#BA9D76] hover:bg-white/10 gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Wróć do Menu</span>
                        </Button>
                    </Link>
                    <h1 className={`text-xl font-semibold text-white flex-1 text-center ${archivo.className}`}>
                        Finalizacja Zamówienia
                    </h1>
                    <div className="w-24 flex justify-end">
                        <div className="flex items-center gap-2 bg-[#BA9D76]/20 border border-[#BA9D76]/30 rounded-full px-3 py-1.5">
                            <ShoppingBag className="h-4 w-4 text-[#BA9D76]" />
                            <span className={`text-white text-sm font-semibold ${archivo.className}`}>{totalItems}</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 pt-4 max-w-6xl">
                <div className="flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    Minimalna kwota zamówienia wynosi: 40 zł
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-5 gap-8">

                        {/* ── LEFT: Customer Details ─────────────────────────────────── */}
                        <div className="lg:col-span-3 space-y-6">

                            {/* ORDER TYPE SELECTOR */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className={`text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 ${archivo.className}`}>
                                    <Truck className="h-5 w-5 text-[#BA9D76]" />
                                    Sposób Dostawy
                                </h2>
                                <div className="grid grid-cols-2 gap-3">
                                    <button type="button" onClick={() => { setOrderType("delivery"); setDeliveryInfo(null); setAddressConfirmed(false); setLocationError("") }}
                                        className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${orderType === "delivery" ? "border-[#BA9D76] bg-[#BA9D76]/5 text-[#BA9D76]" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                                        <Home className="h-7 w-7" />
                                        <span className={`font-semibold text-sm ${archivo.className}`}>Dostawa do Domu</span>
                                        <span className="text-xs opacity-70 font-light">od 12 zł · płatność online</span>
                                    </button>
                                    <button type="button" onClick={() => { setOrderType("pickup"); setDeliveryInfo(null); setAddressConfirmed(false); setLocationError("") }}
                                        className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${orderType === "pickup" ? "border-[#BA9D76] bg-[#BA9D76]/5 text-[#BA9D76]" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                                        <Package className="h-7 w-7" />
                                        <span className={`font-semibold text-sm ${archivo.className}`}>Odbiór Osobisty</span>
                                        <span className="text-xs opacity-70 font-light text-green-600 font-medium">Darmowy · płatność online</span>
                                    </button>
                                </div>

                                {/* Pickup info */}
                                {orderType === "pickup" && (
                                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className={`text-sm font-semibold text-green-800 ${archivo.className}`}>Odbiór bezpłatny!</p>
                                            <p className={`text-xs text-green-700 font-light mt-0.5 ${archivo.className}`}>
                                                Krakowskie Przedmieście 3, Lublin · czas realizacji: ~25 min
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* DELIVERY ADDRESS SECTION */}
                            {orderType === "delivery" && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                                    <h2 className={`text-lg font-semibold text-gray-900 flex items-center gap-2 ${archivo.className}`}>
                                        <MapPin className="h-5 w-5 text-[#BA9D76]" />
                                        Adres Dostawy
                                    </h2>


                                    {/* Street Dropdown + House Number */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="col-span-2 relative" ref={streetDropdownRef}>
                                            <label className={`block text-xs font-medium text-gray-700 mb-1.5 ${archivo.className}`}>
                                                Ulica <span className="text-red-500">*</span>
                                            </label>
                                            {/* Dropdown trigger */}
                                            <button
                                                type="button"
                                                onClick={() => { setStreetDropdownOpen(!streetDropdownOpen); setStreetSearch("") }}
                                                className={`w-full px-3 py-2.5 border rounded-xl text-left flex items-center justify-between transition-colors text-sm ${errors.street ? "border-red-400 bg-red-50" : streetDropdownOpen ? "border-[#BA9D76] ring-2 ring-[#BA9D76]/40 bg-white" : "border-gray-200 bg-gray-50 hover:border-gray-300"} ${archivo.className}`}
                                            >
                                                <span className={form.street ? "text-gray-900" : "text-gray-400"}>
                                                    {form.street || "Wybierz ulicę..."}
                                                </span>
                                                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${streetDropdownOpen ? "rotate-180" : ""}`} />
                                            </button>

                                            {/* Dropdown panel */}
                                            {streetDropdownOpen && (
                                                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                                                    {/* Search input */}
                                                    <div className="p-2 border-b border-gray-100">
                                                        <div className="relative">
                                                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                                            <input
                                                                type="text"
                                                                value={streetSearch}
                                                                onChange={(e) => setStreetSearch(e.target.value)}
                                                                placeholder="Szukaj ulicy..."
                                                                autoFocus
                                                                className={`w-full pl-8 pr-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#BA9D76]/40 focus:border-[#BA9D76] ${archivo.className}`}
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* Options list */}
                                                    <div className="max-h-48 overflow-y-auto">
                                                        {filteredStreets.length === 0 ? (
                                                            <div className="px-3 py-3 space-y-2">
                                                                <p className={`text-sm text-gray-400 text-center ${archivo.className}`}>
                                                                    Nie znaleziono ulicy na liście
                                                                </p>
                                                                {streetSearch.trim().length > 0 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setForm({ ...form, street: streetSearch.trim() })
                                                                            setStreetDropdownOpen(false)
                                                                            setStreetSearch("")
                                                                            setAddressConfirmed(false)
                                                                            setDeliveryInfo(null)
                                                                        }}
                                                                        className={`w-full text-left px-3 py-2.5 text-sm bg-[#BA9D76]/10 text-[#BA9D76] font-medium rounded-lg hover:bg-[#BA9D76]/20 transition-colors ${archivo.className}`}
                                                                    >
                                                                        Użyj: „{streetSearch.trim()}"
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            filteredStreets.map((street) => (
                                                                <button
                                                                    key={street}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setForm({ ...form, street })
                                                                        setStreetDropdownOpen(false)
                                                                        setStreetSearch("")
                                                                        setAddressConfirmed(false)
                                                                        setDeliveryInfo(null)
                                                                    }}
                                                                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${form.street === street
                                                                        ? "bg-[#BA9D76]/10 text-[#BA9D76] font-semibold"
                                                                        : "text-gray-700 hover:bg-gray-50"
                                                                        } ${archivo.className}`}
                                                                >
                                                                    {street}
                                                                </button>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-medium text-gray-700 mb-1.5 ${archivo.className}`}>
                                                Nr budynku <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={form.houseNumber}
                                                onChange={(e) => { setForm({ ...form, houseNumber: e.target.value }); setAddressConfirmed(false); setDeliveryInfo(null) }}
                                                placeholder="np. 12"
                                                className={`w-full px-3 py-2.5 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BA9D76]/40 focus:border-[#BA9D76] transition-colors text-sm ${errors.houseNumber ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"} ${archivo.className}`}
                                            />
                                            {errors.houseNumber && <p className="text-red-500 text-xs mt-1">{errors.houseNumber}</p>}
                                        </div>
                                    </div>

                                    {/* Apartment + Floor */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={`block text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1 ${archivo.className}`}>
                                                <Building2 className="h-3 w-3 text-gray-400" /> Nr mieszkania
                                            </label>
                                            <input
                                                type="text"
                                                value={form.apartmentNumber}
                                                onChange={(e) => setForm({ ...form, apartmentNumber: e.target.value })}
                                                placeholder="np. 5A"
                                                className={`w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BA9D76]/40 focus:border-[#BA9D76] transition-colors text-sm ${archivo.className}`}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-medium text-gray-700 mb-1.5 ${archivo.className}`}>
                                                Piętro
                                            </label>
                                            <input
                                                type="text"
                                                value={form.floorNumber}
                                                onChange={(e) => setForm({ ...form, floorNumber: e.target.value })}
                                                placeholder="np. 3"
                                                className={`w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BA9D76]/40 focus:border-[#BA9D76] transition-colors text-sm ${archivo.className}`}
                                            />
                                        </div>
                                    </div>

                                    {/* Postcode + City */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={`block text-xs font-medium text-gray-700 mb-1.5 ${archivo.className}`}>
                                                Kod pocztowy
                                            </label>
                                            <input
                                                type="text"
                                                value={form.postcode}
                                                onChange={(e) => { setForm({ ...form, postcode: e.target.value }); setAddressConfirmed(false); setDeliveryInfo(null) }}
                                                placeholder="np. 20-002"
                                                className={`w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BA9D76]/40 focus:border-[#BA9D76] transition-colors text-sm ${archivo.className}`}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-medium text-gray-700 mb-1.5 ${archivo.className}`}>
                                                Miasto
                                            </label>
                                            <input
                                                type="text"
                                                value={form.city}
                                                onChange={(e) => setForm({ ...form, city: e.target.value })}
                                                placeholder="Lublin"
                                                className={`w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BA9D76]/40 focus:border-[#BA9D76] transition-colors text-sm ${archivo.className}`}
                                            />
                                        </div>
                                    </div>

                                    {/* ── Auto-calculating delivery cost indicator ───── */}
                                    {geocodingAddress && (
                                        <div className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#597FB1]/30 bg-[#597FB1]/5 text-[#597FB1] text-sm font-medium">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span className={archivo.className}>Obliczanie kosztu dostawy...</span>
                                        </div>
                                    )}

                                    {/* Error */}
                                    {locationError && (
                                        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                                            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                            <p className={`text-xs text-red-600 font-light ${archivo.className}`}>{locationError}</p>
                                        </div>
                                    )}
                                    {errors._delivery && (
                                        <p className="text-red-500 text-xs font-light">{errors._delivery}</p>
                                    )}

                                    {/* Distance result */}
                                    {deliveryInfo && addressConfirmed && (
                                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span className={`text-sm font-medium text-green-800 ${archivo.className}`}>Koszt dostawy obliczony</span>
                                            </div>
                                            <div className="text-right">
                                                <span className={`font-bold text-[#BA9D76] text-lg ${archivo.className}`}>+{deliveryInfo.fee} zł</span>
                                                <p className={`text-xs text-gray-400 font-light ${archivo.className}`}>{deliveryInfo.distanceKm.toFixed(1)} km od restauracji</p>
                                            </div>
                                        </div>
                                    )}


                                </div>
                            )}

                            {/* CUSTOMER DETAILS */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className={`text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 ${archivo.className}`}>
                                    <User className="h-5 w-5 text-[#BA9D76]" />
                                    Twoje Dane
                                </h2>
                                <div className="space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label className={`block text-sm font-medium text-gray-700 mb-1.5 ${archivo.className}`}>
                                            Imię i Nazwisko <span className="text-red-500">*</span>
                                        </label>
                                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            placeholder="np. Jan Kowalski"
                                            className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BA9D76]/40 focus:border-[#BA9D76] transition-colors ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"} ${archivo.className}`} />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className={`block text-sm font-medium text-gray-700 mb-1.5 ${archivo.className}`}>
                                            Numer Telefonu <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                placeholder="+48 574 933 988"
                                                className={`w-full pl-10 pr-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BA9D76]/40 focus:border-[#BA9D76] transition-colors ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"} ${archivo.className}`} />
                                        </div>
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className={`block text-sm font-medium text-gray-700 mb-1.5 ${archivo.className}`}>
                                            Email <span className="text-gray-400 text-xs font-light">(opcjonalnie)</span>
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                placeholder="email@example.com"
                                                className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BA9D76]/40 focus:border-[#BA9D76] transition-colors ${archivo.className}`} />
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className={`block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5 ${archivo.className}`}>
                                            <MessageSquare className="h-4 w-4 text-[#BA9D76]" />
                                            Uwagi do Zamówienia <span className="text-gray-400 text-xs font-light">(opcjonalnie)</span>
                                        </label>
                                        <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                            placeholder="np. bez glutenu, alergie, kod do domofonu..."
                                            rows={3}
                                            className={`w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BA9D76]/40 focus:border-[#BA9D76] transition-colors resize-none ${archivo.className}`} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#597FB1]/5 border border-[#597FB1]/20 rounded-2xl p-4">
                                <p className={`text-sm text-gray-600 font-light ${archivo.className}`}>
                                    📞 Pytania? Zadzwoń: <span className="font-semibold text-gray-900">+48 574 933 988</span>
                                </p>
                                <p className={`text-xs text-gray-400 mt-1 font-light ${archivo.className}`}>
                                    Basma Mezze · Krakowskie Przedmieście 3 · Lublin
                                </p>
                            </div>
                        </div>

                        {/* ── RIGHT: Order Summary ───────────────────────────────────── */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">

                                {/* Summary Header */}
                                <div className="bg-gradient-to-r from-[#2B2B2B] to-[#326096] px-6 py-4">
                                    <h2 className={`text-lg font-semibold text-white flex items-center gap-2 ${archivo.className}`}>
                                        <ShoppingBag className="h-5 w-5 text-[#BA9D76]" />
                                        Twoje Zamówienie
                                    </h2>
                                </div>

                                {/* Items */}
                                <div className="divide-y divide-gray-50 max-h-[380px] overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-3 p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                                {item.image ? (
                                                    <Image src={item.image} alt={item.name} width={64} height={64} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-semibold text-gray-900 leading-snug mb-0.5 line-clamp-2 ${archivo.className}`}>{item.name}</p>
                                                <p className={`text-xs text-gray-500 font-light mb-2 ${archivo.className}`}>{item.price.toFixed(0)} zł / szt.</p>
                                                <div className="flex items-center gap-1.5">
                                                    <button type="button" onClick={() => updateQty(item.id, item.quantity - 1)}
                                                        className="w-6 h-6 rounded-md bg-gray-100 hover:bg-[#BA9D76]/20 text-gray-600 flex items-center justify-center transition-colors">
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className={`text-sm font-bold text-gray-900 w-4 text-center ${archivo.className}`}>{item.quantity}</span>
                                                    <button type="button" onClick={() => updateQty(item.id, item.quantity + 1)}
                                                        className="w-6 h-6 rounded-md bg-gray-100 hover:bg-[#BA9D76]/20 text-gray-600 flex items-center justify-center transition-colors">
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                    <span className={`ml-auto text-sm font-bold text-[#BA9D76] ${archivo.className}`}>{(item.price * item.quantity).toFixed(0)} zł</span>
                                                    <button type="button" onClick={() => removeItem(item.id)}
                                                        className="ml-1 w-6 h-6 rounded-md bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors">
                                                        <Trash2 className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="border-t border-gray-100 px-6 py-4 space-y-2 bg-gray-50">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span className={`font-light ${archivo.className}`}>Suma produktów</span>
                                        <span className={`font-semibold ${archivo.className}`}>{totalPrice.toFixed(0)} zł</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className={`font-light text-gray-600 ${archivo.className}`}>
                                            {orderType === "delivery"
                                                ? `Dostawa${deliveryInfo ? ` (${deliveryInfo.distanceKm.toFixed(1)} km)` : ""}`
                                                : "Odbiór osobisty"}
                                        </span>
                                        <span className={`font-semibold ${deliveryFee > 0 ? "text-gray-800" : "text-green-600"} ${archivo.className}`}>
                                            {deliveryFee > 0 ? `+${deliveryFee} zł` : "GRATIS"}
                                        </span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2 flex justify-between">
                                        <span className={`font-bold text-gray-900 ${archivo.className}`}>Razem</span>
                                        <span className={`font-bold text-xl text-[#BA9D76] ${archivo.className}`}>{grandTotal.toFixed(0)} zł</span>
                                    </div>
                                </div>

                                {/* Submit */}
                                <div className="px-6 pb-6 pt-4 space-y-5">
                                    {/* T&C Checkbox */}
                                    <div className="flex items-start gap-3">
                                        <div className="pt-0.5">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                checked={acceptedTerms}
                                                onChange={(e) => {
                                                    setAcceptedTerms(e.target.checked)
                                                    if (e.target.checked && errors.terms) {
                                                        setErrors(prev => { const n = { ...prev }; delete n.terms; return n; })
                                                    }
                                                }}
                                                className="h-5 w-5 rounded border-gray-300 text-[#BA9D76] focus:ring-[#BA9D76] accent-[#BA9D76] cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label htmlFor="terms" className={`text-sm text-gray-600 font-light cursor-pointer leading-tight block ${archivo.className}`}>
                                                Akceptuję <Link href="/regulamin" target="_blank" className="font-medium text-[#BA9D76] hover:underline">regulamin</Link> sklepu oraz zgadzam się na przetwarzanie moich danych osobowych w celu realizacji zamówienia. <span className="text-red-500">*</span>
                                            </label>
                                            {errors.terms && <p className={`text-red-500 text-xs mt-1.5 font-medium ${archivo.className}`}>{errors.terms}</p>}
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || items.length === 0}
                                        className="w-full bg-gradient-to-r from-[#BA9D76] to-[#a88a63] hover:from-[#a88a63] hover:to-[#96794f] text-white font-semibold text-base py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Wysyłanie...</span>
                                        ) : geocodingAddress && orderType === "delivery" ? (
                                            <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Obliczanie dostawy...</span>
                                        ) : (
                                            "Złóż Zamówienie"
                                        )}
                                    </Button>
                                    <p className={`text-[10px] text-center text-gray-400 mt-2 font-light px-4 ${archivo.className}`}>
                                        Klikając przycisk powyżej, potwierdzasz zamówienie i przejdziesz do wyboru metody płatności.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* PAYMENT MODAL */}
            <AnimatePresence>
                {isPaymentModalOpen && (
                    <>
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsPaymentModalOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            key="modal"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-[#2B2B2B] to-[#326096] p-6 text-white relative">
                                <button
                                    onClick={() => setIsPaymentModalOpen(false)}
                                    type="button"
                                    className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                <h3 className={`text-xl font-bold mb-1 ${archivo.className}`}>Wybierz metodę płatności</h3>
                                <p className="text-white/70 text-sm font-light">Ostatni krok przed potwierdzeniem zamówienia</p>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="grid gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('p24')}
                                        className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 text-left ${paymentMethod === 'p24' ? "border-[#BA9D76] bg-[#BA9D76]/5 text-[#BA9D76]" : "border-gray-100 text-gray-600 hover:border-gray-200"}`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${paymentMethod === 'p24' ? "bg-[#BA9D76]/20" : "bg-gray-100"}`}>
                                            <Wallet className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-bold text-base ${archivo.className}`}>Płatność Online</p>
                                            <p className="text-xs opacity-70 font-light">Przelewy24 / Blik / Karta</p>
                                        </div>
                                        {paymentMethod === 'p24' && <CheckCircle className="h-6 w-6" />}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('cash')}
                                        className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 text-left ${paymentMethod === 'cash' ? "border-[#BA9D76] bg-[#BA9D76]/5 text-[#BA9D76]" : "border-gray-100 text-gray-600 hover:border-gray-200"}`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${paymentMethod === 'cash' ? "bg-[#BA9D76]/20" : "bg-gray-100"}`}>
                                            <Banknote className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-bold text-base ${archivo.className}`}>Gotówka przy odbiorze</p>
                                            <p className="text-xs opacity-70 font-light">Zapłać kurierowi lub w restauracji</p>
                                        </div>
                                        {paymentMethod === 'cash' && <CheckCircle className="h-6 w-6" />}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('card_on_delivery')}
                                        className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 text-left ${paymentMethod === 'card_on_delivery' ? "border-[#BA9D76] bg-[#BA9D76]/5 text-[#BA9D76]" : "border-gray-100 text-gray-600 hover:border-gray-200"}`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${paymentMethod === 'card_on_delivery' ? "bg-[#BA9D76]/20" : "bg-gray-100"}`}>
                                            <CreditCard className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-bold text-base ${archivo.className}`}>Karta przy odbiorze</p>
                                            <p className="text-xs opacity-70 font-light">Płatność terminalem u kierowcy</p>
                                        </div>
                                        {paymentMethod === 'card_on_delivery' && <CheckCircle className="h-6 w-6" />}
                                    </button>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-4 mt-6 flex items-center justify-between border border-gray-100">
                                    <div>
                                        <p className="text-gray-500 text-xs font-light">Do zapłaty:</p>
                                        <p className={`text-2xl font-bold text-gray-900 ${archivo.className}`}>{grandTotal.toFixed(0)} zł</p>
                                    </div>
                                    <Button
                                        onClick={handleFinalConfirm}
                                        className="h-12 px-8 bg-[#BA9D76] hover:bg-[#a88a63] text-white font-bold rounded-xl shadow-lg transition-all"
                                    >
                                        Potwierdzam
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
