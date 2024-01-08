'use client'
import React, { FC } from 'react'
import Link from 'next/link'
import { User } from 'lucide-react'

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

export const Header = async () => {
    const [isOpened, setIsOpened] = React.useState(false)

    const isAuth = false

    return (
        <nav className="flex items-center justify-between py-4 px-8 sm:px-16">
            <Link href="/">
                <Image src="/images/Logo.png" width={34} height={34} alt="logo" priority />
            </Link>

            <div>
                {isAuth ? (
                    <div>
                        <div className="flex gap-2">
                            <User className="text-primary-200 hover:cursor-pointer" />
                            <p>
                                <Link
                                    className="text-sm tracking-wide hover:underline text-primary-200"
                                    href="/profile">
                                    Profile
                                </Link>
                            </p>
                        </div>
                    </div>
                ) : (
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
                )}
                {/* <LocaleSwitcher /> */}
            </div>
        </nav>
    )
}
