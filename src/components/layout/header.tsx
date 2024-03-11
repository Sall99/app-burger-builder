'use client'
import React, { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import { User as UserICON } from 'lucide-react'

import { AiOutlineLogin, AiOutlineUserAdd } from 'react-icons/ai'
import Image from 'next/image'
import { SafeUser } from '@/types'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '@/redux/slices/currentUser'
import { getSession } from 'next-auth/react'

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
    currentUser?: SafeUser | null | undefined
}

export const Header: FC<HeaderProps> = ({ currentUser }) => {
    const [isAuth, setIsAuth] = useState<boolean | null>(null)
    const dispatch = useDispatch()

    useEffect(() => {
        if (currentUser) {
            dispatch(setCurrentUser(currentUser))
            setIsAuth(true)
        } else {
            setIsAuth(false)
        }
    }, [currentUser])

    if (isAuth === null) {
        return (
            <div className="flex justify-center items-center h-screen bg-white z-50 absolute inset-y-0 w-screen">
                <div className="animate-bounce">
                    <Image src="/images/Logo.png" width={34} height={34} alt="logo" priority />
                </div>
            </div>
        )
    }

    return (
        <nav className="flex items-center justify-between py-4 px-8 sm:px-16">
            <Link href="/">
                <Image src="/images/Logo.png" width={34} height={34} alt="logo" priority />
            </Link>

            <div>
                {isAuth ? (
                    <div>
                        <div>
                            <Link
                                className="text-sm tracking-wide hover:underline text-primary-200 flex gap-2 items-center"
                                href="/profile">
                                <UserICON className="text-primary-200 hover:cursor-pointer" />
                                <span> Profile</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <ul className="flex items-center justify-center text-primary-200 text-base font-normal gap-8">
                        {navLinks.map(({ path, name, Icon }) => (
                            <li key={path} className="hover:cursor-pointer">
                                <Link
                                    href={path}
                                    className="flex items-center justify-center gap-2 text-sm tracking-wide hover:underline">
                                    <Icon size={20} />
                                    <span>{name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </nav>
    )
}
