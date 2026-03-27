"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, BookOpen, ShoppingBag, Phone, CalendarDays, MessageCircle, Megaphone } from "lucide-react"
import { Archivo } from "next/font/google"
import { HeaderHoursWidget } from "@/components/header-hours-widget"
import { useCart } from "@/context/cart-context"

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["200", "400", "600", "700"],
    display: "swap",
})

export function MainNavbar() {
    const pathname = usePathname()
    const { totalItems, setCartOpen } = useCart()
    const isHomePage = pathname === "/"
    
    // Scroll tracking for hide/show behavior
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                const currentScrollY = window.scrollY
                
                // Show if scrolling up OR at the very top
                if (currentScrollY < lastScrollY || currentScrollY < 100) {
                    setIsVisible(true)
                } 
                // Hide if scrolling down AND below a threshold
                else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    setIsVisible(false)
                }
                
                setLastScrollY(currentScrollY)
            }
        }

        window.addEventListener('scroll', controlNavbar)
        return () => window.removeEventListener('scroll', controlNavbar)
    }, [lastScrollY])

    const scrollToSection = (sectionId: string) => {
        if (isHomePage) {
            const element = document.getElementById(sectionId)
            if (element) {
                const headerOffset = 150
                const elementPosition = element.getBoundingClientRect().top
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                })
            }
        }
    }

    const navLinkClass = (href: string) => {
        const isActive = pathname === href
        return `flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${isActive
                ? "bg-white/20 shadow-lg text-[#BA9D76]"
                : "hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76]"
            } group`
    }

    return (
        <motion.header 
            className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#597FB1]/80 border-b border-white/10"
            initial={{ y: 0 }}
            animate={{ y: isVisible ? 0 : -250 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <div className="container mx-auto px-4 py-2 flex items-center justify-between">
                <div className="flex-1 flex justify-start"></div>
                <nav className="flex-1 flex items-center justify-center gap-1 md:gap-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-1 md:px-6 py-1.5 md:py-2.5 shadow-lg">
                    <Link
                        href={isHomePage ? "#home" : "/"}
                        className={navLinkClass("/")}
                        onClick={(e) => {
                            if (isHomePage) {
                                e.preventDefault()
                                scrollToSection("home")
                            }
                        }}
                    >
                        <Home className="h-3.5 w-3.5 transition-colors duration-300" />
                        <span className={`text-[10px] md:text-xs font-light ${archivo.className}`}>Home</span>
                    </Link>
                    <Link href="/menu" className={navLinkClass("/menu")}>
                        <BookOpen className="h-3.5 w-3.5 transition-colors duration-300" />
                        <span className={`text-[10px] md:text-xs font-light ${archivo.className}`}>Menu</span>
                    </Link>
                    <Link href="/order" className={navLinkClass("/order")}>
                        <ShoppingBag className="h-3.5 w-3.5 transition-colors duration-300" />
                        <span className={`text-[10px] md:text-xs font-light ${archivo.className}`}>Zamów</span>
                    </Link>
                    <Link
                        href={isHomePage ? "#visit-us" : "/#contact"}
                        className={navLinkClass("/#contact")}
                        onClick={(e) => {
                            if (isHomePage) {
                                e.preventDefault()
                                scrollToSection("visit-us")
                            }
                        }}
                    >
                        <Phone className="h-3.5 w-3.5 transition-colors duration-300" />
                        <span className={`text-[10px] md:text-xs font-light ${archivo.className}`}>Kontakt</span>
                    </Link>
                </nav>
                <div className="flex-1 flex justify-end">
                    <button
                        onClick={() => setCartOpen(true)}
                        className="relative p-2 rounded-full bg-white/10 hover:bg-[#BA9D76]/20 transition-all duration-300 group"
                        aria-label="Otwórz koszyk"
                    >
                        <ShoppingBag className="h-5 w-5 text-white transition-colors group-hover:text-[#BA9D76]" />
                        <AnimatePresence>
                            {totalItems > 0 && (
                                <motion.span
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    key="cart-badge"
                                    className="absolute -top-1 -right-1 bg-[#BA9D76] text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 shadow-lg border border-white/20"
                                >
                                    {totalItems}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            {/* Secondary Navigation & Hours - Combined on mobile to save space */}
            <div className="container mx-auto px-4 pb-1.5 flex flex-col md:flex-row items-center justify-center gap-2">
                <nav className="flex items-center justify-center gap-1 md:gap-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-1 md:px-4 py-1 shadow-lg scale-90">
                    <Link href="/special-events" className={navLinkClass("/special-events")}>
                        <CalendarDays className="h-3.5 w-3.5 transition-colors duration-300" />
                        <span className={`text-[10px] md:text-xs font-light ${archivo.className}`}>Eventy</span>
                    </Link>
                    <Link href="/faq" className={navLinkClass("/faq")}>
                        <MessageCircle className="h-3.5 w-3.5 transition-colors duration-300" />
                        <span className={`text-[10px] md:text-xs font-light ${archivo.className}`}>FAQ</span>
                    </Link>
                    <Link href="/newsletter" className={navLinkClass("/newsletter")}>
                        <Megaphone className="h-3.5 w-3.5 transition-colors duration-300" />
                        <span className={`text-[10px] md:text-xs font-light ${archivo.className}`}>Oferty</span>
                    </Link>
                </nav>
                
                <div className="scale-90 md:scale-95 origin-center">
                    <HeaderHoursWidget />
                </div>
            </div>
        </motion.header>
    )
}
