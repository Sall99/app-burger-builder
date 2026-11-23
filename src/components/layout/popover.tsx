'use client'

import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
    Award,
    Bell,
    ChevronDown,
    HelpCircle,
    LogOut,
    Receipt,
    Shield,
    Truck,
    User
} from 'lucide-react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'

export default function PopoverProfil() {
    const t = useTranslations('Popover')
    const locale = useLocale()
    const isFr = locale === 'fr'
    const { data: session } = useSession()
    const userRole = (session?.user as any)?.role
    const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN'
    const userName = session?.user?.name || t('profile')
    const userInitial = (session?.user?.name?.[0] || session?.user?.email?.[0] || 'U').toUpperCase()

    const menuItems = [
        { name: t('profile'), href: `/${locale}/profile`, icon: User },
        { name: t('history'), href: `/${locale}/history`, icon: Receipt },
        { name: t('trackOrder'), href: `/${locale}/track-order`, icon: Truck },
        { name: isFr ? 'Fidélité' : 'Loyalty', href: `/${locale}/loyalty`, icon: Award },
        { name: 'Notifications', href: `/${locale}/notifications`, icon: Bell }
    ]

    return (
        <Popover className="relative">
            {({ open, close }) => (
                <>
                    <Popover.Button className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-white py-1 pl-1 pr-3 font-display text-[13px] font-bold text-ink transition-all hover:border-brand-300 hover:bg-brand-50/40 focus:outline-none">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white shadow-sm">
                            {userInitial}
                        </span>
                        <span className="max-w-[100px] truncate">{userName}</span>
                        <ChevronDown
                            size={13}
                            className={`text-ink-subtle transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
                            aria-hidden="true"
                        />
                    </Popover.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-150"
                        enterFrom="opacity-0 translate-y-1 scale-95"
                        enterTo="opacity-100 translate-y-0 scale-100"
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100 translate-y-0 scale-100"
                        leaveTo="opacity-0 translate-y-1 scale-95">
                        <Popover.Panel className="absolute right-0 z-50 mt-2 w-60 origin-top-right overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-elevated">
                            {session?.user?.email && (
                                <div className="border-b border-zinc-100 px-3.5 py-3">
                                    <p className="truncate text-xs font-semibold text-zinc-950">
                                        {session.user.name || 'Member'}
                                    </p>
                                    <p className="truncate text-[11px] text-zinc-500">
                                        {session.user.email}
                                    </p>
                                </div>
                            )}

                            <div className="p-1.5">
                                {menuItems.map((item) => {
                                    const Icon = item.icon
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => close()}
                                            className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition-colors">
                                            <Icon size={15} className="text-zinc-400" />
                                            <span>{item.name}</span>
                                        </Link>
                                    )
                                })}

                                {isAdmin && (
                                    <Link
                                        href={`/${locale}/admin`}
                                        onClick={() => close()}
                                        className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium text-orange-600 hover:bg-orange-50 transition-colors">
                                        <Shield size={15} />
                                        <span>{t('adminPanel') || 'Admin'}</span>
                                    </Link>
                                )}
                            </div>

                            <div className="border-t border-zinc-100 p-1.5 space-y-0.5">
                                <Link
                                    href={`/${locale}/help`}
                                    onClick={() => close()}
                                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
                                    <HelpCircle size={14} />
                                    <span>{t('help')}</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => signOut({ callbackUrl: `/${locale}` })}
                                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
                                    <LogOut size={14} />
                                    <span>{t('logout')}</span>
                                </button>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}
