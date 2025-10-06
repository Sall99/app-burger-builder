'use client'

import React, { FC } from 'react'
import { AiOutlineLogin, AiOutlineUserAdd } from 'react-icons/ai'
import { BiMap } from 'react-icons/bi'
import { BiBell } from 'react-icons/bi'
import { MdCardGiftcard } from 'react-icons/md'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import LocaleSwitcher from '../ui/local-switcher'

import PopoverProfilLazy from './popover-lazy'

export const mainNavLinks = [
    {
        path: '/loyalty',
        name: 'loyalty',
        Icon: MdCardGiftcard
    },
    {
        path: '/locations',
        name: 'locations',
        Icon: BiMap
    },
    {
        path: '/notifications',
        name: 'notifications',
        Icon: BiBell
    }
]

export const authNavLinks = [
    {
        path: '/auth/sign-in',
        name: 'signIn',
        Icon: AiOutlineLogin
    },
    {
        path: '/auth/sign-up',
        name: 'signUp',
        Icon: AiOutlineUserAdd
    }
]

interface HeaderProps {
    session: any
}

export const Header: FC<HeaderProps> = ({ session }) => {
    const t = useTranslations('Header')

    return (
        <nav className="flex items-center justify-between py-4 px-8 sm:px-16">
            <Link href="/">
                <Image src="/images/Logo.png" width={34} height={34} alt="logo" priority />
            </Link>

            {/* Main Navigation Links */}
            <ul className="hidden md:flex items-center justify-center text-primary-200 text-base font-normal gap-6">
                {mainNavLinks.map(({ path, name, Icon }) => (
                    <li key={path} className="hover:cursor-pointer">
                        <Link
                            href={path}
                            className="flex items-center justify-center gap-2 text-sm tracking-wide hover:underline">
                            <Icon size={18} />
                            <span>{t(name)}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="flex gap-4 items-center">
                <LocaleSwitcher />
                <div>
                    {session ? (
                        <div>
                            <PopoverProfilLazy />
                        </div>
                    ) : (
                        <ul className="flex items-center justify-center text-primary-200 text-base font-normal gap-8">
                            {authNavLinks.map(({ path, name, Icon }) => (
                                <li key={path} className="hover:cursor-pointer">
                                    <Link
                                        href={path}
                                        className="flex items-center justify-center gap-2 text-sm tracking-wide hover:underline">
                                        <Icon size={20} />
                                        <span>{t(name)}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    )
}
