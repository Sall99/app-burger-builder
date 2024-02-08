'use client'
import React, { FC } from 'react'
import { HelpCircleIcon, History, Pencil } from 'lucide-react'
import { useSidebar } from '../../../../context'

interface Link {
    Icon: JSX.Element
    name: string
}

const links: Link[] = [
    {
        Icon: <Pencil size={20} />,
        name: 'Edit profile'
    },
    {
        Icon: <History size={20} />,
        name: 'History'
    },
    {
        Icon: <HelpCircleIcon size={20} />,
        name: 'Help'
    }
]

export const SideBar: FC = () => {
    const { setClickedLink, clickedLink } = useSidebar()

    return (
        <div className="w-52 h-screen fixed pl-16">
            <div className="mt-8">
                <ul className="flex gap-9 flex-col">
                    {links.map(({ name, Icon }, key) => (
                        <p
                            className="flex gap-4 items-center"
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
