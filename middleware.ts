import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/admin/login']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const session = request.cookies.get('admin_session')
    const isAuthenticated = session?.value === 'authenticated'

    // Allow public routes (login page) - MUST be first
    if (pathname === '/admin/login') {
        return NextResponse.next()
    }

    // Removed the aggressive block on public routes. 
    // The public site should remain public!

    // Protect all /admin routes (except login which we already handled)
    if (pathname.startsWith('/admin')) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    ],
}
