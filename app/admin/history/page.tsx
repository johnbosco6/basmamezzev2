import { getOrders } from '@/app/actions/admin-actions'
import { AdminSidebar } from '@/components/admin/sidebar'
import { Archivo } from 'next/font/google'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { History, Search } from 'lucide-react'
import { ExportButton } from '@/components/admin/export-button'

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["200", "400", "600", "700"],
    display: "swap",
})

export const dynamic = 'force-dynamic'

export default async function OrderHistoryPage() {
    const orders = await getOrders() || []
    const completedOrders = orders.filter((o: any) => o.status === 'delivered')

    return (
        <div className={`flex min-h-screen bg-[#121212] text-white ${archivo.className}`}>
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="sticky top-0 z-40 backdrop-blur-md bg-black/40 border-b border-white/10 p-4 md:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:h-20">
                    <div className="flex flex-col ml-12 lg:ml-0">
                        <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#BA9D76]">Historia Zamówień</h1>
                        <p className="text-white/40 text-[9px] md:text-[10px] uppercase tracking-widest font-bold">Archiwum zakończonych transakcji</p>
                    </div>
                </header>

                <main className="p-4 md:p-10 space-y-6 md:space-y-8 overflow-y-auto">
                    {/* Search / Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#BA9D76] transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Szukaj po numerze, kliencie lub telefonie..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#BA9D76]/50 transition-all font-medium"
                            />
                        </div>
                        <div className="w-full md:w-auto">
                            <ExportButton />
                        </div>
                    </div>

                    {/* History Table */}
                    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 border-b border-white/10">
                                        <th className="px-6 py-5">Data</th>
                                        <th className="px-6 py-5">Numer</th>
                                        <th className="px-6 py-5">Klient</th>
                                        <th className="px-6 py-5">Zamówienie</th>
                                        <th className="px-6 py-5 text-right">Kwota</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {completedOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center text-white/20">
                                                Brak archiwalnych zamówień w tej dacie.
                                            </td>
                                        </tr>
                                    ) : (
                                        completedOrders.map((order: any) => (
                                            <tr key={order._id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-5 whitespace-nowrap text-sm text-white/60">
                                                    {format(new Date(order.orderDate), 'dd.MM.yyyy HH:mm', { locale: pl })}
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <span className="font-bold text-[#BA9D76] text-sm">#{order.orderNumber?.slice(-4)}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm text-white/90">{order.customerName}</span>
                                                        <span className="text-xs text-white/40">{order.customerPhone}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 max-w-md">
                                                    <p className="text-sm text-white/70 line-clamp-1 italic">
                                                        {order.items?.map((i: any) => `${i.quantity}x ${i.name || 'Produkt'}`).join(', ')}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-5 text-right whitespace-nowrap">
                                                    <span className="font-bold text-lg text-white">{order.totalAmount?.toFixed(2)} zł</span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
