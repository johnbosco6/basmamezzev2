"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, BookOpen, MessageCircle, Utensils, Calendar, Megaphone, Phone, ChevronDown, Check } from "lucide-react"
import { Archivo } from "next/font/google"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { specialOccasionsData, allergenMap } from "../menu/menu-data"

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["200", "400", "600", "700"],
    display: "swap",
})

export default function SpecialEventsPage() {
    const [mounted, setMounted] = useState(false)
    const [expandedPackages, setExpandedPackages] = useState<Record<string, boolean>>({})

    useEffect(() => { setMounted(true) }, [])

    // Toggle package expansion
    const togglePackage = (packageId: string) => {
        setExpandedPackages(prev => ({
            ...prev,
            [packageId]: !prev[packageId]
        }))
    }

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-[#597FB1]/80 border-b border-white/10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex-1 flex justify-start"></div>
                    <nav className="flex-1 flex items-center justify-center gap-2 md:gap-6 backdrop-blur-md bg-white/15 border border-white/25 rounded-full px-2 md:px-6 py-3 shadow-lg">
                        <Link
                            href="/"
                            className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group"
                        >
                            <Home className="h-4 w-4 transition-colors duration-300" />
                            <span className={`text-xs font-light ${archivo.className}`}>Strona Główna</span>
                        </Link>
                        <Link
                            href="/menu"
                            className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group"
                        >
                            <BookOpen className="h-4 w-4 transition-colors duration-300" />
                            <span className={`text-xs font-light ${archivo.className}`}>Menu</span>
                        </Link>
                        <Link
                            href="/newsletter"
                            className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group"
                        >
                            <Megaphone className="h-4 w-4 transition-colors duration-300" />
                            <span className={`text-xs font-light ${archivo.className}`}>Oferty</span>
                        </Link>
                        <Link
                            href="/faq"
                            className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group"
                        >
                            <MessageCircle className="h-4 w-4 transition-colors duration-300" />
                            <span className={`text-xs font-light ${archivo.className}`}>FAQ</span>
                        </Link>
                        <Link
                            href="/#contact"
                            className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group"
                        >
                            <Phone className="h-4 w-4 transition-colors duration-300" />
                            <span className={`text-xs font-light ${archivo.className}`}>Kontakt</span>
                        </Link>
                    </nav>
                    <div className="flex-1 flex justify-end"></div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden bg-gradient-to-r from-[#597FB1] to-[#BA9D76]">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className={`text-4xl md:text-6xl font-semibold mb-6 text-white ${archivo.className}`}>
                            Eventy Specjalne
                        </h1>
                        <p className={`text-xl text-white/90 font-light ${archivo.className}`}>
                            Zorganizuj niezapomniane wydarzenie w Basma Mezze & Grill. Oferujemy dedykowane pakiety menu dla grup i na specjalne okazje.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <main className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className={`text-3xl md:text-4xl font-semibold mb-4 text-gray-900 ${archivo.className}`}>
                            Nasza Oferta
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#BA9D76] to-[#597FB1] mx-auto rounded-full"></div>
                        <p className={`mt-6 text-gray-600 font-light ${archivo.className}`}>
                            Wybierz jeden z naszych starannie przygotowanych pakietów lub skontaktuj się z nami, aby stworzyć ofertę szytą na miarę.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {specialOccasionsData.packages?.map((pkg) => {
                            const isExpanded = expandedPackages[pkg.packageId]
                            return (
                                <div key={pkg.packageId} className="group overflow-hidden rounded-3xl border border-gray-100 shadow-xl transition-all duration-300 hover:shadow-2xl">
                                    {/* Package Preview */}
                                    <div
                                        onClick={() => togglePackage(pkg.packageId)}
                                        className="cursor-pointer flex flex-col md:flex-row bg-white overflow-hidden"
                                    >
                                        {pkg.packageImage && (
                                            <div className="relative w-full md:w-80 h-64 md:h-auto overflow-hidden">
                                                <Image
                                                    src={pkg.packageImage}
                                                    alt={pkg.packageName}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/40 to-transparent"></div>
                                            </div>
                                        )}
                                        <div className="flex-1 p-8 flex flex-col justify-center bg-gray-50/50">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className={`text-2xl md:text-3xl font-semibold text-gray-900 mb-2 ${archivo.className}`}>
                                                        {pkg.packageName}
                                                    </h3>
                                                    <p className={`text-2xl text-[#BA9D76] font-semibold ${archivo.className}`}>
                                                        {pkg.packagePrice}
                                                    </p>
                                                    {pkg.packageDescription && (
                                                        <p className={`text-sm text-gray-600 mt-4 font-light leading-relaxed ${archivo.className}`}>
                                                            {pkg.packageDescription}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className={`p-4 rounded-full bg-[#BA9D76]/10 transition-transform duration-500 ${isExpanded ? "rotate-180" : ""}`}>
                                                    <ChevronDown className="h-6 w-6 text-[#BA9D76]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="bg-white"
                                            >
                                                <div className="p-8 space-y-12">
                                                    {pkg.categories.map((category, catIdx) => (
                                                        <div key={catIdx}>
                                                            <h4 className={`text-xl font-semibold mb-6 pb-2 border-b-2 border-[#BA9D76]/20 text-[#597FB1] ${archivo.className}`}>
                                                                {category.categoryName}
                                                            </h4>
                                                            <div className="grid gap-4 sm:grid-cols-2">
                                                                {category.items.map((item, itemIdx) => (
                                                                    <div key={itemIdx} className="flex flex-col p-4 rounded-xl bg-gray-50/80 border border-transparent hover:border-[#BA9D76]/30 transition-colors">
                                                                        <h5 className={`font-semibold text-gray-900 ${archivo.className}`}>{item.name}</h5>
                                                                        {item.description && (
                                                                            <p className={`text-sm text-gray-600 mt-1 font-light ${archivo.className}`}>{item.description}</p>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )
                        })}

                        {/* Additional Info Categories (Napoje, Uwagi) */}
                        <div className="mt-16 space-y-12">
                            {specialOccasionsData.categories.map((category, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                                    <h4 className={`text-2xl font-semibold mb-8 text-[#597FB1] ${archivo.className}`}>
                                        {category.categoryName}
                                    </h4>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {category.items.map((item, itIdx) => (
                                            <div key={itIdx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                                <div className="flex justify-between items-start gap-4 mb-2">
                                                    <h5 className={`font-semibold text-gray-900 ${archivo.className}`}>{item.name}</h5>
                                                    {item.price && (
                                                        <Badge variant="outline" className="text-[#BA9D76] border-[#BA9D76]/30 whitespace-nowrap">
                                                            {item.price}
                                                        </Badge>
                                                    )}
                                                </div>
                                                {item.description && (
                                                    <p className={`text-sm text-gray-600 font-light leading-relaxed ${archivo.className}`}>
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-20 p-12 rounded-[2rem] bg-gradient-to-br from-[#597FB1] to-[#326096] text-white text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#BA9D76]/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                        <div className="relative z-10">
                            <h3 className={`text-3xl font-semibold mb-4 ${archivo.className}`}>Gotowi na organizację?</h3>
                            <p className={`text-lg mb-8 text-white/80 font-light max-w-2xl mx-auto ${archivo.className}`}>
                                Jeśli masz pytania lub chcesz dokonać rezerwacji dla większej grupy, nasz zespół chętnie pomoże Ci w każdym szczególe.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link href="/#contact">
                                    <Button size="lg" className="bg-[#BA9D76] hover:bg-[#BA9D76]/90 text-white border-none px-8 py-6 h-auto text-lg rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95">
                                        Skontaktuj się z nami
                                    </Button>
                                </Link>
                                <Link href="tel:+48574933988">
                                    <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 px-8 py-6 h-auto text-lg rounded-full bg-transparent">
                                        <Phone className="h-5 w-5 mr-3" />
                                        Zadzwoń teraz
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer link back to top */}
            <footer className="py-8 bg-gray-50 border-t border-gray-100 flex justify-center">
                <Link
                    href="/"
                    className={`text-[#597FB1] hover:text-[#BA9D76] transition-colors flex items-center gap-2 font-light ${archivo.className}`}
                >
                    <Utensils className="h-4 w-4" />
                    <span>Powrót do strony głównej</span>
                </Link>
            </footer>
        </div>
    )
}
