'use client'

import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CsvDownloadButton() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleDownload = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/export-orders')
            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            const date = new Date().toISOString().split('T')[0]
            a.download = `zamowienia_historia_${date}.csv`
            a.click()
            URL.revokeObjectURL(url)

            // Refresh history list after download
            setTimeout(() => {
                router.refresh()
            }, 500)
        } catch {
            console.error('CSV download failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={handleDownload}
            className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl shadow-xl backdrop-blur-sm whitespace-nowrap"
        >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {loading ? 'Pobieranie...' : 'Pobierz Raport (CSV)'}
        </Button>
    )
}
