import { ReactNode } from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Basma Admin',
    description: 'Basma Mezze & Grill - Administration',
}

// Minimal layout for the /admin root — only wraps the login page.
// The dashboard pages live in (dashboard)/layout.tsx which adds
// OrderNotification and PWARegistration ONLY for authenticated pages.
export default function AdminLayout({ children }: { children: ReactNode }) {
    return <>{children}</>
}
