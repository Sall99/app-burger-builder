import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
    async function middleware(req) {
        const token = await getToken({ req })
        const isAuthenticated = !!token

        const authRoutes = ['/auth/sign-in', '/auth/sign-up']

        if (authRoutes.includes(req.nextUrl.pathname) && isAuthenticated) {
            return NextResponse.redirect(new URL('/', req.url))
        }

        if (!authRoutes.includes(req.nextUrl.pathname) && !isAuthenticated) {
            return NextResponse.redirect(new URL('/auth/sign-in', req.url))
        }
    },
    {
        callbacks: {
            authorized: () => true
        }
    }
)

export const config = {
    matcher: ['/auth/sign-in', '/auth/sign-up', '/profile']
}
