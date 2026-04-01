'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Archivo } from 'next/font/google'

const archivo = Archivo({ subsets: ["latin"], weight: ["400", "600"], display: "swap" })

interface Order {
    completedAt?: string
    orderDate: string
    totalAmount: number
}

interface OrderAnalyticsChartProps {
    orders: Order[]
}

export function OrderAnalyticsChart({ orders }: OrderAnalyticsChartProps) {
    // Build hourly revenue data
    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        revenue: 0,
        count: 0,
    }))

    orders.forEach(order => {
        const dateStr = order.completedAt || order.orderDate
        if (!dateStr) return
        const hour = new Date(dateStr).getHours()
        hourlyData[hour].revenue += order.totalAmount || 0
        hourlyData[hour].count += 1
    })

    // Filter to only show hours with data + nearby hours for context
    const activeHours = hourlyData.filter(d => d.revenue > 0)
    const displayData = activeHours.length > 0 ? activeHours : hourlyData.slice(10, 23) // fallback range

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1a1a1a] border border-[#BA9D76]/30 rounded-xl p-3 shadow-2xl">
                    <p className="text-[#BA9D76] text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-white font-bold text-sm">{payload[0].value.toFixed(2)} zł</p>
                    <p className="text-white/50 text-xs">{payload[0].payload.count} zamówień</p>
                </div>
            )
        }
        return null
    }

    return (
        <div className={`backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 ${archivo.className}`}>
            <div className="mb-6">
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest">Analityka — Przychód wg Godziny (Ten Miesiąc)</h3>
                <p className="text-xs text-white/30 mt-1">Łączny przychód ze wszystkich zamówień w bieżącym miesiącu</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={displayData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="hour"
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={v => `${v} zł`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(186,157,118,0.05)' }} />
                    <Bar
                        dataKey="revenue"
                        fill="#BA9D76"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={40}
                    />
                </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex gap-6">
                <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Suma Miesięczna</p>
                    <p className="text-[#BA9D76] font-bold text-lg">
                        {orders.reduce((s, o) => s + (o.totalAmount || 0), 0).toFixed(2)} zł
                    </p>
                </div>
                <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Zamówienia</p>
                    <p className="text-white font-bold text-lg">{orders.length}</p>
                </div>
                <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Śr. Wartość</p>
                    <p className="text-white font-bold text-lg">
                        {orders.length > 0 ? (orders.reduce((s, o) => s + (o.totalAmount || 0), 0) / orders.length).toFixed(2) : '0.00'} zł
                    </p>
                </div>
            </div>
        </div>
    )
}
