// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { EnumRoleUsers } from "@prisma/client"

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl
        const { token } = req.nextauth

        console.log('Middleware Debug:', {
            pathname,
            hasToken: !!token,
            role: token?.role,
            sub: token?.sub,
            timestamp: new Date().toISOString()
        })

        // Allow access to login page
        if (pathname === '/admin/login') {
            return NextResponse.next()
        }

        // Protect /admin/* pages
        if (pathname.startsWith('/admin')) {
            if (!token) {
                console.log('No token, redirecting to login')
                return NextResponse.redirect(new URL('/admin/login', req.url))
            }

            // Check if role is present in token
            if (!token.role) {
                console.log('No role in token, redirecting to login')
                return NextResponse.redirect(new URL('/admin/login?error=SessionExpired', req.url))
            }

            const adminRoles: EnumRoleUsers[] = [
                EnumRoleUsers.SUPER_ADMIN,
                EnumRoleUsers.ADMIN,
                EnumRoleUsers.MODERATOR
            ]

            if (!adminRoles.includes(token.role as EnumRoleUsers)) {
                console.log('Invalid role:', token.role)
                return NextResponse.redirect(new URL('/admin/login?error=AccessDenied', req.url))
            }
        }

        // Protect /api/admin/* routes
        if (pathname.startsWith('/api/admin')) {
            if (!token) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }

            if (!token.role) {
                return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
            }

            const adminRoles: EnumRoleUsers[] = [
                EnumRoleUsers.SUPER_ADMIN,
                EnumRoleUsers.ADMIN,
                EnumRoleUsers.MODERATOR
            ]

            if (!adminRoles.includes(token.role as EnumRoleUsers)) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
            }
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl

                // Always allow access to login page
                if (pathname === '/admin/login') return true

                // For admin routes, require token with role
                if (pathname.startsWith('/admin')) {
                    return !!token && !!token.role
                }

                // For API routes, require token with role
                if (pathname.startsWith('/api/admin')) {
                    return !!token && !!token.role
                }

                return true
            },
        },
    }
)

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/admin/:path*'
    ]
}