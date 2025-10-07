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
        <div className="header-container">
            <div className="header-content">
                <Link href="/" className="header-logo">
                    <Image src="/images/Logo.png" width={40} height={40} alt="logo" priority />
                </Link>

                {/* Main Navigation Links */}
                <ul className="header-nav">
                    {mainNavLinks.map(({ path, name, Icon }) => (
                        <li key={path} className="header-nav-item">
                            <Link href={path} className="header-nav-link">
                                <Icon className="header-nav-icon" />
                                <span>{t(name)}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="header-actions">
                    <LocaleSwitcher />
                    <div className="header-auth">
                        {session ? (
                            <PopoverProfilLazy />
                        ) : (
                            <ul className="header-auth-links">
                                {authNavLinks.map(({ path, name, Icon }) => (
                                    <li key={path} className="header-auth-item">
                                        <Link href={path} className="header-auth-link">
                                            <Icon className="header-auth-icon" />
                                            <span>{t(name)}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
