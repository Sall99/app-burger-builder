import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createMiddleware from 'next-intl/middleware';

import { localePrefix,locales, pathnames } from './config/index';

const protectedPaths = ['/profile', '/orders', '/checkout', '/payment-confirm'];
const adminPaths = ['/admin'];

export async function middleware(req: NextRequest) {
    const { pathname, origin } = req.nextUrl;

    const localeMatch = pathname.match(/^\/(en|fr)(\/|$)/);
    const locale = localeMatch ? localeMatch[1] : null;

    const basePath = pathname.replace(/^\/(en|fr)/, '');
    const isProtectedRoute = protectedPaths.some((path) => basePath.startsWith(path));
    const isAdminRoute = adminPaths.some((path) => basePath.startsWith(path));

    if (isAdminRoute) {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            const redirectUrl = locale
                ? `${origin}/${locale}/auth/sign-in`
                : `${origin}/auth/sign-in`;
            return NextResponse.redirect(redirectUrl);
        }

        const role = token.role as string;
        if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
            const redirectUrl = locale ? `${origin}/${locale}` : origin;
            return NextResponse.redirect(redirectUrl);
        }
    }

    if (isProtectedRoute) {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            const redirectUrl = locale
                ? `${origin}/${locale}/auth/sign-in`
                : `${origin}/auth/sign-in`;
            return NextResponse.redirect(redirectUrl);
        }
    }

    return createMiddleware({
        defaultLocale: 'en',
        locales,
        pathnames,
        localePrefix
    })(req);
}

export const config = {
    matcher: [
            '/',
        '/(en|fr)/:path*',
        '/((?!api|_next|_vercel|.*\\..*).*)'
    ]
};
