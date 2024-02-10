'use client'
import React, { FC } from 'react'
import { HelpCircleIcon, History, Pencil } from 'lucide-react'
import { useSidebar } from '../../../../context'
import Link from 'next/link'
import Image from 'next/image'

interface Link {
    Icon: JSX.Element
    name: string
}

const links: Link[] = [
    {
        Icon: <Pencil size={17} />,
        name: 'Edit profile'
    },
    {
        Icon: <History size={17} />,
        name: 'History'
    },
    {
        Icon: <HelpCircleIcon size={17} />,
        name: 'Help'
    }
]

export const SideBar: FC = () => {
    const { setClickedLink, clickedLink } = useSidebar()

    return (
        <div className="w-52 h-screen fixed pl-16 bg-slate-200 pt-4 top-0">
            <Link href="/">
                <Image src="/images/Logo.png" width={34} height={34} alt="logo" priority />
            </Link>
            <div className="mt-8">
                <ul className="flex gap-9 flex-col">
                    {links.map(({ name, Icon }, key) => (
                        <p
                            className="flex gap-4 items-center hover:cursor-pointer text-sm text-primary-200 hover:underline"
                            key={key}
                            onClick={() => setClickedLink(name)}>
                            <span>{Icon}</span>
                            <span>{name}</span>
                        </p>
                    ))}
                </ul>
            </div>
        </div>
    )
}
