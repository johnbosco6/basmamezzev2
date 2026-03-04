"use client"

import { useCart } from "@/context/cart-context"
import { X, Plus, Minus, ShoppingBag, Trash2, ChevronRight, ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Archivo } from "next/font/google"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

const archivo = Archivo({ subsets: ["latin"], weight: ["200", "400", "600", "700"], display: "swap" })

interface CartDrawerProps {
    isOpen: boolean
    onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, removeItem, updateQty, totalItems, totalPrice } = useCart()

    // Prevent body scroll when drawer is open on mobile
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => { document.body.style.overflow = "" }
    }, [isOpen])

    return (
        <>
            {/* ─── Backdrop ──────────────────────────────────────── */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* ─── MOBILE: Bottom Sheet ──────────────────────────── */}
            <div
                className={`
                    md:hidden fixed bottom-0 left-0 right-0 z-[70]
                    flex flex-col
                    bg-gradient-to-b from-[#2B2B2B] to-[#1a1a1a]
                    rounded-t-3xl shadow-2xl border-t border-[#BA9D76]/30
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-y-0" : "translate-y-full"}
                `}
                style={{ maxHeight: "85vh" }}
            >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-12 h-1 rounded-full bg-white/20" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#BA9D76]/20">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-[#BA9D76]" />
                        <h2 className={`text-lg font-semibold text-white ${archivo.className}`}>
                            Twój Koszyk
                        </h2>
                        {totalItems > 0 && (
                            <span className="bg-[#BA9D76] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
                        aria-label="Zamknij koszyk"
                    >
                        <ChevronDown className="h-5 w-5" />
                    </button>
                </div>

                {/* Items — scrollable */}
                <div className="flex-1 overflow-y-auto py-3 px-4 space-y-3" style={{ WebkitOverflowScrolling: "touch" }}>
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                            <ShoppingBag className="h-14 w-14 text-white/20" />
                            <p className={`text-white/50 text-base font-light ${archivo.className}`}>
                                Twój koszyk jest pusty
                            </p>
                            <p className={`text-white/30 text-sm font-light ${archivo.className}`}>
                                Dodaj dania z menu, aby złożyć zamówienie
                            </p>
                            <Button
                                onClick={onClose}
                                className="mt-1 bg-[#BA9D76]/80 hover:bg-[#BA9D76] text-white"
                                size="sm"
                            >
                                Przeglądaj Menu
                            </Button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-3 p-3 rounded-2xl bg-white/5 border border-white/10"
                            >
                                {/* Image */}
                                <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-white/10">
                                    {item.image ? (
                                        <Image src={item.image} alt={item.name} width={64} height={64} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ShoppingBag className="h-6 w-6 text-white/20" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-white font-semibold text-sm leading-snug mb-1 truncate ${archivo.className}`}>
                                        {item.name}
                                    </p>
                                    <p className={`text-[#BA9D76] font-bold text-sm ${archivo.className}`}>
                                        {(item.price * item.quantity).toFixed(0)} zł
                                    </p>
                                    {/* Controls */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() => updateQty(item.id, item.quantity - 1)}
                                            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#BA9D76]/30 text-white flex items-center justify-center transition-colors"
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className={`text-white font-bold text-sm w-5 text-center ${archivo.className}`}>
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQty(item.id, item.quantity + 1)}
                                            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#BA9D76]/30 text-white flex items-center justify-center transition-colors"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="ml-auto w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 flex items-center justify-center transition-colors"
                                            aria-label="Usuń"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-4 border-t border-[#BA9D76]/20 bg-gradient-to-r from-[#BA9D76]/10 to-transparent space-y-3 pb-safe">
                        <div className="flex justify-between items-center">
                            <span className={`text-white/70 text-sm ${archivo.className}`}>Suma zamówienia:</span>
                            <span className={`text-[#BA9D76] font-bold text-xl ${archivo.className}`}>
                                {totalPrice.toFixed(0)} zł
                            </span>
                        </div>
                        <Link href="/checkout" onClick={onClose} className="block">
                            <Button className="w-full bg-[#BA9D76] hover:bg-[#a88a63] text-white font-semibold text-base py-6 shadow-lg rounded-2xl flex items-center justify-center gap-2">
                                Przejdź do Zamówienia
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* ─── DESKTOP: Side Drawer ──────────────────────────── */}
            <div
                className={`
                    hidden md:flex fixed top-0 right-0 h-full w-full max-w-md z-[70]
                    flex-col bg-gradient-to-b from-[#2B2B2B] to-[#1a1a1a]
                    shadow-2xl border-l border-[#BA9D76]/30
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "translate-x-full"}
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-[#BA9D76]/20 bg-gradient-to-r from-[#BA9D76]/15 to-transparent">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="h-5 w-5 text-[#BA9D76]" />
                        <h2 className={`text-xl font-semibold text-white ${archivo.className}`}>
                            Twój Koszyk
                            {totalItems > 0 && (
                                <span className="ml-2 bg-[#BA9D76] text-white text-sm font-bold px-2 py-0.5 rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                        aria-label="Zamknij koszyk"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto py-4 px-4 space-y-3">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
                            <ShoppingBag className="h-16 w-16 text-white/20" />
                            <p className={`text-white/50 text-lg font-light ${archivo.className}`}>
                                Twój koszyk jest pusty
                            </p>
                            <p className={`text-white/30 text-sm font-light ${archivo.className}`}>
                                Dodaj dania z menu, aby złożyć zamówienie
                            </p>
                            <Button
                                onClick={onClose}
                                className="mt-2 bg-[#BA9D76]/80 hover:bg-[#BA9D76] text-white border border-[#BA9D76]/50"
                            >
                                Przeglądaj Menu
                            </Button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#BA9D76]/30 transition-colors duration-200"
                            >
                                {/* Image */}
                                <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-white/10">
                                    {item.image ? (
                                        <Image src={item.image} alt={item.name} width={80} height={80} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ShoppingBag className="h-8 w-8 text-white/20" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-white font-semibold text-sm leading-snug mb-1 ${archivo.className}`}>
                                        {item.name}
                                    </p>
                                    <p className={`text-[#BA9D76] font-semibold text-sm mb-2 ${archivo.className}`}>
                                        {(item.price * item.quantity).toFixed(0)} zł
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-[#BA9D76]/30 text-white flex items-center justify-center transition-colors">
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className={`text-white font-semibold text-sm w-4 text-center ${archivo.className}`}>{item.quantity}</span>
                                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-[#BA9D76]/30 text-white flex items-center justify-center transition-colors">
                                            <Plus className="h-3 w-3" />
                                        </button>
                                        <button onClick={() => removeItem(item.id)} className="ml-auto w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 flex items-center justify-center transition-colors" aria-label="Usuń">
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-5 border-t border-[#BA9D76]/20 bg-gradient-to-r from-[#BA9D76]/10 to-transparent space-y-4">
                        <div className="flex justify-between items-center">
                            <span className={`text-white/70 font-light text-sm ${archivo.className}`}>Suma zamówienia:</span>
                            <span className={`text-[#BA9D76] font-bold text-xl ${archivo.className}`}>
                                {totalPrice.toFixed(0)} zł
                            </span>
                        </div>
                        <Link href="/checkout" onClick={onClose} className="block">
                            <Button className="w-full bg-[#BA9D76] hover:bg-[#a88a63] text-white font-semibold text-base py-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2">
                                Przejdź do Zamówienia
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    )
}
