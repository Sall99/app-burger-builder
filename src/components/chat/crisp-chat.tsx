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

/**
 * Crisp Live Chat Component
 * Integrates Crisp.chat for real-time customer support
 *
 * Features:
 * - Live chat widget
 * - Email capture
 * - Chat history
 * - Mobile responsive
 * - Customizable appearance
 */
export const CrispChat: React.FC<CrispChatProps> = ({ websiteId }) => {
    useEffect(() => {
        // Only load in browser
        if (typeof window === 'undefined') return

        // Set Crisp website ID
        window.$crisp = []
        window.CRISP_WEBSITE_ID = websiteId

        // Load Crisp script
        const script = document.createElement('script')
        script.src = 'https://client.crisp.chat/l.js'
        script.async = true
        document.head.appendChild(script)

        // Cleanup function
        return () => {
            // Remove Crisp when component unmounts
            if (window.$crisp) {
                window.$crisp.push(['do', 'chat:hide'])
            }
            document.head.removeChild(script)
        }
    }, [websiteId])

    return null // This component doesn't render anything visible
}

/**
 * Crisp Chat with User Data
 * Automatically sets user information if available
 */
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

        // Set user data if available
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

/**
 * Helper functions to control Crisp programmatically
 */
export const crispHelpers = {
    /**
     * Open the chat widget
     */
    open: () => {
        if (typeof window !== 'undefined' && window.$crisp) {
            window.$crisp.push(['do', 'chat:open'])
        }
    },

    /**
     * Close the chat widget
     */
    close: () => {
        if (typeof window !== 'undefined' && window.$crisp) {
            window.$crisp.push(['do', 'chat:close'])
        }
    },

    /**
     * Show the chat widget
     */
    show: () => {
        if (typeof window !== 'undefined' && window.$crisp) {
            window.$crisp.push(['do', 'chat:show'])
        }
    },

    /**
     * Hide the chat widget
     */
    hide: () => {
        if (typeof window !== 'undefined' && window.$crisp) {
            window.$crisp.push(['do', 'chat:hide'])
        }
    },

    /**
     * Send a message to the chat
     */
    sendMessage: (message: string) => {
        if (typeof window !== 'undefined' && window.$crisp) {
            window.$crisp.push(['do', 'message:send', ['text', message]])
        }
    },

    /**
     * Set user email
     */
    setUserEmail: (email: string) => {
        if (typeof window !== 'undefined' && window.$crisp) {
            window.$crisp.push(['set', 'user:email', [email]])
        }
    },

    /**
     * Set user name
     */
    setUserName: (name: string) => {
        if (typeof window !== 'undefined' && window.$crisp) {
            window.$crisp.push(['set', 'user:nickname', [name]])
        }
    },

    /**
     * Set custom data
     */
    setCustomData: (key: string, value: string) => {
        if (typeof window !== 'undefined' && window.$crisp) {
            window.$crisp.push(['set', 'session:data', [[key, value]]])
        }
    }
}
