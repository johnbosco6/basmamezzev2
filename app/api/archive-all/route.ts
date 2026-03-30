import { archiveCompletedOrders } from '@/app/actions/admin-actions'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const result = await archiveCompletedOrders()
        return NextResponse.json(result)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
