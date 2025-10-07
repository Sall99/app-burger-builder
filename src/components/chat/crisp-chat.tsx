'use client'

import { useEffect } from 'react'

declare global {
    interface Window {
        $crisp: any[]
        CRISP_WEBSITE_ID: string
    }
}

interface CrispChatProps {
    websiteId: string
}

export const CrispChat: React.FC<CrispChatProps> = ({ websiteId }) => {
    useEffect(() => {
        if (typeof window === 'undefined') return

        window.$crisp = []
        window.CRISP_WEBSITE_ID = websiteId

        const script = document.createElement('script')
        script.src = 'https://client.crisp.chat/l.js'
        script.async = true
        document.head.appendChild(script)

        return () => {
            if (window.$crisp) {
                window.$crisp.push(['do', 'chat:hide'])
            }
            document.head.removeChild(script)
        }
    }, [websiteId])

    return null
}

interface CrispChatWithUserProps extends CrispChatProps {
    userEmail?: string
    userName?: string
    userPhone?: string
}

export const CrispChatWithUser: React.FC<CrispChatWithUserProps> = ({
    websiteId,
    userEmail,
    userName,
    userPhone
}) => {
    useEffect(() => {
        if (typeof window === 'undefined' || !window.$crisp) return

        if (userEmail) {
            window.$crisp.push(['set', 'user:email', [userEmail]])
        }
        if (userName) {
            window.$crisp.push(['set', 'user:nickname', [userName]])
        }
        if (userPhone) {
            window.$crisp.push(['set', 'user:phone', [userPhone]])
        }
    }, [userEmail, userName, userPhone])

    return <CrispChat websiteId={websiteId} />
}

export const crispHelpers = {
    open: () => {
        if (typeof window !== 'undefined' && window.$crisp) {
            window.$crisp.push(['do', 'chat:open'])
        }
    },

    close: () => {
        if (typeof window !== 'undefined' && window.$crisp) {
            window.$crisp.push(['do', 'chat:close'])
        }
    },

    show: () => {
        if (typeof window !== 'undefined' && window.$crisp) {
            window.$crisp.push(['do', 'chat:show'])
        }
    },

    hide: () => {
        if (typeof window !== 'undefined' && window.$crisp) {
            window.$crisp.push(['do', 'chat:hide'])
        }
    },

    sendMessage: (message: string) => {
        if (typeof window !== 'undefined' && window.$crisp) {
            window.$crisp.push(['do', 'message:send', ['text', message]])
        }
    },

    setUserEmail: (email: string) => {
        if (typeof window !== 'undefined' && window.$crisp) {
            window.$crisp.push(['set', 'user:email', [email]])
        }
    },

    setUserName: (name: string) => {
        if (typeof window !== 'undefined' && window.$crisp) {
            window.$crisp.push(['set', 'user:nickname', [name]])
        }
    },

    setCustomData: (key: string, value: string) => {
        if (typeof window !== 'undefined' && window.$crisp) {
            window.$crisp.push(['set', 'session:data', [[key, value]]])
        }
    }
}
