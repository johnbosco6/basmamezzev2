import { archiveCompletedOrders } from '@/app/actions/admin-actions'
import { NextResponse } from 'next/server'
import { ensureAuthenticated } from '@/app/actions/auth-actions'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        await ensureAuthenticated()
        const result = await archiveCompletedOrders()
        return NextResponse.json(result)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
