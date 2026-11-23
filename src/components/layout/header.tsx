'use client'

import React, { useState } from 'react'
import {
    Award,
    Bell,
    ChefHat,
    Flame,
    HelpCircle,
    History,
    LogIn,
    LogOut,
    MapPin,
    Menu,
    Package,
    User,
    UserPlus,
    X
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'

import LocaleSwitcher from '../ui/local-switcher/locale-switcher'

import PopoverProfil from './popover'

export const Header = ({ session }: { session: Session | null }) => {
    const t = useTranslations('Header')
    const tp = useTranslations('Popover')
    const locale = useLocale()
    const isFr = locale === 'fr'
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const isActive = (path: string) =>
        pathname === `/${locale}${path}` || pathname?.startsWith(`/${locale}${path}/`)

    const navLinks = [
        { href: `/${locale}/loyalty`, label: t('loyalty'), icon: Award, path: '/loyalty' },
        { href: `/${locale}/locations`, label: t('locations'), icon: MapPin, path: '/locations' },
        {
            href: `/${locale}/notifications`,
            label: t('notifications'),
            icon: Bell,
            path: '/notifications'
        },
        { href: `/${locale}/help`, label: tp('help'), icon: HelpCircle, path: '/help' }
    ]

    return (
        <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-white/95 backdrop-blur-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
                {/* Left: Brand + Primary Nav */}
                <div className="flex items-center gap-8">
                    <Link
                        href={`/${locale}`}
                        className="flex items-center gap-2.5 focus:outline-none">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
                            <Flame size={17} strokeWidth={2.25} aria-hidden="true" />
                        </span>
                        <span className="font-display text-lg font-bold tracking-tight text-ink">
                            BurgerBuilder
                        </span>
                    </Link>

                    <nav
                        aria-label="Primary navigation"
                        className="hidden lg:flex items-center gap-1">
                        {navLinks.map(({ href, label, path }) => {
                            const active = isActive(path)
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                                        active
                                            ? 'bg-surface text-ink font-semibold'
                                            : 'text-ink-muted hover:text-ink hover:bg-surface/60'
                                    }`}>
                                    {label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                {/* Right: Assistant + Locale + Auth */}
                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => window.dispatchEvent(new CustomEvent('burger-ai:open'))}
                        className="inline-flex items-center gap-2 rounded-lg border border-surface-border bg-surface/70 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface transition-colors">
                        <ChefHat size={14} className="text-brand-500" />
                        <span>{isFr ? 'Assistant Sall' : 'Ask Sall'}</span>
                    </button>

                    <div className="hidden sm:block">
                        <LocaleSwitcher />
                    </div>

                    {session ? (
                        <div className="hidden sm:block">
                            <PopoverProfil />
                        </div>
                    ) : (
                        <div className="hidden sm:flex items-center gap-2">
                            <Link
                                href={`/${locale}/auth/sign-in`}
                                className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-ink-muted hover:text-ink transition-colors">
                                {t('signIn')}
                            </Link>
                            <Link
                                href={`/${locale}/auth/sign-up`}
                                className="rounded-lg bg-ink px-4 py-1.5 text-sm font-semibold text-white hover:bg-charcoal-light transition-colors">
                                {t('signUp')}
                            </Link>
                        </div>
                    )}

                    {/* Mobile Hamburger */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((v) => !v)}
                        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={mobileMenuOpen}
                        className="inline-flex lg:hidden h-9 w-9 items-center justify-center rounded-lg border border-surface-border bg-white text-ink hover:bg-surface transition-colors">
                        {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-surface-border bg-white px-4 pb-5 pt-3">
                    <div className="space-y-1">
                        {navLinks.map(({ href, label, icon: Icon, path }) => {
                            const active = isActive(path)
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                        active
                                            ? 'bg-surface text-ink font-semibold'
                                            : 'text-ink-muted hover:bg-surface hover:text-ink'
                                    }`}>
                                    <Icon size={16} />
                                    <span>{label}</span>
                                </Link>
                            )
                        })}
                    </div>

                    <div className="mt-4 border-t border-surface-border pt-4 space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-xs font-medium text-ink-subtle">
                                {isFr ? 'Langue' : 'Language'}
                            </span>
                            <LocaleSwitcher />
                        </div>

                        {session ? (
                            <div className="space-y-1">
                                <div className="mb-2 flex items-center gap-3 rounded-xl bg-surface p-3 border border-surface-border">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-xs font-bold text-white">
                                        {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-ink">
                                            {session.user?.name}
                                        </p>
                                        <p className="truncate text-xs text-ink-muted">
                                            {session.user?.email}
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href={`/${locale}/profile`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-surface">
                                    <User size={16} />
                                    <span>{tp('profile')}</span>
                                </Link>
                                <Link
                                    href={`/${locale}/history`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-surface">
                                    <History size={16} />
                                    <span>{tp('history')}</span>
                                </Link>
                                <Link
                                    href={`/${locale}/track-order`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-surface">
                                    <Package size={16} />
                                    <span>{tp('trackOrder')}</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMobileMenuOpen(false)
                                        signOut()
                                    }}
                                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                                    <LogOut size={16} />
                                    <span>{tp('logout')}</span>
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                <Link
                                    href={`/${locale}/auth/sign-in`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-1.5 rounded-lg border border-surface-border bg-white px-4 py-2 text-sm font-semibold text-ink">
                                    <LogIn size={15} />
                                    <span>{t('signIn')}</span>
                                </Link>
                                <Link
                                    href={`/${locale}/auth/sign-up`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white">
                                    <UserPlus size={15} />
                                    <span>{t('signUp')}</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
