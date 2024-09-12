'use client'
import React from 'react'
import { SessionProvider } from 'next-auth/react'

interface SessionWrapperProps {
    children: React.ReactNode
}

export const SessionWrapper = ({ children }: SessionWrapperProps) => {
    return <SessionProvider>{children}</SessionProvider>
}
