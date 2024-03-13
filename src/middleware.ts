import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

export default function middleware(req: NextApiRequest) {
    let loggedin = req.cookies.token
    const { pathname } = new URL(req.url ?? 'http://localhost')

    if (loggedin && pathname === '/signin') {
        return NextResponse.redirect('/')
    }

    if (!loggedin && pathname !== '/signin') {
        return NextResponse.redirect('/signin')
    }
}

export const config = {
    matcher: '/((?!api|static|.*\\..*|_next).*)'
}
