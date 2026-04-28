'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { getOrders, getMonthlyOrders } from '@/app/actions/admin-actions'
import { OrderCard } from './order-card'
import { OrderAnalyticsChart } from './order-analytics-chart'
import { CsvDownloadButton } from './csv-download-button'
import { TrendingUp, ShoppingBag, UtensilsCrossed, Users, RefreshCcw } from 'lucide-react'
import { client } from '@/lib/sanity'
import { getWarsawTimeState } from '@/lib/hours'
import { useRef } from 'react'

interface OrderListManagerProps {
    initialOrders: any[]
}

export function OrderListManager({ initialOrders }: OrderListManagerProps) {
    const [orders, setOrders] = useState(initialOrders)
    const [monthlyOrders, setMonthlyOrders] = useState<any[]>([])
    const [isPolling, setIsPolling] = useState(false)
    const [lastSync, setLastSync] = useState<Date | null>(null)
    const [timeRange, setTimeRange] = useState<'day' | 'month'>('month')
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const prevOrdersCount = useRef<number>(initialOrders.length)

    const refreshOrders = useCallback(async () => {
        setIsPolling(true)
        try {
            const [latest, monthly] = await Promise.all([
                getOrders(),
                getMonthlyOrders()
            ])
            
            if (latest) {
                // Play sound if new orders arrived (count increased)
                if (latest.length > prevOrdersCount.current) {
                    console.log('🔔 New order detected! Playing alert...')
                    audioRef.current?.play().catch(e => console.warn('Audio play blocked:', e))
                }
                prevOrdersCount.current = latest.length
                setOrders(latest)
            }
            if (monthly) {
                setMonthlyOrders(monthly)
            }
            setLastSync(new Date())
        } catch (error) {
            console.error('Failed to poll orders:', error)
        } finally {
            setIsPolling(false)
        }
    }, [])

    useEffect(() => {
        // Subscribe to real-time updates for all orders (WebSocket)
        const query = '*[_type == "order"]'
        const subscription = client.listen(query).subscribe(() => {
            console.log('🔄 Real-time update detected!')
            refreshOrders()
        })

        // Fallback: Poll every 30 seconds in case listener fails or tab was in background
        const interval = setInterval(() => {
            console.log('⏰ Scheduled poll...')
            refreshOrders()
        }, 30000)

        // Initial refresh
        refreshOrders()

        return () => {
            subscription.unsubscribe()
            clearInterval(interval)
        }
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

    // Stats (using monthlyOrders for persistence)
    const stats = useMemo(() => {
        const { dateString } = getWarsawTimeState()

        const filteredOrders = timeRange === 'day' 
            ? monthlyOrders.filter((o: any) => {
                const orderDate = o.completedAt || o.orderDate
                return orderDate && orderDate.startsWith(dateString)
            })
            : monthlyOrders

        const completed = filteredOrders.filter((o: any) => o.status === 'delivered' || o.status === 'picked_up')
        const revenue = completed.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0)
        const dishes = completed.reduce((sum: number, o: any) => 
            sum + (o.items?.reduce((s: number, i: any) => s + (i.quantity || 0), 0) || 0), 0)
        
        return { 
            revenue, 
            dishes,
            count: completed.length 
        }
    }, [monthlyOrders, timeRange])

    return (
        <main className="p-4 md:p-10 space-y-8 md:space-y-12 overflow-y-auto">
            {/* Header + Time Toggle */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-white lg:text-4xl">
                        Basma <span className="text-[#BA9D76]">Admin</span>
                    </h1>
                    <p className="text-white/40 text-sm mt-1">Zarządzaj swoją restauracją w czasie rzeczywistym.</p>
                </div>

                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 self-start md:self-center">
                    <button
                        onClick={() => setTimeRange('day')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            timeRange === 'day' 
                                ? "bg-[#BA9D76] text-white shadow-lg" 
                                : "text-white/40 hover:text-white/60"
                        }`}
                    >
                        Dziś (Dz)
                    </button>
                    <button
                        onClick={() => setTimeRange('month')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            timeRange === 'month' 
                                ? "bg-[#BA9D76] text-white shadow-lg" 
                                : "text-white/40 hover:text-white/60"
                        }`}
                    >
                        Miesiąc (Mc)
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-[#BA9D76]">
                        <TrendingUp size={40} className="md:w-12 md:h-12 text-[#BA9D76]" />
                    </div>
                    <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                        Przychód {timeRange === 'day' ? '(Dz)' : '(Mc)'}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#BA9D76] leading-none">{stats.revenue.toFixed(2)} zł</h3>
                </div>
                <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <ShoppingBag size={40} className="md:w-12 md:h-12" />
                    </div>
                    <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                        Zakończone {timeRange === 'day' ? '(Dz)' : '(Mc)'}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold leading-none">{stats.count}</h3>
                </div>
                <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <UtensilsCrossed size={40} className="md:w-12 md:h-12" />
                    </div>
                    <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                        Wydane Potrawy {timeRange === 'day' ? '(Dz)' : '(Mc)'}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold leading-none">{stats.dishes}</h3>
                </div>
                <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl shadow-2xl relative overflow-hidden group border-l-4 border-l-[#BA9D76]">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Users size={40} className="md:w-12 md:h-12" />
                    </div>
                    <p className="text-[11px] font-bold text-[#BA9D76] uppercase tracking-widest mb-1.5">Aktywni Klienci</p>
                    <h3 className="text-2xl md:text-3xl font-bold leading-none">{activeOrders.length}</h3>
                </div>
            </section>

            {/* Active Orders */}
            <section>
                <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
                    <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 shrink-0">
                        <span className="w-1.5 md:w-2 h-6 md:h-8 bg-[#BA9D76] rounded-full" />
                        Aktywne Zamówienia
                        <span className={`flex items-center gap-1.5 ml-2 text-[10px] uppercase tracking-[0.2em] font-black px-2.5 py-1 rounded-full border transition-all ${
                            isPolling 
                                ? "bg-[#BA9D76]/20 border-[#BA9D76]/40 text-[#BA9D76] animate-pulse shadow-[0_0_10px_rgba(186,157,118,0.2)]" 
                                : "bg-white/5 border-white/10 text-white/20"
                        }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isPolling ? "bg-[#BA9D76]" : "bg-white/20"}`} />
                            Live Sync {lastSync ? `· ${lastSync.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : ''}
                        </span>
                    </h2>
                    <audio ref={audioRef} src="/sounds/order-alarm.wav" preload="auto" />
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5 md:gap-8">
                        {activeOrders.map((order: any) => (
                            <OrderCard key={order._id} order={order} />
                        ))}
                    </div>
                )}
            </section>

            {/* History + Analytics */}
            {(completedOrders.length > 0 || monthlyOrders.length > 0) && (
                <section className="pt-8 md:pt-10 border-t border-white/5 space-y-8">
                    <div className="flex items-center justify-between gap-4 md:gap-6 w-full">
                        <h2 className="text-lg md:text-xl font-bold text-white/60 shrink-0">Historia Zamówień</h2>
                        <div className="h-px bg-white/5 flex-1 hidden sm:block" />
                        <CsvDownloadButton />
                    </div>

                    <OrderAnalyticsChart orders={monthlyOrders} />

                    {completedOrders.length > 0 && (
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
                    )}
                </section>
            )}
        </main>
    )
}
