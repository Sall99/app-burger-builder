'use client'
import { FC, ReactNode, createContext, useContext, useState } from 'react'

interface SidebarContextType {
    setClickedLink: (name: string) => void
    clickedLink: string | null
}

interface SidebarProviderProps {
    children: ReactNode
}

const SidebarContext = createContext<SidebarContextType>({
    setClickedLink: () => {},
    clickedLink: null
})

export const useSidebar = () => useContext(SidebarContext)

export const SidebarProvider: FC<SidebarProviderProps> = ({ children }) => {
    const [clickedLink, setClickedLink] = useState<string | null>(null)

    return (
        <SidebarContext.Provider value={{ setClickedLink, clickedLink }}>
            {children}
        </SidebarContext.Provider>
    )
}
