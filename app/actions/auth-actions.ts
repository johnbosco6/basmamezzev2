'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from 'next-sanity'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''
const SESSION_COOKIE = 'admin_session'
const STAFF_COOKIE = 'current_staff'
const SHIFT_ID_COOKIE = 'shift_id'

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})

export async function loginAdmin(formData: FormData) {
    const password = formData.get('password') as string

    if (!password) {
        return { success: false, message: 'Proszę wprowadzić hasło' }
    }

    if (password === ADMIN_PASSWORD) {
        // Set secure session cookie
        cookies().set(SESSION_COOKIE, 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        })

        redirect('/admin')
    }

    return { success: false, message: 'Nieprawidłowe hasło' }
}

export async function clockIn(staffName: string) {
    try {
        const now = new Date().toISOString()
        const today = new Date().toISOString().split('T')[0]
        const mockShiftId = `shift-${Date.now()}`

        // Log what would be created in Sanity (for testing without token)
        console.log('📝 [MOCK] Creating shift log in Sanity:', {
            _type: 'shiftLog',
            staffName,
            clockInTime: now,
            shiftDate: today,
            ordersHandled: 0,
        })

        console.log('📝 [MOCK] Creating audit log in Sanity:', {
            _type: 'auditLog',
            staffName,
            action: 'clock_in',
            details: `${staffName} clocked in`,
            timestamp: now,
        })

        // Set staff cookie
        cookies().set(STAFF_COOKIE, staffName, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 12, // 12 hours
            path: '/',
        })

        // Set shift ID cookie
        cookies().set(SHIFT_ID_COOKIE, mockShiftId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 12,
            path: '/',
        })

        return { success: true, shiftId: mockShiftId }
    } catch (error) {
        console.error('Clock in failed:', error)
        return { success: false, message: 'Nie udało się rozpocząć zmiany' }
    }
}

export async function clockOut(newStaffName?: string) {
    try {
        const staffCookie = cookies().get(STAFF_COOKIE)
        const shiftIdCookie = cookies().get(SHIFT_ID_COOKIE)
        const currentStaff = staffCookie?.value
        const shiftId = shiftIdCookie?.value

        if (!currentStaff || !shiftId) {
            return { success: false, message: 'No active shift found' }
        }

        const now = new Date().toISOString()

        // Log what would be updated in Sanity (for testing without token)
        console.log('📝 [MOCK] Updating shift log in Sanity:', {
            shiftId,
            clockOutTime: now,
        })

        console.log('📝 [MOCK] Creating audit log in Sanity:', {
            _type: 'auditLog',
            staffName: currentStaff,
            action: 'clock_out',
            details: `${currentStaff} clocked out`,
            timestamp: now,
        })

        // Clear staff cookies
        cookies().delete(STAFF_COOKIE)
        cookies().delete(SHIFT_ID_COOKIE)

        // If new staff is starting, clock them in
        if (newStaffName) {
            return await clockIn(newStaffName)
        }

        return { success: true }
    } catch (error) {
        console.error('Clock out failed:', error)
        return { success: false, message: 'Nie udało się zakończyć zmiany' }
    }
}

export async function getCurrentStaff(): Promise<string | null> {
    const staffCookie = cookies().get(STAFF_COOKIE)
    return staffCookie?.value || null
}

export async function logoutAdmin() {
    // Clock out if there's an active shift
    const staffCookie = cookies().get(STAFF_COOKIE)
    if (staffCookie) {
        await clockOut()
    }

    cookies().delete(SESSION_COOKIE)
    redirect('/admin/login')
}

export async function isAuthenticated(): Promise<boolean> {
    const session = cookies().get(SESSION_COOKIE)
    return session?.value === 'authenticated'
}

export async function logAuditAction(staffName: string, action: string, details: string, orderId?: string) {
    try {
        // Log what would be created in Sanity (for testing without token)
        console.log('📝 [MOCK] Creating audit log in Sanity:', {
            _type: 'auditLog',
            staffName,
            action,
            details,
            orderId,
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        console.error('Failed to log audit action:', error)
    }
}
