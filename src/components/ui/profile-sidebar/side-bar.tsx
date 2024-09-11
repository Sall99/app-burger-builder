'use client';
import React, { FC } from 'react';
import clsx from 'clsx';
import { HelpCircleIcon, History, LogOut, Pencil } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

import { useSidebar } from '../../../../context';

interface Link {
    Icon: JSX.Element
    name: string
}

const links: Link[] = [
    {
        Icon: <Pencil size={17} />,
        name: 'Profile'
    },
    {
        Icon: <History size={17} />,
        name: 'History'
    },
    {
        Icon: <HelpCircleIcon size={17} />,
        name: 'Help'
    }
];

export const ProfileSideBar: FC = () => {
    const { setClickedLink, clickedLink } = useSidebar();

    const handleLogout = () => {
        signOut({ callbackUrl: '/auth/sign-in' });
    };

    return (
        <div className="w-52 h-screen fixed pl-16 bg-slate-200 pt-4 top-0">
            <Link href="/">
                <Image src="/images/Logo.png" width={34} height={34} alt="logo" priority />
            </Link>
            <div className="mt-9">
                <ul className="flex gap-9 flex-col mt-_52">
                    {links.map(({ name, Icon }, key) => (
                        <p
                            className={clsx(
                                'flex gap-4 items-center hover:cursor-pointer text-primary-200 hover:underline',
                                clickedLink === name ? 'underline' : ''
                            )}
                            key={key}
                            onClick={() => setClickedLink(name)}>
                            <span>{name}</span>
                        </p>
                    ))}
                    <li
                        className="hover:underline hover:cursor-pointer text-primary-200"
                        onClick={handleLogout}>
                        <LogOut />
                        <p>Log out</p>
                    </li>
                </ul>
            </div>
        </div>
    );
};
