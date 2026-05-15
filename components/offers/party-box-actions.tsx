"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, Phone, Check } from "lucide-react"
import { useCart, parsePrice } from "@/context/cart-context"
import { PackageGroup } from "@/app/menu/menu-data"
import { Archivo } from "next/font/google"
import { motion, AnimatePresence } from "framer-motion"

const archivo = Archivo({ subsets: ["latin"], weight: ["200", "400", "600", "700"], display: "swap" })

interface PartyBoxActionsProps {
    partyBox: PackageGroup
}

export function PartyBoxActions({ partyBox }: PartyBoxActionsProps) {
    const [showPhone, setShowPhone] = useState(false)

    const scrollToContact = () => {
        const element = document.getElementById("party-box-contact")
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <div className="flex flex-col gap-6 mt-4">
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-600 text-xs font-bold">!</span>
                </div>
                <p className={`text-amber-800 text-sm leading-relaxed ${archivo.className}`}>
                    <strong>Wymagane zamówienie z 24-godzinnym wyprzedzeniem.</strong><br />
                    Zestaw przygotowujemy ze świeżych składników specjalnie na Twoją okazję.
                </p>
            </div>

            <div className="flex flex-wrap gap-4">
                <Button 
                    size="lg" 
                    onClick={scrollToContact}
                    className="bg-[#BA9D76] hover:bg-[#BA9D76]/90 text-white border-none px-8 py-6 h-auto text-lg rounded-full shadow-lg transition-all hover:scale-105 w-full sm:w-auto"
                >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Zapytaj o dostępność
                </Button>

                <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => setShowPhone(!showPhone)}
                    className="border-gray-200 text-gray-700 hover:bg-white px-8 py-6 h-auto text-lg rounded-full bg-transparent w-full sm:w-auto"
                >
                    <Phone className="h-5 w-5 mr-2" />
                    Pokaż Numer
                </Button>
            </div>

            <AnimatePresence>
                {showPhone && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 bg-white border border-gray-100 shadow-xl rounded-2xl flex flex-col items-center gap-2">
                            <p className={`text-gray-500 text-sm font-medium ${archivo.className}`}>Zadzwoń bezpośrednio:</p>
                            <a 
                                href="tel:+48574933988" 
                                className={`text-3xl font-bold text-[#BA9D76] hover:scale-105 transition-transform ${archivo.className}`}
                            >
                                +48 574 933 988
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
