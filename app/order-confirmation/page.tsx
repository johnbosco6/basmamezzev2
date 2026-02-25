"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Home, BookOpen, Phone, Clock, MapPin, Package } from "lucide-react"
import { Archivo } from "next/font/google"
import { Button } from "@/components/ui/button"
import { CartItem } from "@/context/cart-context"

const archivo = Archivo({ subsets: ["latin"], weight: ["200", "400", "600", "700"], display: "swap" })

interface DeliveryAddress {
    street: string
    houseNumber: string
    apartmentNumber: string
    floorNumber: string
    postcode: string
    city: string
    distanceKm: string
    fee: number
}

interface OrderData {
    orderNumber: string
    name: string
    phone: string
    email: string
    orderType: "delivery" | "pickup"
    deliveryAddress: DeliveryAddress | null
    notes: string
    items: CartItem[]
    subtotal: number
    deliveryFee: number
    totalPrice: number
}

export default function OrderConfirmationPage() {
    const router = useRouter()
    const [order, setOrder] = useState<OrderData | null>(null)

    useEffect(() => {
        const saved = sessionStorage.getItem("basma-order")
        if (!saved) { router.push("/menu"); return }
        try { setOrder(JSON.parse(saved)) } catch { router.push("/menu") }
    }, [router])

    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#597FB1] via-[#326096] to-[#2B2B2B] flex items-center justify-center">
                <div className="animate-spin h-10 w-10 rounded-full border-4 border-[#BA9D76]/30 border-t-[#BA9D76]" />
            </div>
        )
    }

    const totalItems = order.items.reduce((s, i) => s + i.quantity, 0)
    const isDelivery = order.orderType === "delivery"

    return (
        <div className={`min-h-screen bg-gradient-to-br from-[#597FB1] via-[#326096] to-[#2B2B2B] ${archivo.className}`}>
            <div className="container mx-auto px-4 py-12 max-w-2xl">

                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 border-2 border-green-400/40 rounded-full mb-5">
                        <CheckCircle className="h-10 w-10 text-green-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2">Zamówienie Złożone!</h1>
                    <p className="text-white/70 font-light text-lg">
                        Dziękujemy, <span className="text-[#BA9D76] font-semibold">{order.name.split(" ")[0]}</span>!
                    </p>
                </div>

                {/* Order Number Card */}
                <div className="bg-white/10 backdrop-blur-lg border border-[#BA9D76]/30 rounded-2xl p-5 mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-white/60 text-sm font-light">Numer zamówienia</p>
                        <p className="text-white font-bold text-2xl tracking-widest">#{order.orderNumber}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-white/60 text-sm font-light">Typ zamówienia</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-2xl">{isDelivery ? "🚚" : "📦"}</span>
                            <p className="text-white font-semibold">
                                {isDelivery ? "Dostawa do domu" : "Odbiór osobisty"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Delivery Address */}
                {isDelivery && order.deliveryAddress && (
                    <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl px-5 py-4 mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <MapPin className="h-4 w-4 text-[#BA9D76]" />
                            <span className="text-white font-semibold text-sm">Adres dostawy</span>
                        </div>
                        <p className="text-white/80 font-light text-sm">
                            {order.deliveryAddress.street} {order.deliveryAddress.houseNumber}
                            {order.deliveryAddress.apartmentNumber && ` / m. ${order.deliveryAddress.apartmentNumber}`}
                            {order.deliveryAddress.floorNumber && ` · piętro ${order.deliveryAddress.floorNumber}`}
                        </p>
                        <p className="text-white/60 font-light text-sm">
                            {order.deliveryAddress.postcode} {order.deliveryAddress.city}
                        </p>
                        {order.deliveryAddress.distanceKm && (
                            <p className="text-[#BA9D76] text-xs mt-1 font-light">
                                ~{order.deliveryAddress.distanceKm} km od restauracji · koszt dostawy: {order.deliveryAddress.fee} zł
                            </p>
                        )}
                    </div>
                )}

                {/* Pickup location */}
                {!isDelivery && (
                    <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
                        <Package className="h-5 w-5 text-[#BA9D76] flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-white font-semibold text-sm">Odbiór w restauracji</p>
                            <p className="text-white/60 font-light text-xs mt-0.5">
                                Krakowskie Przedmieście 3, Lublin
                            </p>
                        </div>
                    </div>
                )}

                {/* Wait Time Banner */}
                <div className="bg-[#BA9D76]/15 border border-[#BA9D76]/30 rounded-xl p-4 mb-6 flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[#BA9D76] flex-shrink-0" />
                    <p className="text-white/80 text-sm font-light">
                        Szacowany czas realizacji:{" "}
                        <span className="text-white font-semibold">
                            {isDelivery ? "35–50 minut" : "20–25 minut"}
                        </span>
                    </p>
                </div>

                {/* Ordered Items */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-[#BA9D76]/20 to-transparent px-5 py-4 border-b border-white/10">
                        <h2 className="text-white font-semibold">
                            Twoje Zamówienie ({totalItems} {totalItems === 1 ? "danie" : totalItems < 5 ? "dania" : "dań"})
                        </h2>
                    </div>
                    <div className="divide-y divide-white/5">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 px-5 py-3">
                                <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-white/10 border border-white/10">
                                    {item.image ? (
                                        <Image src={item.image} alt={item.name} width={56} height={56} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium text-sm leading-snug line-clamp-2">{item.name}</p>
                                    <p className="text-white/50 text-xs font-light">{item.quantity} × {item.price.toFixed(0)} zł</p>
                                </div>
                                <p className="text-[#BA9D76] font-bold text-sm flex-shrink-0">
                                    {(item.price * item.quantity).toFixed(0)} zł
                                </p>
                            </div>
                        ))}
                    </div>
                    {/* Totals */}
                    <div className="border-t border-white/10 bg-white/5 px-5 py-3 space-y-1.5">
                        <div className="flex justify-between text-sm">
                            <span className="text-white/60 font-light">Suma produktów</span>
                            <span className="text-white/80 font-medium">{order.subtotal.toFixed(0)} zł</span>
                        </div>
                        {isDelivery && (
                            <div className="flex justify-between text-sm">
                                <span className="text-white/60 font-light">Dostawa</span>
                                <span className="text-white/80 font-medium">+{order.deliveryFee} zł</span>
                            </div>
                        )}
                        <div className="border-t border-white/10 pt-2 flex justify-between">
                            <span className="text-white/70 font-light">Razem</span>
                            <span className="text-[#BA9D76] font-bold text-xl">{order.totalPrice.toFixed(0)} zł</span>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {order.notes && (
                    <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 mb-6">
                        <p className="text-white/50 text-xs font-light mb-1">Twoje uwagi:</p>
                        <p className="text-white/80 text-sm font-light italic">{order.notes}</p>
                    </div>
                )}

                {/* Contact */}
                <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 mb-8 flex items-center gap-3">
                    <Phone className="h-4 w-4 text-[#BA9D76] flex-shrink-0" />
                    <p className="text-white/70 text-sm font-light">
                        Masz pytania? Zadzwoń:{" "}
                        <a href="tel:+48574933988" className="text-[#BA9D76] font-semibold hover:underline">
                            +48 574 933 988
                        </a>
                    </p>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <Link href="/menu">
                        <Button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-5 rounded-xl transition-all gap-2">
                            <BookOpen className="h-4 w-4" />
                            Wróć do Menu
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button className="w-full bg-[#BA9D76] hover:bg-[#a88a63] text-white font-semibold py-5 rounded-xl transition-all gap-2">
                            <Home className="h-4 w-4" />
                            Strona Główna
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    )
}
