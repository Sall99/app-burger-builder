'use client'

import React, { Fragment, useState, useTransition } from 'react'
import { BiWorld } from 'react-icons/bi'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

const locales = [
    { name: 'en', label: 'English', flag: '🇬🇧' },
    { name: 'fr', label: 'Français', flag: '🇫🇷' }
]

const LocaleSwitcher = () => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const localActive = useLocale()
    const currentLocale = locales.find((l) => l.name === localActive) || locales[0]

    const handleLocaleChange = (locale: string, close: () => void) => {
        startTransition(() => {
            router.replace(`/${locale}`)
            close()
        })
    }

    return (
        <Popover className="locale-switcher-wrapper">
            {({ open, close }) => (
                <>
                    <Popover.Button className="locale-switcher-button" disabled={isPending}>
                        <BiWorld className="locale-switcher-button-icon" />
                        <span className="locale-switcher-button-text">{currentLocale.label}</span>
                        <ChevronDownIcon
                            className={`locale-switcher-chevron ${open ? 'locale-switcher-chevron-open' : ''}`}
                        />
                    </Popover.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1">
                        <Popover.Panel className="locale-dropdown-panel">
                            <div className="locale-dropdown-container">
                                {locales.map((locale) => (
                                    <button
                                        key={locale.name}
                                        onClick={() => handleLocaleChange(locale.name, close)}
                                        className={`locale-dropdown-item ${
                                            locale.name === localActive
                                                ? 'locale-dropdown-item-active'
                                                : ''
                                        }`}
                                        disabled={isPending}>
                                        <span className="locale-dropdown-flag">{locale.flag}</span>
                                        <span className="locale-dropdown-label">
                                            {locale.label}
                                        </span>
                                        {locale.name === localActive && (
                                            <span className="locale-dropdown-check">✓</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}

export default LocaleSwitcher
