import React, { FC } from 'react'
import Link from 'next/link'

import { AiOutlineLogin, AiOutlineUserAdd } from 'react-icons/ai'
import Image from 'next/image'

export const navLinks = [
    {
        path: '/auth/sign-in',
        name: 'Sign In',
        Icon: AiOutlineLogin
    },
    {
        path: '/auth/sign-up',
        name: 'Sign Up',
        Icon: AiOutlineUserAdd
    }
]

interface HeaderProps {
    // lang: Locale
}

export const Header: FC<HeaderProps> = async () => {
    return (
        <nav className="flex items-center justify-between py-4 px-8 sm:px-16">
            <Link href="/">
                <Image src="/images/Logo.png" width={34} height={34} alt="logo" priority />
            </Link>

            <ul className="flex items-center justify-center text-primary-200 text-base font-normal gap-8">
                {navLinks.map(({ path, name, Icon }) => (
                    <li
                        key={path}
                        className="flex items-center justify-center gap-2 hover:cursor-pointer">
                        <Icon size={20} />
                        <Link href={path} className="text-sm tracking-wide hover:underline">
                            {name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
