import { NextRequest, NextResponse } from 'next/server'
import { archiveCompletedOrders } from '@/app/actions/admin-actions'
import { ensureAuthenticated } from '@/app/actions/auth-actions'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        await ensureAuthenticated()
        const result = await archiveCompletedOrders()
        return NextResponse.json(result)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
