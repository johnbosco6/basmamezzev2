"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Phone, Check } from "lucide-react"
import { useCart, parsePrice } from "@/context/cart-context"
import { PackageGroup } from "@/app/menu/menu-data"
import { Archivo } from "next/font/google"
import { motion, AnimatePresence } from "framer-motion"

const archivo = Archivo({ subsets: ["latin"], weight: ["200", "400", "600", "700"], display: "swap" })

interface PartyBoxActionsProps {
    partyBox: PackageGroup
}

export function PartyBoxActions({ partyBox }: PartyBoxActionsProps) {
    const { addItem, setCartOpen } = useCart()
    const [showPhone, setShowPhone] = useState(false)
    const [added, setAdded] = useState(false)

    const handleAddToCart = () => {
        addItem({
            id: partyBox.packageId,
            name: partyBox.packageName,
            price: parsePrice(partyBox.packagePrice),
            image: partyBox.packageImage,
            description: "Zestaw dla 4 osób - najlepsze mezze i przekąski"
        })
        setAdded(true)
        setCartOpen(true)
        
        // Reset "Added" state after 2 seconds
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-wrap gap-4">
                <Button 
                    size="lg" 
                    onClick={handleAddToCart}
                    className="bg-[#BA9D76] hover:bg-[#BA9D76]/90 text-white border-none px-8 py-6 h-auto text-lg rounded-full shadow-lg transition-all hover:scale-105 w-full sm:w-auto"
                >
                    {added ? (
                        <Check className="h-5 w-5 mr-2 animate-in zoom-in duration-300" />
                    ) : (
                        <ShoppingBag className="h-5 w-5 mr-2" />
                    )}
                    {added ? "Dodano do koszyka" : "Zamów Online"}
                </Button>

                <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => setShowPhone(!showPhone)}
                    className="border-gray-200 text-gray-700 hover:bg-white px-8 py-6 h-auto text-lg rounded-full bg-transparent w-full sm:w-auto"
                >
                    <Phone className="h-5 w-5 mr-2" />
                    Zapytaj o szczegóły
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
                        <div className="p-4 bg-[#BA9D76]/10 border border-[#BA9D76]/20 rounded-2xl flex flex-col items-center gap-2 mt-2">
                            <p className={`text-gray-600 text-sm font-medium ${archivo.className}`}>Zadzwoń do nas:</p>
                            <a 
                                href="tel:+48574933988" 
                                className={`text-2xl font-bold text-[#BA9D76] hover:underline ${archivo.className}`}
                            >
                                +48 574 933 988
                            </a>
                            <p className="text-gray-400 text-xs italic">Dostępni w godzinach otwarcia</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
