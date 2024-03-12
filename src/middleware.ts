// middleware.js

import { NextResponse } from 'next/server'

export default function middleware(req) {
    let loggedin = req.cookies.token // Access cookies directly without get() method
    const { pathname } = new URL(req.url, 'http://localhost') // Parse URL using URL class

    if (loggedin && pathname === '/signin') {
        return NextResponse.redirect('/')
    }

    if (!loggedin && pathname !== '/signin') {
        return NextResponse.redirect('/signin')
    }
}

export const config = {
    // Use a regular expression matcher to apply the middleware to all routes except api, static, files with extensions, and _next
    matcher: '/((?!api|static|.*\\..*|_next).*)'
}
