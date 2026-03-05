"use client"
import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, BookOpen, MessageCircle, Coffee, Utensils, Wine, X, Share2, ChevronUp, ChevronDown, Filter, Calendar, Megaphone, ShoppingCart, ShoppingBag, Plus, Check, Phone } from "lucide-react"
import { Archivo } from "next/font/google"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { menuData, allergenMap } from "./menu-data"
import { useCart, parsePrice } from "@/context/cart-context"
import { CartDrawer } from "@/components/cart-drawer"

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["200", "400", "600", "700"],
  display: "swap",
})

// Icon mapping for menu sections
const IconMap = {
  sniadania: Coffee,
  "mezze-talerzyki": Utensils,
  "mezze-talerze": Utensils,
  grill: Utensils,
  salatki: Utensils,
  desery: Utensils,
  dodatki: Utensils,
  napoje: Wine,
  alkohole: Wine,
  "specjalne-okazje": Calendar,
}

export default function MenuPage() {
  const { addItem, totalItems, totalPrice } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [justAdded, setJustAdded] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleAddToCart = (item: { id: string; name: string; price: string; image?: string }) => {
    const numericPrice = parsePrice(item.price)
    if (numericPrice === 0) return // skip items with no price (e.g. package notes)
    addItem({ id: item.id, name: item.name, price: numericPrice, image: item.image })
    setJustAdded(item.id)
    setTimeout(() => setJustAdded(null), 1200)
  }

  const [activeSection, setActiveSection] = useState("sniadania")
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

    const handleBeforeUnload = () => {
      if (selectedImage) {
        // Push state when modal is open to handle back button
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
        await navigator.clipboard.writeText(`${shareData.title}
${shareData.text}
${shareData.url}`)
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
              className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 -translate-y-1 bg-white/20 shadow-lg text-[#BA9D76] group"
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
            <h1 className={`text-4xl md:text-5xl font-semibold mb-6 text-gray-900 ${archivo.className}`}>Nasze Menu</h1>
            <p className={`text-xl text-gray-700 font-light ${archivo.className}`}>
              Odkryj autentyczne smaki Bliskiego Wschodu w każdym daniu
            </p>
          </div>
        </div>
      </section>

      {/* Menu Navigation */}
      <section className="py-8 bg-gray-50" data-menu-navigation>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {menuData.map((section) => {
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
          {menuData.map((section, sectionIndex) => (
            <section key={section.id} id={section.id} className={`mb-20 ${sectionIndex > 0 ? "pt-16" : ""}`}>
              <div className="text-center mb-12">
                <h2 className={`text-3xl md:text-4xl font-semibold mb-4 text-gray-900 ${archivo.className}`}>
                  {section.sectionTitle}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-[#BA9D76] to-[#597FB1] mx-auto rounded-full"></div>
              </div>

              {/* Render packages if this is a package section */}
              {section.isPackageSection && section.packages ? (
                <>
                  {section.packages.map((pkg) => {
                    const isExpanded = expandedPackages[pkg.packageId]
                    return (
                      <div key={pkg.packageId} className="mb-12">
                        {/* Package Header - Clickable */}
                        <div
                          onClick={() => togglePackage(pkg.packageId)}
                          className="group cursor-pointer bg-gradient-to-r from-[#BA9D76]/10 to-[#597FB1]/10 border-2 border-[#BA9D76]/30 rounded-2xl p-0 overflow-hidden mb-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
                        >
                          <div className="flex flex-col md:flex-row items-stretch">
                            {pkg.packageImage && (
                              <div className="relative w-full md:w-80 h-64 md:h-auto overflow-hidden">
                                <Image
                                  src={pkg.packageImage}
                                  alt={pkg.packageName}
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                                  sizes="(max-width: 768px) 100vw, 320px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/20 to-transparent"></div>
                              </div>
                            )}
                            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h3 className={`text-2xl md:text-3xl font-semibold text-gray-900 mb-2 ${archivo.className}`}>
                                    {pkg.packageName}
                                  </h3>
                                  <p className={`text-xl md:text-2xl text-[#BA9D76] font-semibold ${archivo.className}`}>
                                    {pkg.packagePrice}
                                  </p>
                                  {pkg.packageDescription && (
                                    <p className={`text-sm text-gray-600 mt-3 font-light leading-relaxed ${archivo.className}`}>
                                      {pkg.packageDescription}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 ml-4">
                                  <div className="hidden sm:flex flex-col items-end">
                                    <span className={`text-xs text-gray-500 uppercase tracking-wider font-semibold ${archivo.className}`}>
                                      {isExpanded ? "Ukryj menu" : "Zobacz menu"}
                                    </span>
                                  </div>
                                  <div className={`p-3 rounded-full bg-[#BA9D76]/20 transition-all duration-300 group-hover:bg-[#BA9D76]/30 ${isExpanded ? "rotate-180" : ""}`}>
                                    <ChevronDown className="h-6 w-6 text-[#BA9D76]" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Package Content - Collapsible */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 border-l-4 border-[#BA9D76]/30">
                                {pkg.categories.map((category, categoryIndex) => (
                                  <div key={categoryIndex} className="mb-12">
                                    <h4 className={`text-xl font-semibold mb-6 text-gray-800 ${archivo.className}`}>
                                      {category.categoryName}
                                    </h4>

                                    <div className="grid gap-4 md:gap-6">
                                      {category.items.map((item, itemIndex) => {
                                        const isSafe = isDishSafe(item.allergens)

                                        return (
                                          <div
                                            key={itemIndex}
                                            className={`group relative flex flex-col md:flex-row gap-4 p-4 rounded-xl border transition-all duration-500
                                            ${isSafe
                                                ? "bg-white border-gray-200 hover:border-[#BA9D76]/40 hover:shadow-md"
                                                : "bg-gray-50 border-gray-100 opacity-40 grayscale-[0.8] scale-[0.98]"}`}
                                          >
                                            {/* Content Section */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                              <div>
                                                <div className="flex items-start justify-between mb-2">
                                                  <div className="flex-1 pr-4">
                                                    <h5 className={`text-lg font-semibold text-gray-900 ${archivo.className}`}>
                                                      {item.name}
                                                    </h5>
                                                  </div>
                                                  {item.price && (
                                                    <span className={`text-gray-600 text-sm font-light ${archivo.className} whitespace-nowrap`}>
                                                      {item.price}
                                                    </span>
                                                  )}
                                                </div>

                                                {item.description && (
                                                  <p className={`text-gray-600 text-sm leading-relaxed mb-2 font-light ${archivo.className}`}>
                                                    {item.description}
                                                  </p>
                                                )}

                                                {/* Allergen Information */}
                                                {item.allergens && item.allergens.length > 0 && (
                                                  <div className="mb-2">
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
                                              </div>
                                            </div>

                                            {/* Warning Overlay */}
                                            {!isSafe && activeAllergens.length > 0 && (
                                              <div className="absolute top-2 right-2 bg-red-500/90 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg backdrop-blur-sm animate-pulse z-20">
                                                Zawiera: {item.allergens?.filter(a => activeAllergens.includes(a)).map(a => allergenMap[a]).join(", ")}
                                              </div>
                                            )}
                                          </div>
                                        )
                                      })}
                                    </div>

                                    {category.notes && (
                                      <p className={`text-center text-gray-500 text-sm mt-4 italic font-light ${archivo.className}`}>
                                        {category.notes}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </>
              ) : null}

              {/* Render regular categories */}
              {section.categories.map((category, categoryIndex) => {
                if (section.isPackageSection) {
                  const categoryId = `${section.id}-cat-${categoryIndex}`
                  const isExpanded = expandedPackages[categoryId]

                  return (
                    <div key={categoryIndex} className="mb-12">
                      {/* Category Header - Collapsible */}
                      <div
                        onClick={() => togglePackage(categoryId)}
                        className="cursor-pointer bg-gradient-to-r from-[#BA9D76]/10 to-[#597FB1]/10 border-2 border-[#BA9D76]/30 rounded-2xl p-6 mb-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className={`text-2xl md:text-3xl font-semibold text-gray-900 mb-2 ${archivo.className}`}>
                              {category.categoryName}
                            </h3>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-sm text-gray-600 font-light ${archivo.className}`}>
                              {isExpanded ? "Zwiń" : "Rozwiń"}
                            </span>
                            <div className={`p-2 rounded-full bg-[#BA9D76]/20 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                              <ChevronDown className="h-6 w-6 text-[#BA9D76]" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Category Content - Collapsible */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 border-l-4 border-[#BA9D76]/30">
                              <div className="grid gap-4 md:gap-6">
                                {category.items.map((item, itemIndex) => {
                                  const isSafe = isDishSafe(item.allergens)

                                  return (
                                    <div
                                      key={itemIndex}
                                      className={`group relative flex flex-col md:flex-row gap-4 p-4 rounded-xl border transition-all duration-500
                                      ${isSafe
                                          ? "bg-white border-gray-200 hover:border-[#BA9D76]/40 hover:shadow-md"
                                          : "bg-gray-50 border-gray-100 opacity-40 grayscale-[0.8] scale-[0.98]"}`}
                                    >
                                      {/* Content Section */}
                                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                          <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1 pr-4">
                                              <h5 className={`text-lg font-semibold text-gray-900 ${archivo.className}`}>
                                                {item.name}
                                              </h5>
                                            </div>
                                            {item.price && (
                                              <span className={`text-gray-600 text-sm font-light ${archivo.className} whitespace-nowrap`}>
                                                {item.price}
                                              </span>
                                            )}
                                          </div>

                                          {item.description && (
                                            <p className={`text-gray-600 text-sm leading-relaxed mb-2 font-light ${archivo.className}`}>
                                              {item.description}
                                            </p>
                                          )}

                                          {/* Allergen Information */}
                                          {item.allergens && item.allergens.length > 0 && (
                                            <div className="mb-2">
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
                                        </div>
                                      </div>

                                      {/* Warning Overlay */}
                                      {!isSafe && activeAllergens.length > 0 && (
                                        <div className="absolute top-2 right-2 bg-red-500/90 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg backdrop-blur-sm animate-pulse z-20">
                                          Zawiera: {item.allergens?.filter(a => activeAllergens.includes(a)).map(a => allergenMap[a]).join(", ")}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>

                              {category.notes && (
                                <p className={`text-center text-gray-500 text-sm mt-4 italic font-light ${archivo.className}`}>
                                  {category.notes}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }

                return (
                  <div key={categoryIndex} className="mb-16">
                    <h3 className={`text-2xl font-semibold mb-8 text-center text-gray-800 ${archivo.className}`}>
                      {category.categoryName}
                    </h3>

                    <div className="grid gap-6 md:gap-8">
                      {category.items.map((item, itemIndex) => {
                        const isSafe = isDishSafe(item.allergens)

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
                              {item.price && parsePrice(item.price) > 0 && section.id !== "specjalne-okazje" && (
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
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-[#BA9D76]/10 text-[#BA9D76] border border-[#BA9D76]/20">
                  1
                </Badge>
                <span className={`font-light ${archivo.className}`}>Gluten</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-[#BA9D76]/10 text-[#BA9D76] border border-[#BA9D76]/20">
                  2
                </Badge>
                <span className={`font-light ${archivo.className}`}>Skorupiaki</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-[#BA9D76]/10 text-[#BA9D76] border border-[#BA9D76]/20">
                  3
                </Badge>
                <span className={`font-light ${archivo.className}`}>Jaja</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-[#BA9D76]/10 text-[#BA9D76] border border-[#BA9D76]/20">
                  4
                </Badge>
                <span className={`font-light ${archivo.className}`}>Ryby</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-[#BA9D76]/10 text-[#BA9D76] border border-[#BA9D76]/20">
                  5
                </Badge>
                <span className={`font-light ${archivo.className}`}>Orzeszki ziemne</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-[#BA9D76]/10 text-[#BA9D76] border border-[#BA9D76]/20">
                  6
                </Badge>
                <span className={`font-light ${archivo.className}`}>Soja</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-[#BA9D76]/10 text-[#BA9D76] border border-[#BA9D76]/20">
                  7
                </Badge>
                <span className={`font-light ${archivo.className}`}>Mleko</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-[#BA9D76]/10 text-[#BA9D76] border border-[#BA9D76]/20">
                  8
                </Badge>
                <span className={`font-light ${archivo.className}`}>Orzechy</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-[#BA9D76]/10 text-[#BA9D76] border border-[#BA9D76]/20">
                  9
                </Badge>
                <span className={`font-light ${archivo.className}`}>Seler</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-[#BA9D76]/10 text-[#BA9D76] border border-[#BA9D76]/20">
                  10
                </Badge>
                <span className={`font-light ${archivo.className}`}>Gorczyca</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-[#BA9D76]/10 text-[#BA9D76] border border-[#BA9D76]/20">
                  11
                </Badge>
                <span className={`font-light ${archivo.className}`}>Sezam</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-[#BA9D76]/10 text-[#BA9D76] border border-[#BA9D76]/20">
                  12
                </Badge>
                <span className={`font-light ${archivo.className}`}>Dwutlenek siarki</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-[#BA9D76]/10 text-[#BA9D76] border border-[#BA9D76]/20">
                  13
                </Badge>
                <span className={`font-light ${archivo.className}`}>Łubin</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-[#BA9D76]/10 text-[#BA9D76] border border-[#BA9D76]/20">
                  14
                </Badge>
                <span className={`font-light ${archivo.className}`}>Mięczaki</span>
              </div>
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

      {/* Floating Back to Menu Button — desktop only OR left side on mobile */}
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

      {/* ─── Mobile Floating Cart Bar ─────────────────────────── */}
      {/* Only shows on mobile (md:hidden) when there are items in the cart */}
      {mounted && (totalItems ?? 0) > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-gradient-to-t from-black/80 to-transparent flex justify-center">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full max-w-2xl flex items-center justify-between bg-[#BA9D76] hover:bg-[#a88a63] active:scale-95 text-white rounded-2xl px-5 py-4 shadow-2xl transition-all duration-200"
          >
            {/* Left: count badge */}
            <div className="flex items-center gap-3">
              <span className="bg-white/20 text-white text-sm font-bold w-8 h-8 rounded-xl flex items-center justify-center">
                {totalItems ?? 0}
              </span>
              <span className={`text-sm font-semibold ${archivo.className}`}>
                Wyświetl koszyk
              </span>
            </div>
            {/* Right: total */}
            <span className={`text-lg font-bold ${archivo.className}`}>
              {Number(totalPrice ?? 0).toFixed(0)} zł
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
