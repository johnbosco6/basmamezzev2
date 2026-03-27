import { useState, useEffect, useMemo, useCallback } from 'react'
import { getOrders } from '@/app/actions/admin-actions'
import { OrderCard } from './order-card'
import { OrderAnalyticsChart } from './order-analytics-chart'
import { CsvDownloadButton } from './csv-download-button'
import { TrendingUp, ShoppingBag, UtensilsCrossed, Users, RefreshCcw } from 'lucide-react'

interface OrderListManagerProps {
    initialOrders: any[]
}

export function OrderListManager({ initialOrders }: OrderListManagerProps) {
    const [orders, setOrders] = useState(initialOrders)
    const [isPolling, setIsPolling] = useState(false)

    const refreshOrders = useCallback(async () => {
        setIsPolling(true)
        try {
            const latest = await getOrders()
            if (latest && latest.length > 0) {
                setOrders(latest)
            }
        } catch (error) {
            console.error('Failed to poll orders:', error)
        } finally {
            setIsPolling(false)
        }
    }, [])

    useEffect(() => {
        // Initial setup and polling interval (every 15 seconds)
        const interval = setInterval(refreshOrders, 15000)
        return () => clearInterval(interval)
    }, [refreshOrders])

    // Memoized derived data
    const activeOrders = useMemo(() => 
        orders.filter((o: any) => 
            o.status !== 'cancelled' && o.status !== 'delivered' && o.status !== 'picked_up'
        ), [orders])

    const completedOrders = useMemo(() => 
        orders
            .filter((o: any) => o.status === 'delivered' || o.status === 'picked_up')
            .sort((a: any, b: any) => 
                new Date(b.completedAt || b.orderDate).getTime() - new Date(a.completedAt || a.orderDate).getTime()
            ), [orders])

    // Stats
    const stats = useMemo(() => {
        const revenue = completedOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0)
        const dishes = completedOrders.reduce((sum: number, o: any) => 
            sum + (o.items?.reduce((s: number, i: any) => s + (i.quantity || 0), 0) || 0), 0)
        return { revenue, dishes }
    }, [completedOrders])

    return (
        <main className="p-4 md:p-10 space-y-8 md:space-y-12 overflow-y-auto">
            {/* Stats Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <TrendingUp size={40} className="md:w-12 md:h-12" />
                    </div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Dziś Sprzedano</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#BA9D76]">{stats.revenue.toFixed(2)} zł</h3>
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
                    <h3 className="text-2xl md:text-3xl font-bold">{stats.dishes}</h3>
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
                        <span className={`flex items-center gap-1.5 ml-2 text-[8px] uppercase tracking-[0.2em] font-bold px-2 py-0.5 rounded-full border transition-all ${
                            isPolling 
                                ? "bg-[#BA9D76]/20 border-[#BA9D76]/40 text-[#BA9D76] animate-pulse" 
                                : "bg-white/5 border-white/10 text-white/20"
                        }`}>
                            <span className={`w-1 h-1 rounded-full ${isPolling ? "bg-[#BA9D76]" : "bg-white/20"}`} />
                            Live Sync
                        </span>
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
                    <div className="flex items-center justify-between gap-4 md:gap-6 w-full">
                        <h2 className="text-lg md:text-xl font-bold text-white/60 shrink-0">Historia Zamówień</h2>
                        <div className="h-px bg-white/5 flex-1 hidden sm:block" />
                        <CsvDownloadButton />
                    </div>

                    <OrderAnalyticsChart orders={completedOrders} />

                    <div className="space-y-3">
                        {completedOrders.map((order: any) => (
                            <div
                                key={order._id}
                                className="backdrop-blur-md bg-white/5 border border-white/10 p-4 md:p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:bg-white/10 transition-all shadow-lg"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 border border-green-500/20 text-[10px] font-bold shrink-0">
                                        OK
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-[#BA9D76]">#{order.orderNumber?.slice(-4)}</h4>
                                        <p className="text-white/70 text-sm truncate">{order.customerName}</p>
                                        <p className="text-white/40 text-[10px] mt-0.5">
                                            {order.orderType === 'delivery' ? '🚗 Dostawa' : '📦 Odbiór'} · {' '}
                                            {order.paymentMethod === 'p24' ? '💳 Online' : order.paymentMethod === 'cash' ? '💵 Gotówka' : '📟 Karta (kier.)'} · {' '}
                                            Zakończono:{' '}
                                            {new Date(order.completedAt || order.orderDate).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0 hidden md:block">
                                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Zamówienie</p>
                                    <p className="text-xs text-white/70 line-clamp-1 italic">
                                        {order.items?.map((i: any) => `${i.quantity}x ${i.name || 'Produkt'}`).join(', ')}
                                    </p>
                                </div>

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
    )
}
