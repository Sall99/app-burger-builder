'use client'

import Link from 'next/link'

interface SkipLinkProps {
    text?: string
}

export const SkipLink = ({ text = 'Skip to main content' }: SkipLinkProps) => {
    return (
        <Link
            href="#main-content"
            className="skip-link absolute left-0 top-0 -translate-y-full focus:translate-y-0 z-50 bg-primary-200 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-transform">
            {text}
        </Link>
    )
}
