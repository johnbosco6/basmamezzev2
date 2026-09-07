import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { generateSessionToken } from './lib/auth-utils'

const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback_secret_change_me'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const session = request.cookies.get('admin_session')
    
    // Protect all /admin routes and sensitive administrative API routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/archive-all') || pathname.startsWith('/api/export-orders')) {
        
        // If already authenticated and visiting login page, redirect to dashboard
        if (pathname === '/admin/login') {
            // Quick cookie existence check — no async crypto needed here
            const token = session?.value
            if (token) {
                // Let the page load; full token validation happens in the server action
                // Middleware only does a fast presence check to avoid redirect loops
                const expectedToken = await generateSessionToken(SESSION_SECRET)
                if (token === expectedToken) {
                    return NextResponse.redirect(new URL('/admin', request.url))
                }
            }
            return NextResponse.next()
        }

        const token = session?.value
        const expectedToken = await generateSessionToken(SESSION_SECRET)
        const isAuthenticated = token === expectedToken

        if (!isAuthenticated) {
            // For API routes, return 401
            if (pathname.startsWith('/api')) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images (public images)
         */
        '/((?!_next/static|_next/image|favicon.ico|images).*)',
    ],
}
