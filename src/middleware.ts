import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

let defaultLocale = 'en';
let locales = ['en', 'fr'];

// Get the preferred locale, similar to above or using a library
export function getLocale(request: NextRequest) {
  const storedLocale = request.cookies.get('NEXT_LOCALE')?.value ?? undefined;

  if (storedLocale && locales.includes(storedLocale)) {
    return storedLocale;
  }

  const acceptedLanguage = request.headers.get('accept-language') ?? undefined;
  let headers = { 'accept-language': acceptedLanguage };
  let languages = new Negotiator({ headers }).languages();

  const preferredLocale = match(languages, locales, defaultLocale);
  console.log('Preferred Locale:', preferredLocale);

  return preferredLocale;
}

export function middleware(request: NextRequest) {
  // // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname;

  console.log('Pathname:', pathname);
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const storedLocale = request.cookies.get('NEXT_LOCALE')?.value ?? undefined;

    // If the stored locale is valid, update the URL with the chosen language
    if (storedLocale && locales.includes(storedLocale)) {
      const updatedUrl = new URL(`/${storedLocale}${pathname}`, request.url);

      // Log the updated URL for debugging
      console.log('Updated URL:', updatedUrl.href);

      return NextResponse.redirect(updatedUrl);
    }
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, assets, api)
    '/((?!api|assets|.*\\..*|_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
};
