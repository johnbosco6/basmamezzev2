'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, LayoutDashboard, LogOut, History, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'
import { Archivo } from 'next/font/google'
import { Button } from '@/components/ui/button'
import { logoutAdmin } from '@/app/actions/auth-actions'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    display: "swap",
})

export function AdminSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const [selectedDate, setSelectedDate] = useState(searchParams.get('date') || new Date().toISOString().split('T')[0])

    useEffect(() => {
        const dateFromUrl = searchParams.get('date')
        if (dateFromUrl && dateFromUrl !== selectedDate) {
            setSelectedDate(dateFromUrl)
        }
    }, [searchParams])

    const handleDateSelect = (iso: string) => {
        setSelectedDate(iso)
        router.push(`/admin/history?date=${iso}`)
    }

    // Close mobile sidebar on navigation
    useEffect(() => {
        setIsMobileOpen(false)
    }, [pathname])

    const quickDates = [
        { label: 'Dzisiaj', date: new Date() },
        { label: 'Wczoraj', date: new Date(Date.now() - 86400000) },
    ]

    return (
        <>
            {/* Mobile Hamburger Toggle */}
            <div className="lg:hidden fixed top-5 left-4 z-[70]">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="bg-[#BA9D76] text-white rounded-xl shadow-2xl hover:bg-[#BA9D76]/90 h-10 w-10 flex items-center justify-center border border-white/20"
                >
                    {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                </Button>
            </div>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-[60] transition-all duration-300"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside className={`
                fixed lg:sticky top-0 h-screen transition-all duration-300 backdrop-blur-2xl bg-black/95 lg:bg-black/40 border-r border-white/10 flex flex-col z-[65]
                ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
                ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0 w-72'}
                ${archivo.className}
            `}>
                {/* Header / Logo */}
                <div className="p-6 flex items-center justify-between lg:justify-start gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10 flex-shrink-0">
                            <Image src="/images/basma-blue-logo.png" alt="Basma" fill className="object-contain" />
                        </div>
                        {(!isCollapsed || isMobileOpen) && (
                            <span className="font-bold text-lg text-white truncate">Panel Basma</span>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-8 space-y-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-2">
                        <h3 className={`text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 ${(isCollapsed && !isMobileOpen) ? 'text-center' : 'pl-3'}`}>
                            {(isCollapsed && !isMobileOpen) ? 'Main' : 'Główne'}
                        </h3>
                        <Link href="/admin">
                            <div className={`flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-white/10 text-white group border border-transparent ${pathname === '/admin' ? 'bg-white/10 border-white/10 shadow-lg' : 'text-white/70'}`}>
                                <LayoutDashboard className="w-5 h-5 text-[#BA9D76]" />
                                {(!isCollapsed || isMobileOpen) && <span className="font-medium">Dashboard</span>}
                            </div>
                        </Link>
                        <Link href="/admin/history">
                            <div className={`flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-white/10 text-white group border border-transparent ${pathname === '/admin/history' ? 'bg-white/10 border-white/10 shadow-lg' : 'text-white/70'}`}>
                                <History className="w-5 h-5" />
                                {(!isCollapsed || isMobileOpen) && <span className="font-medium">Historia zamówień</span>}
                            </div>
                        </Link>
                    </div>

                    {/* Date Filter Section */}
                    {(!isCollapsed || isMobileOpen) && (
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] pl-3">
                                Filtrowanie Datą
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                {quickDates.map((d, i) => {
                                    const iso = d.date.toISOString().split('T')[0]
                                    const active = selectedDate === iso
                                    return (
                                        <Button
                                            key={i}
                                            variant="secondary"
                                            size="sm"
                                            className={`justify-start gap-3 rounded-xl h-10 transition-all ${active ? 'bg-[#BA9D76] text-white shadow-lg' : 'bg-white/5 text-white/60 border border-white/5 hover:bg-white/10'}`}
                                            onClick={() => handleDateSelect(iso)}
                                        >
                                            <Calendar className="w-4 h-4" />
                                            {d.label}
                                        </Button>
                                    )
                                })}
                            </div>

                            <div className="relative group pt-2">
                                <input
                                    type="date"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#BA9D76]/50"
                                    value={selectedDate}
                                    onChange={(e) => handleDateSelect(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </nav>

                {/* Footer / Logout */}
                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={async () => {
                            await logoutAdmin()
                        }}
                        className="w-full flex items-center justify-start gap-4 p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-900/10 transition-all group"
                    >
                        <LogOut className="w-5 h-5" />
                        {(!isCollapsed || isMobileOpen) && <span className="font-medium">Wyloguj</span>}
                    </button>
                </div>

                {/* Collapse Toggle (Desktop Only) */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 bg-[#BA9D76] text-white rounded-full w-6 h-6 border-2 border-[#1a2c44] hover:bg-[#BA9D76]/80"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </Button>

                <style jsx global>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(186, 157, 118, 0.2);
                        border-radius: 10px;
                    }
                `}</style>
            </aside>
        </>
    )
}
