'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { Phone, MapPin, Clock, CheckCircle, Truck, Utensils, Archive, Mail, Check, Loader2, CreditCard, Banknote, Wallet } from 'lucide-react'
import { updateOrderStatus, sendNotificationEmail } from '@/app/actions/admin-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Archivo } from 'next/font/google'
import { useRouter } from 'next/navigation'

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["200", "400", "600", "700"],
    display: "swap",
})

// Status visual config
const statusConfig: { [key: string]: { label: string; color: string; icon: any; glow: string } } = {
    pending: { label: 'Oczekujące', color: 'bg-yellow-500', icon: Clock, glow: 'shadow-[0_0_10px_rgba(234,179,8,0.4)]' },
    confirmed: { label: 'Potwierdzone', color: 'bg-teal-500', icon: CheckCircle, glow: 'shadow-[0_0_10px_rgba(20,184,166,0.4)]' },
    preparing: { label: 'W przygotowaniu', color: 'bg-orange-500', icon: Utensils, glow: 'shadow-[0_0_10px_rgba(249,115,22,0.4)]' },
    out_for_delivery: { label: 'W drodze', color: 'bg-blue-500', icon: Truck, glow: 'shadow-[0_0_10px_rgba(59,130,246,0.4)]' },
    delivered: { label: 'Dostarczone', color: 'bg-green-500', icon: CheckCircle, glow: 'shadow-[0_0_10px_rgba(34,197,94,0.4)]' },
    picked_up: { label: 'Odebrane', color: 'bg-green-500', icon: CheckCircle, glow: 'shadow-[0_0_10px_rgba(34,197,94,0.4)]' },
    cancelled: { label: 'Anulowane', color: 'bg-red-500', icon: Archive, glow: 'shadow-[0_0_10px_rgba(239,68,68,0.4)]' },
}

const paymentConfig: { [key: string]: { label: string; icon: any; color: string } } = {
    p24: { label: 'Płatność Online', icon: Wallet, color: 'text-blue-400' },
    cash: { label: 'Gotówka przy odbiorze', icon: Banknote, color: 'text-green-400' },
    card_on_delivery: { label: 'Karta przy odbiorze', icon: CreditCard, color: 'text-purple-400' },
}

interface OrderCardProps {
    order: any
}

const formatAddress = (address: any) => {
    if (!address) return 'Brak adresu'
    if (typeof address === 'string') return address
    const parts = []
    if (address.street) {
        let s = address.street
        if (address.houseNumber) s += ` ${address.houseNumber}`
        if (address.apartmentNumber) s += `/${address.apartmentNumber}`
        parts.push(s)
    }
    if (address.city) parts.push(`${address.postcode || ''} ${address.city}`.trim())
    return parts.join(', ') || 'Brak pełnego adresu'
}

export function OrderCard({ order }: OrderCardProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [emailsSent, setEmailsSent] = useState({
        cooking: false,
        onWay: false,
    })

    const status = order.status || 'pending'
    const config = statusConfig[status] || statusConfig.pending
    const isPickup = order.orderType === 'pickup'

    // For pickup orders: only need "cooking" email before Attended
    // For delivery: need both "cooking" + "on the way"
    const canAttend = isPickup ? emailsSent.cooking : (emailsSent.cooking && emailsSent.onWay)

    const handleEmailNotification = async (stage: 'preparing' | 'out_for_delivery') => {
        setLoading(true)
        try {
            const result = await sendNotificationEmail(order._id, stage)
            if (result.success) {
                toast.success(stage === 'preparing' ? '🍳 Email "Gotowanie" wysłany!' : '🚗 Email "W drodze" wysłany!')
                if (stage === 'preparing') setEmailsSent(prev => ({ ...prev, cooking: true }))
                else setEmailsSent(prev => ({ ...prev, onWay: true }))
            } else {
                toast.error(`Email nie mógł być wysłany: ${result.message}`)
            }
        } catch {
            toast.error('Błąd wysyłania emaila')
        } finally {
            setLoading(false)
        }
    }

    const handleAttended = async () => {
        setLoading(true)
        try {
            const finalStatus = isPickup ? 'picked_up' : 'delivered'
            const result = await updateOrderStatus(order._id, finalStatus)
            if (result.success) {
                toast.success('✅ Zamówienie zakończone i przeniesione do historii!')
                router.refresh()
            } else {
                toast.error(result.message)
            }
        } catch {
            toast.error('Błąd aktualizacji statusu')
        } finally {
            setLoading(false)
        }
    }

    const isCompleted = status === 'delivered' || status === 'picked_up'

    return (
        <Card className={`w-full backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl overflow-hidden text-white ${archivo.className} ${config.glow}`}>
            {/* Header */}
            <CardHeader className="pb-3 border-b border-white/10">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
                    <div>
                        <CardTitle className="text-xl font-bold flex flex-wrap items-center gap-3">
                            <span className="text-[#BA9D76]">#{order.orderNumber?.slice(-4) || '----'}</span>
                            <Badge className={`${config.color} text-white border-0 shadow-lg px-3 py-1`}>
                                <config.icon className="w-3.5 h-3.5 mr-1.5" />
                                {config.label}
                            </Badge>
                            {isPickup && (
                                <Badge className="bg-purple-600 text-white border-0 px-2 py-1 text-xs">Odbiór</Badge>
                            )}
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
                        {/* Payment Method Badge */}
                        <div className="flex items-center gap-3 py-1.5 px-3 bg-white/5 rounded-lg border border-white/5 w-fit">
                            {(() => {
                                const p = paymentConfig[order.paymentMethod] || paymentConfig.p24
                                return (
                                    <>
                                        <p.icon className={`w-3.5 h-3.5 ${p.color}`} />
                                        <span className={`text-[11px] font-bold uppercase tracking-wider ${p.color}`}>{p.label}</span>
                                    </>
                                )
                            })()}
                        </div>
                        {order.customerEmail && (
                            <div className="flex items-center gap-3 text-white/70">
                                <Mail className="w-3.5 h-3.5 text-[#BA9D76]" />
                                <span className="text-sm break-all">{order.customerEmail}</span>
                            </div>
                        )}
                        <div className="flex items-start gap-3 text-white/70">
                            <MapPin className="w-3.5 h-3.5 text-[#BA9D76] mt-1 shrink-0" />
                            <span className="text-sm leading-tight">{formatAddress(order.customerAddress)}</span>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] pl-1">Produkty</h4>
                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-2">
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

                {order.notes && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                        <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider mb-1">Uwagi</p>
                        <p className="text-sm text-white/80">{order.notes}</p>
                    </div>
                )}
            </CardContent>

            <CardFooter className="p-4 pt-4 border-t border-white/5 flex flex-col gap-4 bg-black/5">
                {!isCompleted && (
                    <>
                        {/* Email Notification Center */}
                        <div className="w-full space-y-2">
                            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Mail className="w-3 h-3" /> Powiadomienia Email
                            </h4>
                            <div className={`grid gap-2 ${isPickup ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                {/* Cooking email */}
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    disabled={loading || emailsSent.cooking}
                                    className={`h-10 text-xs border font-bold tracking-tight uppercase transition-all flex items-center justify-center gap-2 ${emailsSent.cooking
                                        ? 'bg-green-600/50 border-green-500/50 text-white cursor-default'
                                        : 'bg-white/5 hover:bg-orange-500/20 border-white/10 hover:border-orange-500/30 text-white'
                                        }`}
                                    onClick={() => handleEmailNotification('preparing')}
                                >
                                    {emailsSent.cooking ? <Check className="w-3 h-3" /> : loading ? <Loader2 className="w-3 h-3 animate-spin" /> : '🍳'}
                                    {emailsSent.cooking ? 'Gotowanie ✓' : 'Wyślij: Gotowanie'}
                                </Button>

                                {/* On the way email — only for delivery */}
                                {!isPickup && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        disabled={loading || emailsSent.onWay || !emailsSent.cooking}
                                        className={`h-10 text-xs border font-bold tracking-tight uppercase transition-all flex items-center justify-center gap-2 ${emailsSent.onWay
                                            ? 'bg-green-600/50 border-green-500/50 text-white cursor-default'
                                            : !emailsSent.cooking
                                                ? 'bg-white/5 border-white/5 text-white/30 cursor-not-allowed opacity-50'
                                                : 'bg-white/5 hover:bg-blue-500/20 border-white/10 hover:border-blue-500/30 text-white'
                                            }`}
                                        onClick={() => handleEmailNotification('out_for_delivery')}
                                    >
                                        {emailsSent.onWay ? <Check className="w-3 h-3" /> : loading ? <Loader2 className="w-3 h-3 animate-spin" /> : '🚗'}
                                        {emailsSent.onWay ? 'W drodze ✓' : 'Wyślij: W drodze'}
                                    </Button>
                                )}
                            </div>
                            {!isPickup && !emailsSent.cooking && (
                                <p className="text-[10px] text-white/30 text-center">Wyślij "Gotowanie" najpierw, aby odblokować "W drodze"</p>
                            )}
                        </div>

                        {/* Attended / Complete Button */}
                        <Button
                            className={`w-full font-bold h-14 rounded-xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-base ${canAttend
                                ? 'bg-green-600 hover:bg-green-700 hover:scale-[1.02] text-white'
                                : 'bg-white/5 text-white/30 cursor-not-allowed opacity-50'
                                }`}
                            disabled={loading || !canAttend}
                            onClick={canAttend ? handleAttended : undefined}
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <CheckCircle className="h-6 w-6" />
                            )}
                            {canAttend ? '✅ ZAMÓWIENIE OBSŁUŻONE' : 'WYŚLIJ POWIADOMIENIA NAJPIERW'}
                        </Button>
                    </>
                )}

                {isCompleted && (
                    <div className="flex items-center justify-center gap-2 py-4 text-[#BA9D76] font-semibold bg-white/5 rounded-xl border border-[#BA9D76]/20">
                        <CheckCircle className="w-5 h-5" />
                        Zamówienie Zakończone
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}
