'use client'

import React from 'react'
import { dictionaries } from '@/i18n'
import { usePathname, useRouter } from 'next/navigation'

const LocaleSwitcher = () => {
    const router = useRouter()
    const locales = Object.keys(dictionaries)
    const pathName = usePathname()

    const handleLocaleChange = (e: { target: { value: any } }) => {
        const selectedLocale = e.target.value

        const redirectedPath = redirectedPathName(selectedLocale)
        router.push(redirectedPath)
    }

    const redirectedPathName = (locale: string) => {
        if (!pathName) return '/'
        const segments = pathName.split('/')
        segments[1] = locale
        return segments.join('/')
    }

    return (
        <div>
            <select onChange={handleLocaleChange} className=" bg-slate-300 rounded-md p-2">
                {locales.map((locale) => (
                    <option key={locale} value={locale}>
                        {locale}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default LocaleSwitcher
