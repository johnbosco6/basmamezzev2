import { ReactNode } from 'react'
import { Metadata } from 'next'
import { PWARegistration } from '@/components/admin/pwa-registration'
import { OrderNotification } from '@/components/admin/order-notification'

export const metadata: Metadata = {
    title: 'Basma Admin Dashboard',
    description: 'Operational management for Basma Meze & Grill',
    manifest: '/manifest.json',
    themeColor: '#BA9D76',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Basma Admin',
    },
    icons: {
        apple: [
            { url: '/icons/icon-192x192.png' },
        ],
    },
}

// This layout only wraps authenticated admin pages (dashboard, history, etc.)
// The login page is intentionally excluded — it has its own plain layout.
// This prevents OrderNotification from mounting on the login page and 
// calling getActiveOrders() while unauthenticated, which caused an infinite loop.
export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <PWARegistration />
            <OrderNotification />
            {children}
        </>
    )
}
