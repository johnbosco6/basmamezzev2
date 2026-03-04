import { getOrders } from '@/app/actions/admin-actions'
import { OrderCard } from '@/components/admin/order-card'
import { OrderAnalyticsChart } from '@/components/admin/order-analytics-chart'
import { CsvDownloadButton } from '@/components/admin/csv-download-button'
import { RefreshCw, TrendingUp, Users, ShoppingBag, UtensilsCrossed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Archivo } from 'next/font/google'
import { AdminSidebar } from '@/components/admin/sidebar'
import { ShiftManager } from '@/components/admin/shift-manager'
import Link from 'next/link'

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["200", "400", "600", "700"],
    display: "swap",
})

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
    const orders = await getOrders() || []

    const activeOrders = orders.filter((o: any) =>
        o.status !== 'cancelled' && o.status !== 'delivered' && o.status !== 'picked_up'
    )

    // Completed orders sorted by completedAt (newest first)
    const completedOrders = orders
        .filter((o: any) => o.status === 'delivered' || o.status === 'picked_up')
        .sort((a: any, b: any) =>
            new Date(b.completedAt || b.orderDate).getTime() - new Date(a.completedAt || a.orderDate).getTime()
        )

    // Daily stats
    const totalRevenue = completedOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0)
    const totalDishes = completedOrders.reduce((sum: number, o: any) =>
        sum + (o.items?.reduce((s: number, i: any) => s + (i.quantity || 0), 0) || 0), 0)

    return (
        <div className={`flex min-h-screen bg-gradient-to-br from-[#1a2c44] via-[#2B2B2B] to-[#121212] text-white ${archivo.className}`}>
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="sticky top-0 z-40 backdrop-blur-md bg-black/20 border-b border-white/5 p-4 md:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:h-20">
                    <div className="flex flex-col ml-12 lg:ml-0">
                        <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#BA9D76]">Panel Operacyjny</h1>
                        <p className="text-white/40 text-[9px] md:text-[10px] uppercase tracking-widest font-bold">
                            Na żywo: {new Date().toLocaleDateString('pl-PL')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                        <ShiftManager />
                        <Link href="/admin">
                            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl shadow-xl backdrop-blur-sm whitespace-nowrap">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Odśwież
                            </Button>
                        </Link>
                    </div>
                </header>

                <main className="p-4 md:p-10 space-y-8 md:space-y-12 overflow-y-auto">
                    {/* Stats Cards */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <TrendingUp size={40} className="md:w-12 md:h-12" />
                            </div>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Dziś Sprzedano</p>
                            <h3 className="text-2xl md:text-3xl font-bold text-[#BA9D76]">{totalRevenue.toFixed(2)} zł</h3>
                        </div>
                        <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <ShoppingBag size={40} className="md:w-12 md:h-12" />
                            </div>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Zakończone</p>
                            <h3 className="text-2xl md:text-3xl font-bold">{completedOrders.length}</h3>
                        </div>
                        <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <UtensilsCrossed size={40} className="md:w-12 md:h-12" />
                            </div>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Wydane Potrawy</p>
                            <h3 className="text-2xl md:text-3xl font-bold">{totalDishes}</h3>
                        </div>
                        <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl shadow-2xl relative overflow-hidden group border-l-4 border-l-[#BA9D76]">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <Users size={40} className="md:w-12 md:h-12" />
                            </div>
                            <p className="text-[10px] font-bold text-[#BA9D76] uppercase tracking-widest mb-1">Aktywni Klienci</p>
                            <h3 className="text-2xl md:text-3xl font-bold">{activeOrders.length}</h3>
                        </div>
                    </section>

                    {/* Active Orders */}
                    <section>
                        <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
                            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 shrink-0">
                                <span className="w-1.5 md:w-2 h-6 md:h-8 bg-[#BA9D76] rounded-full" />
                                Aktywne Zamówienia
                            </h2>
                            <div className="h-px bg-white/5 flex-1" />
                            {activeOrders.length > 0 && (
                                <span className="text-xs bg-[#BA9D76]/20 text-[#BA9D76] border border-[#BA9D76]/30 px-3 py-1 rounded-full font-bold shrink-0">
                                    {activeOrders.length} aktywnych
                                </span>
                            )}
                        </div>

                        {activeOrders.length === 0 ? (
                            <div className="text-center py-20 md:py-32 backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl border-dashed">
                                <UtensilsCrossed className="mx-auto h-10 w-10 md:h-12 md:w-12 text-white/10 mb-4" />
                                <p className="text-white/40 text-base md:text-lg">Aktualnie brak nowych zamówień na liście.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 md:gap-8">
                                {activeOrders.map((order: any) => (
                                    <OrderCard key={order._id} order={order} />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* History + Analytics */}
                    {completedOrders.length > 0 && (
                        <section className="pt-8 md:pt-10 border-t border-white/5 space-y-8">
                            {/* Section header */}
                            <div className="flex items-center justify-between gap-4 md:gap-6 w-full">
                                <h2 className="text-lg md:text-xl font-bold text-white/60 shrink-0">Historia Zamówień</h2>
                                <div className="h-px bg-white/5 flex-1 hidden sm:block" />
                                <CsvDownloadButton />
                            </div>

                            {/* Analytics Chart */}
                            <OrderAnalyticsChart orders={completedOrders} />

                            {/* History List */}
                            <div className="space-y-3">
                                {completedOrders.map((order: any) => (
                                    <div
                                        key={order._id}
                                        className="backdrop-blur-md bg-white/5 border border-white/10 p-4 md:p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:bg-white/10 transition-all shadow-lg"
                                    >
                                        {/* Left: status + basic info */}
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 border border-green-500/20 text-[10px] font-bold shrink-0">
                                                OK
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-[#BA9D76]">#{order.orderNumber?.slice(-4)}</h4>
                                                <p className="text-white/70 text-sm truncate">{order.customerName}</p>
                                                <p className="text-white/40 text-[10px] mt-0.5">
                                                    {order.orderType === 'delivery' ? '🚗 Dostawa' : '📦 Odbiór'} · Zakończono:{' '}
                                                    {new Date(order.completedAt || order.orderDate).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Middle: items */}
                                        <div className="flex-1 min-w-0 hidden md:block">
                                            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Zamówienie</p>
                                            <p className="text-xs text-white/70 line-clamp-1 italic">
                                                {order.items?.map((i: any) => `${i.quantity}x ${i.name || 'Produkt'}`).join(', ')}
                                            </p>
                                        </div>

                                        {/* Right: amount */}
                                        <div className="text-right shrink-0">
                                            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-0.5">Kwota</p>
                                            <p className="font-bold text-[#BA9D76]">{order.totalAmount?.toFixed(2)} zł</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    )
}
