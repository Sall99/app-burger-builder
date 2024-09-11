import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createMiddleware from 'next-intl/middleware';

import { localePrefix,locales, pathnames } from './config/index';

const protectedPaths = ['/profile', '/orders', '/checkout', '/payment-confirm'];

export async function middleware(req: NextRequest) {
    const { pathname, origin } = req.nextUrl;

    const localeMatch = pathname.match(/^\/(en|fr)(\/|$)/);
    const locale = localeMatch ? localeMatch[1] : null;

    const basePath = pathname.replace(/^\/(en|fr)/, '');
    const isProtectedRoute = protectedPaths.some((path) => basePath.startsWith(path));

    // If the path is protected, check authentication
    if (isProtectedRoute) {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        // If the user is not authenticated, redirect to the login page with the current locale
        if (!token) {
            const redirectUrl = locale
                ? `${origin}/${locale}/auth/sign-in`
                : `${origin}/auth/sign-in`;
            return NextResponse.redirect(redirectUrl);
        }
    }

    // Continue with locale middleware handling
    return createMiddleware({
        defaultLocale: 'en',
        locales,
        pathnames,
        localePrefix
    })(req);
}

export const config = {
    matcher: [
        '/', // Redirect to a matching locale at the root
        '/(en|fr)/:path*', // Handle locale prefixes
        '/((?!api|_next|_vercel|.*\\..*).*)' // Handle non-API, non-static paths
    ]
};
