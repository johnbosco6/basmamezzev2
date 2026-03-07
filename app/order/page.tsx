"use client"
import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Coffee, Utensils, Wine, X, Share2, ChevronUp, ChevronDown, Filter, Calendar, Megaphone, ShoppingCart, ShoppingBag, Plus, Check, Phone } from "lucide-react"
import { Archivo } from "next/font/google"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { menuData, allergenMap } from "../menu/menu-data"
import { useCart, parsePrice } from "@/context/cart-context"
import { CartDrawer } from "@/components/cart-drawer"
import { MainNavbar } from "@/components/main-navbar"

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["200", "400", "600", "700"],
    display: "swap",
})

// Icon mapping for menu sections
const IconMap = {
    sniadania: Coffee,
    wrapy: Utensils,
    "mezze-talerzyki": Utensils,
    "mezze-talerze": Utensils,
    grill: Utensils,
    salatki: Utensils,
    desery: Utensils,
    dodatki: Utensils,
    napoje: Wine,
    alkohole: Wine,
}

export default function OrderPage() {
    const { addItem, totalItems, totalPrice } = useCart()
    const [cartOpen, setCartOpen] = useState(false)
    const [justAdded, setJustAdded] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false)

    // Filter menu sections for online ordering
    const filteredMenuData = useMemo(() => {
        return menuData.filter(section =>
            !["sniadania", "napoje", "alkohole", "specjalne-okazje"].includes(section.id)
        )
    }, [])

    const [activeSection, setActiveSection] = useState(filteredMenuData[0]?.id || "")

    useEffect(() => { setMounted(true) }, [])

    const handleAddToCart = (item: { id: string; name: string; price: string; image?: string }) => {
        const numericPrice = parsePrice(item.price)
        if (numericPrice === 0) return // skip items with no price (e.g. package notes)
        addItem({ id: item.id, name: item.name, price: numericPrice, image: item.image })
        setJustAdded(item.id)
        setTimeout(() => setJustAdded(null), 1200)
    }
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null)
    const [activeAllergens, setActiveAllergens] = useState<number[]>([])
    const [expandedPackages, setExpandedPackages] = useState<Record<string, boolean>>({})

    // Toggle package expansion
    const togglePackage = (packageId: string) => {
        setExpandedPackages(prev => ({
            ...prev,
            [packageId]: !prev[packageId]
        }))
    }

    // Filter Logic
    const toggleAllergen = (id: number) => {
        setActiveAllergens(prev =>
            prev.includes(id)
                ? prev.filter(a => a !== id)
                : [...prev, id]
        )
    }

    const isDishSafe = (allergens: number[] | undefined) => {
        if (activeAllergens.length === 0) return true
        if (!allergens) return true
        // Dish is unsafe if it contains ANY of the selected active allergens
        return !allergens.some(allergen => activeAllergens.includes(allergen))
    }
    const [showBackToMenu, setShowBackToMenu] = useState(false)

    // Handle browser back button for modal
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            if (selectedImage) {
                event.preventDefault()
                setSelectedImage(null)
                // Push the current state back to prevent navigation
                window.history.pushState(null, "", window.location.href)
            }
        }

        if (selectedImage) {
            // Add a history entry when modal opens
            window.history.pushState(null, "", window.location.href)
            window.addEventListener("popstate", handlePopState)
        }

        return () => {
            window.removeEventListener("popstate", handlePopState)
        }
    }, [selectedImage])

    // Add scroll detection for back to menu button
    useEffect(() => {
        const handleScroll = () => {
            const menuNavigation = document.querySelector("[data-menu-navigation]")
            if (menuNavigation) {
                const rect = menuNavigation.getBoundingClientRect()
                // Show button when menu navigation is out of view (above viewport)
                setShowBackToMenu(rect.bottom < 0)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollToSection = (sectionId: string) => {
        setActiveSection(sectionId)
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
        }
    }

    const scrollToAllergenLegend = () => {
        const element = document.getElementById("allergen-legend")
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" })
            // Add a brief highlight effect
            element.classList.add("ring-2", "ring-[#BA9D76]", "ring-opacity-50")
            setTimeout(() => {
                element.classList.remove("ring-2", "ring-[#BA9D76]", "ring-opacity-50")
            }, 2000)
        }
    }

    const openImageModal = (imageSrc: string, altText: string) => {
        setSelectedImage({ src: imageSrc, alt: altText })
    }

    const closeImageModal = () => {
        setSelectedImage(null)
        // Remove the extra history entry we added
        if (window.history.length > 1) {
            window.history.back()
        }
    }

    const shareMenuItem = async (itemName: string, itemDescription?: string) => {
        const shareData = {
            title: `${itemName} - Basma Mezze & Grill`,
            text: itemDescription || `Sprawdź ${itemName} w restauracji Basma Mezze & Grill`,
            url: window.location.href,
        }

        try {
            if (navigator.share) {
                await navigator.share(shareData)
            } else {
                // Fallback for browsers that don't support Web Share API
                await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
                alert("Link skopiowany do schowka!")
            }
        } catch (error) {
            console.error("Error sharing:", error)
        }
    }

    const scrollToMenuNavigation = () => {
        const menuNavigation = document.querySelector("[data-menu-navigation]")
        if (menuNavigation) {
            menuNavigation.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Cart Drawer */}
            <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

            <MainNavbar />

            {/* Sticky Filter Bar */}
            <div className="sticky top-0 z-40 bg-[#2B2B2B]/95 backdrop-blur-md border-b border-white/10 py-4 shadow-xl">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Filter className="h-4 w-4 text-[#BA9D76]" />
                        <span className={`text-sm font-medium text-[#BA9D76] ${archivo.className}`}>Filtruj alergeny (kliknij aby wykluczyć):</span>
                        {activeAllergens.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setActiveAllergens([])}
                                className="h-6 px-2 text-xs text-white/60 hover:text-white"
                            >
                                Wyczyść <X className="ml-1 h-3 w-3" />
                            </Button>
                        )}
                    </div>
                    <ScrollArea className="w-full whitespace-nowrap">
                        <div className="flex space-x-2 pb-2">
                            {Object.entries(allergenMap).map(([id, name]) => {
                                const allergenId = parseInt(id)
                                const isActive = activeAllergens.includes(allergenId)
                                return (
                                    <Button
                                        key={id}
                                        variant={isActive ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => toggleAllergen(allergenId)}
                                        className={`
                      rounded-full border transition-all duration-300
                      ${isActive
                                                ? "bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/30"
                                                : "border-white/10 text-white/60 hover:border-[#BA9D76] hover:text-[#BA9D76] bg-white/5"}`}
                                    >
                                        {isActive ? `Bez: ${name}` : name}
                                    </Button>
                                )
                            })}
                        </div>
                        <ScrollBar orientation="horizontal" className="bg-white/5" />
                    </ScrollArea>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative py-16 overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('/images/basma-entrance-hero.jpeg')] bg-cover bg-center opacity-10" />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className={`text-4xl md:text-5xl font-semibold mb-6 text-gray-900 ${archivo.className}`}>Zamów Online</h1>
                        <p className={`text-xl text-gray-700 font-light ${archivo.className}`}>
                            Wybierz swoje ulubione dania i zamów je z dostawą lub odbiorem własnym
                        </p>
                    </div>
                </div>
            </section>

            {/* Menu Navigation */}
            <section className="py-8 bg-gray-50" data-menu-navigation>
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-4">
                        {filteredMenuData.map((section) => {
                            const IconComponent = IconMap[section.id as keyof typeof IconMap] || Utensils
                            return (
                                <Button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    variant={activeSection === section.id ? "default" : "outline"}
                                    className={`
                  flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105
                  ${activeSection === section.id
                                            ? "bg-[#BA9D76] text-white border-[#BA9D76] shadow-lg hover:bg-[#BA9D76]/90"
                                            : "border-[#BA9D76] bg-white text-gray-700 hover:bg-[#BA9D76]/10 hover:text-[#BA9D76] hover:border-[#BA9D76]"}`}
                                >
                                    <IconComponent className="h-4 w-4" />
                                    {section.sectionTitle}
                                </Button>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Menu Sections */}
            <main className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    {filteredMenuData.map((section, sectionIndex) => (
                        <section key={section.id} id={section.id} className={`mb-20 ${sectionIndex > 0 ? "pt-16" : ""}`}>
                            <div className="text-center mb-12">
                                <h2 className={`text-3xl md:text-4xl font-semibold mb-4 text-gray-900 ${archivo.className}`}>
                                    {section.sectionTitle}
                                </h2>
                                <div className="w-24 h-1 bg-gradient-to-r from-[#BA9D76] to-[#597FB1] mx-auto rounded-full"></div>
                            </div>

                            {/* Render regular categories only for ordering */}
                            {section.categories.map((category, categoryIndex) => {
                                return (
                                    <div key={categoryIndex} className="mb-16">
                                        <h3 className={`text-2xl font-semibold mb-8 text-center text-gray-800 ${archivo.className}`}>
                                            {category.categoryName}
                                        </h3>

                                        <div className="grid gap-6 md:gap-8">
                                            {category.items.map((item, itemIndex) => {
                                                const isSafe = isDishSafe(item.allergens)
                                                const canOrder = item.price && parsePrice(item.price) > 0 && !(["specjalne-okazje", "sniadania", "napoje", "alkohole"].includes(section.id))

                                                return (
                                                    <div
                                                        key={itemIndex}
                                                        className={`group relative flex flex-col md:flex-row gap-6 p-6 rounded-2xl border transition-all duration-500
                            ${isSafe
                                                                ? "bg-white border-gray-200 hover:border-[#BA9D76]/40 hover:shadow-lg hover:scale-[1.02]"
                                                                : "bg-gray-50 border-gray-100 opacity-40 grayscale-[0.8] scale-[0.98]"}`}
                                                    >
                                                        {/* Content Section */}
                                                        <div className="flex-1 min-w-0 flex flex-col justify-between order-2 md:order-1">
                                                            <div>
                                                                <div className="flex items-start justify-between mb-2">
                                                                    <div className="flex-1 pr-4">
                                                                        <h4 className={`text-xl font-semibold text-gray-900 ${archivo.className}`}>
                                                                            {item.name}
                                                                        </h4>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                                        {item.price && (
                                                                            <span className={`text-[#BA9D76] text-sm font-semibold ${archivo.className} whitespace-nowrap`}>
                                                                                {item.price}
                                                                            </span>
                                                                        )}
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => shareMenuItem(item.name, item.description)}
                                                                            className="text-gray-500 hover:text-[#BA9D76] hover:bg-gray-100 p-2"
                                                                            title="Udostępnij danie"
                                                                        >
                                                                            <Share2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>

                                                                {item.description && (
                                                                    <p className={`text-gray-600 text-sm leading-relaxed mb-3 font-light ${archivo.className}`}>
                                                                        {item.description}
                                                                    </p>
                                                                )}

                                                                {/* Allergen Information */}
                                                                {item.allergens && item.allergens.length > 0 && (
                                                                    <div className="mb-3">
                                                                        <div className="flex flex-wrap gap-1">
                                                                            <span className={`text-xs text-gray-500 mr-2 ${archivo.className}`}>Alergeny:</span>
                                                                            {item.allergens.map((allergenNum) => {
                                                                                const isConflict = activeAllergens.includes(allergenNum)
                                                                                return (
                                                                                    <Badge
                                                                                        key={allergenNum}
                                                                                        variant="secondary"
                                                                                        className={`
                                              text-xs border cursor-pointer transition-all duration-200 hover:scale-105
                                              ${isConflict
                                                                                                ? "bg-red-100 text-red-600 border-red-200 font-bold"
                                                                                                : "bg-[#BA9D76]/10 text-[#BA9D76] hover:bg-[#BA9D76]/20 border-[#BA9D76]/20"}`}
                                                                                        title={`Kliknij aby zobaczyć wykaz alergenów - ${allergenMap[allergenNum]}`}
                                                                                        onClick={scrollToAllergenLegend}
                                                                                    >
                                                                                        {allergenNum}
                                                                                    </Badge>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {item.subItems && (
                                                                    <ul className="text-gray-600 text-sm space-y-1 mb-3">
                                                                        {item.subItems.map((subItem, subIndex) => (
                                                                            <li key={subIndex} className="flex items-center gap-2">
                                                                                <span className="w-1 h-1 bg-[#BA9D76] rounded-full"></span>
                                                                                <span className={`font-light ${archivo.className}`}>{subItem.name}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </div>

                                                            {/* Add to Cart Button */}
                                                            {canOrder && (
                                                                <button
                                                                    onClick={() => handleAddToCart(item)}
                                                                    disabled={!isSafe}
                                                                    className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border ${justAdded === item.id
                                                                        ? "bg-green-500 border-green-500 text-white scale-95"
                                                                        : isSafe
                                                                            ? "bg-[#BA9D76]/10 hover:bg-[#BA9D76] border-[#BA9D76]/40 hover:border-[#BA9D76] text-[#BA9D76] hover:text-white hover:scale-105"
                                                                            : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                                                                        } ${archivo.className}`}
                                                                >
                                                                    {justAdded === item.id ? (
                                                                        <><Check className="h-4 w-4" /> Dodano!</>
                                                                    ) : (
                                                                        <><Plus className="h-4 w-4" /> Dodaj do koszyka</>
                                                                    )}
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Image Section */}
                                                        {item.image && (
                                                            <div className="flex-shrink-0 order-1 md:order-2">
                                                                <div
                                                                    className="relative w-full md:w-44 h-48 md:h-36 group cursor-pointer rounded-lg overflow-hidden border border-gray-200"
                                                                    onClick={() => openImageModal(item.image!, item.name)}
                                                                >
                                                                    <Image
                                                                        src={item.image || "/placeholder.svg"}
                                                                        alt={item.name}
                                                                        fill
                                                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                                    />
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                                                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
                                                                            <span className={`text-gray-800 text-xs font-medium font-light ${archivo.className}`}>
                                                                                Kliknij
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Warning Overlay */}
                                                        {!isSafe && activeAllergens.length > 0 && (
                                                            <div className="absolute top-4 right-4 bg-red-500/90 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg backdrop-blur-sm animate-pulse z-20">
                                                                Zawiera: {item.allergens?.filter(a => activeAllergens.includes(a)).map(a => allergenMap[a]).join(", ")}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {category.notes && (
                                            <p className={`text-center text-gray-500 text-sm mt-6 italic font-light ${archivo.className}`}>
                                                {category.notes}
                                            </p>
                                        )}
                                    </div>
                                )
                            })}
                        </section>
                    ))}

                    {/* Allergen Legend */}
                    <div
                        id="allergen-legend"
                        className="mt-16 bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-200 transition-all duration-500"
                    >
                        <h3 className={`text-lg font-semibold text-gray-900 mb-4 text-center ${archivo.className}`}>
                            Wykaz Alergenów
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
                            {Object.entries(allergenMap).map(([id, name]) => (
                                <div key={id} className="flex items-center space-x-2">
                                    <Badge variant="secondary" className="bg-[#BA9D76]/10 text-[#BA9D76] border border-[#BA9D76]/20">
                                        {id}
                                    </Badge>
                                    <span className={`font-light ${archivo.className}`}>{name}</span>
                                </div>
                            ))}
                        </div>
                        <p className={`text-center text-xs text-gray-500 mt-4 font-light ${archivo.className}`}>
                            Jeśli masz pytania dotyczące alergenów, skontaktuj się z naszą obsługą
                        </p>
                    </div>
                </div>
            </main>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={closeImageModal}
                >
                    <div className="relative max-w-6xl max-h-[95vh] w-full h-full flex items-center justify-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation()
                                closeImageModal()
                            }}
                            className="absolute top-4 right-4 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 border border-white/20"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                        <div
                            className="relative w-full h-full flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={selectedImage.src || "/placeholder.svg"}
                                alt={selectedImage.alt || "Powiększone zdjęcie dania"}
                                width={1200}
                                height={800}
                                className="object-contain max-w-full max-h-full rounded-lg shadow-2xl"
                                priority
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Back to Menu Button */}
            {showBackToMenu && (
                <Button
                    onClick={scrollToMenuNavigation}
                    className="fixed bottom-6 right-6 md:right-6 z-40 bg-[#BA9D76] hover:bg-[#BA9D76]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full p-4 border-2 border-white/20"
                    style={{ bottom: totalItems > 0 ? '90px' : '24px' }}
                    size="lg"
                >
                    <div className="flex flex-col items-center gap-1">
                        <ChevronUp className="h-5 w-5" />
                        <span className={`text-xs font-light ${archivo.className}`}>Menu</span>
                    </div>
                </Button>
            )}

            {/* Mobile Floating Cart Bar */}
            {mounted && (totalItems ?? 0) > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-gradient-to-t from-black/80 to-transparent flex justify-center">
                    <button
                        onClick={() => setCartOpen(true)}
                        className="w-full max-w-2xl flex items-center justify-between bg-[#BA9D76] hover:bg-[#a88a63] active:scale-95 text-white rounded-2xl px-5 py-4 shadow-2xl transition-all duration-200"
                    >
                        <div className="flex items-center gap-3">
                            <span className="bg-white/20 text-white text-sm font-bold w-8 h-8 rounded-xl flex items-center justify-center">
                                {totalItems ?? 0}
                            </span>
                            <span className={`text-sm font-semibold ${archivo.className}`}>
                                Wyświetl koszyk
                            </span>
                        </div>
                        <span className={`text-lg font-bold ${archivo.className}`}>
                            {Number(totalPrice ?? 0).toFixed(0)} zł
                        </span>
                    </button>
                </div>
            )}
        </div>
    )
}
