'use client'

import React, { Fragment, useTransition } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

const locales = [
    { name: 'en', short: 'EN', label: 'English' },
    { name: 'fr', short: 'FR', label: 'Français' }
]

const LocaleSwitcher = () => {
    const router = useRouter()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()
    const localActive = useLocale()
    const currentLocale = locales.find((l) => l.name === localActive) || locales[0]

    const handleLocaleChange = (locale: string, close: () => void) => {
        startTransition(() => {
            const nextPath = pathname?.replace(/^\/(en|fr)(?=\/|$)/, `/${locale}`) || `/${locale}`
            router.replace(nextPath)
            close()
        })
    }

    return (
        <Popover className="relative">
            {({ open, close }) => (
                <>
                    <Popover.Button
                        disabled={isPending}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus:outline-none disabled:opacity-50"
                        aria-label="Change language">
                        <Globe size={14} className="text-zinc-400" />
                        <span>{currentLocale.short}</span>
                        <ChevronDown
                            size={12}
                            className={`text-zinc-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
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
                        <Popover.Panel className="absolute right-0 z-50 mt-2 w-40 origin-top-right overflow-hidden rounded-xl border border-zinc-200 bg-white p-1 shadow-elevated">
                            {locales.map((locale) => {
                                const isActive = locale.name === localActive
                                return (
                                    <button
                                        key={locale.name}
                                        type="button"
                                        onClick={() => handleLocaleChange(locale.name, close)}
                                        disabled={isPending}
                                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                                            isActive
                                                ? 'bg-zinc-100 text-zinc-950 font-semibold'
                                                : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950'
                                        }`}>
                                        <span>{locale.label}</span>
                                        {isActive && <Check size={13} className="text-zinc-950" />}
                                    </button>
                                )
                            })}
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}

export default LocaleSwitcher
