import { getOrders } from '@/app/actions/admin-actions'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Archivo } from 'next/font/google'
import { AdminSidebar } from '@/components/admin/sidebar'
import { ShiftManager } from '@/components/admin/shift-manager'
import { OrderListManager } from '@/components/admin/order-list-manager'
import Link from 'next/link'

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["200", "400", "600", "700"],
    display: "swap",
})

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
    const orders = await getOrders() || []

    return (
        <div className={`flex min-h-screen bg-gradient-to-br from-[#1a2c44] via-[#2B2B2B] to-[#121212] text-white ${archivo.className}`}>
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="sticky top-0 z-40 backdrop-blur-md bg-black/40 border-b border-white/5 p-4 md:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-h-[5rem]">
                    <div className="flex flex-col pl-12 lg:pl-0">
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#BA9D76]">Panel Operacyjny</h1>
                        <p className="text-white/40 text-[10px] md:text-[11px] uppercase tracking-widest font-bold">
                            Na żywo: {new Date().toLocaleDateString('pl-PL')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                        <ShiftManager />
                        <Link href="/admin" className="shrink-0 ml-auto sm:ml-0">
                            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl shadow-xl backdrop-blur-sm whitespace-nowrap h-9">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Odśwież
                            </Button>
                        </Link>
                    </div>
                </header>

                <OrderListManager initialOrders={orders} />
            </div>
        </div>
    )
}
