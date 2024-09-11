import axios from 'axios'
import { Pathnames } from 'next-intl/navigation'

export const locales = ['en', 'fr'] as const

const instance = axios.create({
    baseURL: '/api',
    timeout: 30000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

const pathnames = {
    '/': '/',
    '/pathnames': {
        en: '/pathnames',
        fr: '/pfadnamen'
    }
} satisfies Pathnames<typeof locales>

// Use the default: `always`
const localePrefix = undefined

type AppPathnames = keyof typeof pathnames

export { instance, localePrefix, pathnames }
export type { AppPathnames }
