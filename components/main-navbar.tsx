"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, ShoppingBag, Phone, CalendarDays, MessageCircle, Megaphone } from "lucide-react"
import { Archivo } from "next/font/google"
import { HeaderHoursWidget } from "@/components/header-hours-widget"

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["200", "400", "600", "700"],
    display: "swap",
})

export function MainNavbar() {
    const pathname = usePathname()
    const isHomePage = pathname === "/"

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
                ? "-translate-y-1 bg-white/20 shadow-lg text-[#BA9D76]"
                : "hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76]"
            } group`
    }

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-[#597FB1]/80 border-b border-white/10">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex-1 flex justify-start"></div>
                <nav className="flex-1 flex items-center justify-center gap-2 md:gap-6 backdrop-blur-md bg-white/15 border border-white/25 rounded-full px-2 md:px-6 py-3 shadow-lg">
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
                        <Home className="h-4 w-4 transition-colors duration-300" />
                        <span className={`text-xs font-light ${archivo.className}`}>Strona Główna</span>
                    </Link>
                    <Link href="/menu" className={navLinkClass("/menu")}>
                        <BookOpen className="h-4 w-4 transition-colors duration-300" />
                        <span className={`text-xs font-light ${archivo.className}`}>Menu</span>
                    </Link>
                    <Link href="/order" className={navLinkClass("/order")}>
                        <ShoppingBag className="h-4 w-4 transition-colors duration-300" />
                        <span className={`text-xs font-light ${archivo.className}`}>Zamów Online</span>
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
                        <Phone className="h-4 w-4 transition-colors duration-300" />
                        <span className={`text-xs font-light ${archivo.className}`}>Kontakt</span>
                    </Link>
                </nav>
                <div className="flex-1 flex justify-end"></div>
            </div>

            {/* Secondary Navigation */}
            <div className="container mx-auto px-4 pb-2 flex justify-center">
                <nav className="flex items-center justify-center gap-2 md:gap-6 backdrop-blur-md bg-white/15 border border-white/25 rounded-full px-2 md:px-6 py-3 shadow-lg">
                    <Link href="/special-events" className={navLinkClass("/special-events")}>
                        <CalendarDays className="h-4 w-4 transition-colors duration-300" />
                        <span className={`text-xs font-light ${archivo.className}`}>Eventy Specjalne</span>
                    </Link>
                    <Link href="/faq" className={navLinkClass("/faq")}>
                        <MessageCircle className="h-4 w-4 transition-colors duration-300" />
                        <span className={`text-xs font-light ${archivo.className}`}>FAQ</span>
                    </Link>
                    <Link href="/newsletter" className={navLinkClass("/newsletter")}>
                        <Megaphone className="h-4 w-4 transition-colors duration-300" />
                        <span className={`text-xs font-light ${archivo.className}`}>Oferty</span>
                    </Link>
                </nav>
            </div>

            {/* Hours Widget */}
            <div className="container mx-auto px-4 pb-2 flex justify-center">
                <HeaderHoursWidget />
            </div>
        </header>
    )
}
