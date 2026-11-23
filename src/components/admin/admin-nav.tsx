'use client'

import { BarChart3, ShoppingCart, Ticket, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

export function AdminNav() {
    const pathname = usePathname()
    const locale = useLocale()
    const t = useTranslations('Admin')

    const links = [
        {
            href: `/${locale}/admin`,
            label: t('dashboard'),
            icon: BarChart3,
            exact: true
        },
        {
            href: `/${locale}/admin/orders`,
            label: t('orders'),
            icon: ShoppingCart
        },
        {
            href: `/${locale}/admin/users`,
            label: t('users'),
            icon: Users
        },
        {
            href: `/${locale}/admin/coupons`,
            label: t('coupons'),
            icon: Ticket
        }
    ]

    const isActive = (href: string, exact?: boolean) => {
        if (exact) {
            return pathname === href || pathname === '/admin'
        }
        return pathname.startsWith(href)
    }

    return (
        <nav
            aria-label="Admin navigation"
            className="flex lg:flex-col gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {links.map((link) => {
                const Icon = link.icon
                const active = isActive(link.href, link.exact)

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                            active
                                ? 'bg-ink text-white font-semibold'
                                : 'border border-surface-border lg:border-transparent bg-white lg:bg-transparent text-ink-muted hover:bg-white hover:text-ink'
                        }`}>
                        <Icon
                            className={`h-4 w-4 shrink-0 ${
                                active ? 'text-white' : 'text-ink-subtle'
                            }`}
                        />
                        <span>{link.label}</span>
                    </Link>
                )
            })}
        </nav>
    )
}
