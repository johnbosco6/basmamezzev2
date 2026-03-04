'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { Phone, MapPin, Clock, CheckCircle, Truck, Utensils, Archive, MessageCircle, Check } from 'lucide-react'
import { updateOrderStatus } from '@/app/actions/admin-actions'
import { logAuditAction, getCurrentStaff } from '@/app/actions/auth-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Archivo } from 'next/font/google'

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["200", "400", "600", "700"],
    display: "swap",
})

// Status mapping for visual styles with Polish labels
const statusConfig: { [key: string]: { label: string; color: string; icon: any; glow: string } } = {
    pending: { label: 'Oczekujące', color: 'bg-yellow-500', icon: Clock, glow: 'shadow-[0_0_10px_rgba(234,179,8,0.4)]' },
    preparing: { label: 'W przygotowaniu', color: 'bg-orange-500', icon: Utensils, glow: 'shadow-[0_0_10px_rgba(249,115,22,0.4)]' },
    out_for_delivery: { label: 'W drodze', color: 'bg-blue-500', icon: Truck, glow: 'shadow-[0_0_10px_rgba(59,130,246,0.4)]' },
    delivered: { label: 'Dostarczone', color: 'bg-green-500', icon: CheckCircle, glow: 'shadow-[0_0_10px_rgba(34,197,94,0.4)]' },
    cancelled: { label: 'Anulowane', color: 'bg-red-500', icon: Archive, glow: 'shadow-[0_0_10px_rgba(239,68,68,0.4)]' },
}

interface OrderCardProps {
    order: any
}

// Helper to safely render the customer address whether it's an old string or new object format
const formatAddress = (address: any) => {
    if (!address) return 'Brak adresu'
    if (typeof address === 'string') return address

    const parts = []
    if (address.street) {
        let streetPart = address.street
        if (address.houseNumber) {
            streetPart += ` ${address.houseNumber}`
            if (address.apartmentNumber) {
                streetPart += `/${address.apartmentNumber}`
            }
        }
        parts.push(streetPart)
    }
    if (address.city) {
        parts.push(`${address.postcode || ''} ${address.city}`.trim())
    }

    return parts.join(', ') || 'Brak pełnego adresu'
}


export function OrderCard({ order }: OrderCardProps) {
    const [loading, setLoading] = useState(false)
    const [currentStaff, setCurrentStaff] = useState<string>('Unknown')
    const [sentNotifications, setSentNotifications] = useState({
        received: false,
        preparing: false,
        on_way: false
    })

    useEffect(() => {
        const fetchStaff = async () => {
            const staff = await getCurrentStaff()
            setCurrentStaff(staff || 'Unknown')
        }
        fetchStaff()
    }, [])

    const status = order.status || 'pending'
    const config = statusConfig[status] || statusConfig.pending

    const allNotificationsSent = sentNotifications.received && sentNotifications.preparing && sentNotifications.on_way

    const sendNotification = async (type: 'received' | 'preparing' | 'on_way') => {
        let message = ''
        switch (type) {
            case 'received':
                message = `Dzień dobry ${order.customerName}, Twoje zamówienie z Basma Mezze zostało przyjęte! Zaraz zaczniemy je przygotowywać. 🥙`
                break
            case 'preparing':
                message = `Dzień dobry ${order.customerName}, Twoje zamówienie jest właśnie przygotowywane przez naszego szefa kuchni! 👨‍🍳🔥`
                break
            case 'on_way':
                message = `Dzień dobry ${order.customerName}, Twoje zamówienie z Basma Mezze jest już w drodze! 🚗💨 smacznego!`
                break
        }

        const url = `https://wa.me/${order.customerPhone}?text=${encodeURIComponent(message)}`
        window.open(url, '_blank')

        setSentNotifications(prev => ({ ...prev, [type]: true }))

        // Log notification sent
        await logAuditAction(
            currentStaff,
            'notification_sent',
            `Sent ${type} notification to ${order.customerName}`,
            order._id
        )
    }

    const handleStatusUpdate = async (newStatus: string) => {
        setLoading(true)
        try {
            const result = await updateOrderStatus(order._id, newStatus)
            if (result.success) {
                toast.success(result.message)

                // Log status change
                await logAuditAction(
                    currentStaff,
                    'order_status_changed',
                    `Changed order ${order.orderNumber} status from ${status} to ${newStatus}`,
                    order._id
                )
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error('Wystąpił błąd')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className={`w-full backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl overflow-hidden text-white ${archivo.className} ${config.glow}`}>
            <CardHeader className="pb-3 border-b border-white/10">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
                    <div>
                        <CardTitle className="text-xl font-bold flex flex-wrap items-center gap-3">
                            <span className="text-[#BA9D76]">#{order.orderNumber?.slice(-4) || '----'}</span>
                            <Badge className={`${config.color} text-white border-0 shadow-lg px-3 py-1`}>
                                <config.icon className="w-3.5 h-3.5 mr-1.5" />
                                {config.label}
                            </Badge>
                        </CardTitle>
                        <p className="text-xs text-white/50 mt-1 uppercase tracking-wider font-light">
                            {order.orderDate ? format(new Date(order.orderDate), 'PPp', { locale: pl }) : 'Przed chwilą'}
                        </p>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                        <p className="font-bold text-2xl text-[#BA9D76]">{order.totalAmount?.toFixed(2)} zł</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="py-6 space-y-6 px-4 sm:px-6">
                {/* Customer Info */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                    <div className="flex items-center gap-3 font-semibold text-lg overflow-hidden">
                        <span className="text-xl">👤</span>
                        <span className="truncate">{order.customerName}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-white/70">
                            <Phone className="w-3.5 h-3.5 text-[#BA9D76]" />
                            <a href={`tel:${order.customerPhone}`} className="hover:text-[#BA9D76] transition-colors break-all text-sm">{order.customerPhone}</a>
                        </div>
                        <div className="flex items-start gap-3 text-white/70">
                            <MapPin className="w-3.5 h-3.5 text-[#BA9D76] mt-1 shrink-0" />
                            <span className="text-sm leading-tight">{formatAddress(order.customerAddress)}</span>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] pl-1">Produkty</h4>
                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-start text-sm py-3 border-b border-white/5 last:border-0 group">
                                <div className="flex gap-3">
                                    <span className="font-bold text-center bg-[#BA9D76]/80 text-white min-w-[24px] h-[24px] flex items-center justify-center rounded-lg shadow-sm text-xs shrink-0">
                                        {item.quantity}
                                    </span>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-medium group-hover:text-[#BA9D76] transition-colors truncate">
                                            {item.name || 'Nieznany produkt'}
                                        </span>
                                        {item.additions && (
                                            <span className="text-white/40 text-[11px] italic mt-0.5 line-clamp-2">
                                                + {item.additions}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className="font-semibold text-white/90 ml-2 shrink-0">{(item.price * item.quantity).toFixed(2)} zł</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-4 border-t border-white/5 flex flex-col gap-4 bg-black/5">
                {/* WhatsApp Notification Center */}
                <div className="w-full space-y-3">
                    <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                        <MessageCircle className="w-3 h-3" /> Powiadomienia (Wszystkie 3 wymagane)
                    </h4>
                    <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            className={`text-[10px] h-10 border border-white/10 uppercase font-bold tracking-tight transition-all flex items-center justify-center gap-2 ${sentNotifications.received ? 'bg-green-600/50 border-green-500/50 text-white' : 'bg-white/5 hover:bg-white/10 text-white/60'}`}
                            onClick={() => sendNotification('received')}
                        >
                            {sentNotifications.received ? <Check className="w-3 h-3" /> : null} Przyjęte
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            className={`text-[10px] h-10 border border-white/10 uppercase font-bold tracking-tight transition-all flex items-center justify-center gap-2 ${sentNotifications.preparing ? 'bg-green-600/50 border-green-500/50 text-white' : 'bg-white/5 hover:bg-white/10 text-white/60'}`}
                            onClick={() => sendNotification('preparing')}
                        >
                            {sentNotifications.preparing ? <Check className="w-3 h-3" /> : null} Gotowanie
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            className={`text-[10px] h-10 border border-white/10 uppercase font-bold tracking-tight transition-all flex items-center justify-center gap-2 ${sentNotifications.on_way ? 'bg-green-600/50 border-green-500/50 text-white' : 'bg-white/5 hover:bg-white/10 text-white/60'}`}
                            onClick={() => sendNotification('on_way')}
                        >
                            {sentNotifications.on_way ? <Check className="w-3 h-3" /> : null} W drodze
                        </Button>
                    </div>
                </div>

                {/* Primary Action Button */}
                <div className="w-full mt-2">
                    {status !== 'delivered' && (
                        <Button
                            className={`w-full font-bold h-14 rounded-xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 ${allNotificationsSent ? 'bg-green-600 hover:bg-green-700 hover:scale-[1.02]' : 'bg-white/10 text-white/40 cursor-not-allowed opacity-50'}`}
                            onClick={() => {
                                if (allNotificationsSent) {
                                    handleStatusUpdate('delivered')
                                } else {
                                    toast.error('Wyślij wszystkie 3 powiadomienia, aby zakończyć!')
                                }
                            }}
                            disabled={loading}
                        >
                            <CheckCircle className="h-6 w-6" />
                            {allNotificationsSent ? 'ZAKOŃCZ ZAMÓWIENIE' : 'WYŚLIJ POWIADOMIENIA'}
                        </Button>
                    )}

                    {status === 'delivered' && (
                        <div className="flex items-center justify-center gap-2 py-4 text-[#BA9D76] font-semibold bg-white/5 rounded-xl border border-[#BA9D76]/20">
                            <CheckCircle className="w-5 h-5" />
                            Zamówienie Zakończone
                        </div>
                    )}
                </div>
            </CardFooter>
        </Card>
    )
}



