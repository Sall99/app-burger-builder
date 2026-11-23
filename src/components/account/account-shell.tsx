'use client'

import React from 'react'
import {
    Award,
    Bell,
    LogOut,
    Plus,
    Receipt,
    Shield,
    Truck,
    User
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useLocale } from 'next-intl'
import useSWR from 'swr'

import { getUserStats } from '@/actions/users'
import { totalFormatter } from '@/utils/utils'

interface AccountShellProps {
    title: string
    subtitle?: string
    action?: React.ReactNode
    children: React.ReactNode
}

export const AccountShell: React.FC<AccountShellProps> = ({
    title,
    subtitle,
    action,
    children
}) => {
    const { data: session, status } = useSession()
    const locale = useLocale()
    const isFr = locale === 'fr'
    const pathname = usePathname()

    const { data: statsData } = useSWR(session ? ['userStats'] : null, getUserStats, {
        revalidateOnFocus: false
    })

    if (status !== 'loading' && !session) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-surface-border pb-6">
                    <div>
                        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                            {title}
                        </h1>
                        {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
                    </div>
                    {action}
                </div>
                {children}
            </div>
        )
    }

    const userName = statsData?.user?.name || session?.user?.name || (isFr ? 'Membre' : 'Member')
    const userEmail = statsData?.user?.email || session?.user?.email || ''
    const userInitial = (userName?.[0] || userEmail?.[0] || 'U').toUpperCase()
    const userRole = (session?.user as any)?.role
    const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN'
    const totalOrders = statsData?.stats?.totalOrders
    const totalSpent = statsData?.stats?.totalSpent

    const navItems = [
        { href: `/${locale}/profile`, label: isFr ? 'Profil' : 'Profile', icon: User },
        {
            href: `/${locale}/history`,
            label: isFr ? 'Commandes' : 'Orders',
            icon: Receipt,
            badge: typeof totalOrders === 'number' ? totalOrders : undefined
        },
        { href: `/${locale}/track-order`, label: isFr ? 'Suivi' : 'Track Order', icon: Truck },
        { href: `/${locale}/loyalty`, label: isFr ? 'Fidélité' : 'Loyalty', icon: Award },
        { href: `/${locale}/notifications`, label: 'Notifications', icon: Bell }
    ]

    const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`)

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
            {/* Top Member Header */}
            <div className="flex flex-col gap-4 border-b border-surface-border pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink text-sm font-bold text-white">
                        {userInitial}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="truncate font-display text-base font-bold tracking-tight text-ink">
                                {userName}
                            </p>
                            {isAdmin && (
                                <Link
                                    href={`/${locale}/admin`}
                                    className="inline-flex items-center gap-1 rounded-md border border-surface-border bg-surface px-2 py-0.5 text-[10px] font-semibold text-ink hover:bg-surface-muted">
                                    <Shield size={10} />
                                    Admin
                                </Link>
                            )}
                        </div>
                        <p className="truncate text-xs text-ink-muted">
                            {userEmail}
                            {typeof totalOrders === 'number' && (
                                <span className="ml-2 tabular-nums text-ink-subtle">
                                    · {totalOrders} {isFr ? 'cmd' : 'orders'} ·{' '}
                                    {totalFormatter.format(totalSpent || 0)}
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                <Link
                    href={`/${locale}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-charcoal-light transition-colors">
                    <Plus size={14} />
                    <span>{isFr ? 'Nouveau burger' : 'New Burger'}</span>
                </Link>
            </div>

            {/* Mobile Horizontal Tabs */}
            <nav aria-label="Account sections" className="flex lg:hidden gap-1.5 overflow-x-auto pb-1">
                {navItems.map(({ href, label, icon: Icon, badge }) => {
                    const active = isActive(href)
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                active
                                    ? 'bg-ink text-white'
                                    : 'border border-surface-border bg-white text-ink-muted hover:text-ink'
                            }`}>
                            <Icon size={13} />
                            <span>{label}</span>
                            {badge !== undefined && badge > 0 && (
                                <span className="tabular-nums text-[10px] opacity-80">({badge})</span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* 2-Column Workspace */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[210px_1fr] items-start">
                <aside className="hidden lg:block lg:sticky lg:top-24 space-y-1">
                    <nav aria-label="Account navigation" className="space-y-0.5">
                        {navItems.map(({ href, label, icon: Icon, badge }) => {
                            const active = isActive(href)
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                        active
                                            ? 'bg-white text-ink font-semibold border border-surface-border'
                                            : 'text-ink-muted hover:bg-white/60 hover:text-ink'
                                    }`}>
                                    <span className="flex items-center gap-2.5">
                                        <Icon
                                            size={15}
                                            className={active ? 'text-ink' : 'text-ink-subtle'}
                                        />
                                        <span>{label}</span>
                                    </span>
                                    {badge !== undefined && badge > 0 && (
                                        <span className="rounded-md bg-surface px-1.5 py-0.5 tabular-nums text-[11px] font-semibold text-ink">
                                            {badge}
                                        </span>
                                    )}
                                </Link>
                            )
                        })}

                        {isAdmin && (
                            <Link
                                href={`/${locale}/admin`}
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-muted hover:bg-white/60 hover:text-ink transition-colors">
                                <Shield size={15} />
                                <span>{isFr ? 'Administration' : 'Admin'}</span>
                            </Link>
                        )}
                    </nav>

                    <div className="pt-3 mt-3 border-t border-surface-border">
                        <button
                            type="button"
                            onClick={() => signOut({ callbackUrl: `/${locale}` })}
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-muted hover:bg-red-50 hover:text-red-600 transition-colors">
                            <LogOut size={15} />
                            <span>{isFr ? 'Déconnexion' : 'Sign Out'}</span>
                        </button>
                    </div>
                </aside>

                {/* Main Panel */}
                <div className="min-w-0 space-y-6">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
                                {title}
                            </h1>
                            {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
                        </div>
                        {action}
                    </div>

                    {children}
                </div>
            </div>
        </div>
    )
}
