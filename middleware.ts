import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/admin/login']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const session = request.cookies.get('admin_session')
    
    // We rely on the backend (Server Actions/API) to verify the token signature.
    // The middleware handles UI redirection.
    const isAuthenticated = !!session?.value

    // Allow public routes (login page) - MUST be first
    if (pathname === '/admin/login') {
        return NextResponse.next()
    }

    // Removed the aggressive block on public routes. 
    // The public site should remain public!

    // Protect all /admin routes and sensitive administrative API routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/archive-all') || pathname.startsWith('/api/export-orders')) {
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
