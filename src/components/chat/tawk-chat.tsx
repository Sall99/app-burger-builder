'use client'

import { useEffect } from 'react'

declare global {
    interface Window {
        Tawk_API: any
        Tawk_LoadStart: Date
    }
}

interface TawkChatProps {
    propertyId: string
    widgetId?: string
}

export const TawkChat: React.FC<TawkChatProps> = ({ propertyId, widgetId = 'default' }) => {
    useEffect(() => {
        if (typeof window === 'undefined') return

        window.Tawk_API = window.Tawk_API || {}
        window.Tawk_LoadStart = new Date()

        const script = document.createElement('script')
        script.async = true
        script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`
        script.charset = 'UTF-8'
        script.setAttribute('crossorigin', '*')
        
        const firstScript = document.getElementsByTagName('script')[0]
        firstScript.parentNode?.insertBefore(script, firstScript)

        return () => {
            
            if (script.parentNode) {
                script.parentNode.removeChild(script)
            }
            
            if (window.Tawk_API) {
                delete window.Tawk_API
            }
        }
    }, [propertyId, widgetId])

    return null
}

interface TawkChatWithUserProps extends TawkChatProps {
    userEmail?: string
    userName?: string
    userPhone?: string
}

export const TawkChatWithUser: React.FC<TawkChatWithUserProps> = ({
    propertyId,
    widgetId,
    userEmail,
    userName,
    userPhone
}) => {
    useEffect(() => {
        if (typeof window === 'undefined' || !window.Tawk_API) return

        // Wait for Tawk to be ready
        window.Tawk_API.onLoad = function() {
            const attributes: any = {}
            
            if (userEmail) {
                attributes.email = userEmail
            }
            if (userName) {
                attributes.name = userName
            }
            if (userPhone) {
                attributes.phone = userPhone
            }

            if (Object.keys(attributes).length > 0) {
                window.Tawk_API.setAttributes(attributes)
            }
        }
    }, [userEmail, userName, userPhone])

    return <TawkChat propertyId={propertyId} widgetId={widgetId} />
}

export const tawkHelpers = {
    open: () => {
        if (typeof window !== 'undefined' && window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
            window.Tawk_API.maximize()
        }
    },

    close: () => {
        if (typeof window !== 'undefined' && window.Tawk_API && typeof window.Tawk_API.minimize === 'function') {
            window.Tawk_API.minimize()
        }
    },

    show: () => {
        if (typeof window !== 'undefined' && window.Tawk_API && typeof window.Tawk_API.showWidget === 'function') {
            window.Tawk_API.showWidget()
        }
    },

    hide: () => {
        if (typeof window !== 'undefined' && window.Tawk_API && typeof window.Tawk_API.hideWidget === 'function') {
            window.Tawk_API.hideWidget()
        }
    },

    toggle: () => {
        if (typeof window !== 'undefined' && window.Tawk_API && typeof window.Tawk_API.toggle === 'function') {
            window.Tawk_API.toggle()
        }
    },

    sendMessage: (message: string) => {
        if (typeof window !== 'undefined' && window.Tawk_API && typeof window.Tawk_API.addEvent === 'function') {
            window.Tawk_API.addEvent('message', { message }, (error: any) => {
                if (error) {
                    console.error('Failed to send message:', error)
                }
            })
        }
    },

    setUserEmail: (email: string) => {
        if (typeof window !== 'undefined' && window.Tawk_API && typeof window.Tawk_API.setAttributes === 'function') {
            window.Tawk_API.setAttributes({ email })
        }
    },

    setUserName: (name: string) => {
        if (typeof window !== 'undefined' && window.Tawk_API && typeof window.Tawk_API.setAttributes === 'function') {
            window.Tawk_API.setAttributes({ name })
        }
    },

    setCustomData: (key: string, value: string) => {
        if (typeof window !== 'undefined' && window.Tawk_API && typeof window.Tawk_API.addTags === 'function') {
            window.Tawk_API.addTags([`${key}:${value}`])
        }
    },

    onChatStarted: (callback: () => void) => {
        if (typeof window !== 'undefined' && window.Tawk_API) {
            window.Tawk_API.onChatStarted = callback
        }
    },

    onChatEnded: (callback: () => void) => {
        if (typeof window !== 'undefined' && window.Tawk_API) {
            window.Tawk_API.onChatEnded = callback
        }
    }
}

