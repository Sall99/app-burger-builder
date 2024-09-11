'use client';
import React, { FC } from 'react';
import { AiOutlineLogin, AiOutlineUserAdd } from 'react-icons/ai';
import { User as UserICON } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';


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
];

interface HeaderProps {
    session: any
}

export const Header: FC<HeaderProps> = ({ session }) => {
    console.log('session', session);

    // if (session === null) {
    //     return (
    //         <div className="flex justify-center items-center h-screen bg-white z-50 absolute inset-y-0 w-screen">
    //             <div className="animate-bounce">
    //                 <Image src="/images/Logo.png" width={34} height={34} alt="logo" priority />
    //             </div>
    //         </div>
    //     )
    // }

    return (
        <nav className="flex items-center justify-between py-4 px-8 sm:px-16">
            <Link href="/">
                <Image src="/images/Logo.png" width={34} height={34} alt="logo" priority />
            </Link>

            <div>
                {session ? (
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
    );
};
