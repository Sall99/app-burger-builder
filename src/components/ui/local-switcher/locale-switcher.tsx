'use client'

import React, { startTransition, useState, useTransition } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

const locales = [{ name: 'en' }, { name: 'fr' }]

const LocaleSwitcher = () => {
    const router = useRouter()
    const [selected, setSelected] = useState(locales[0])
    const pathName = usePathname()
    const currentLocale = useParams()
    const [isPending, startTransition] = useTransition()

    const localActive = useLocale()

    const handleLocaleChange = (e: { target: { value: any } }) => {
        startTransition(() => {
            router.replace(`/${e.target.value}`)
        })
    }

    return (
        <div>
            <select
                onChange={handleLocaleChange}
                className="bg-slate-200 rounded-md h-10 px-2 text-[#f08e4a] text-sm"
                value={currentLocale.lang}>
                {locales.map((locale) => (
                    <option key={locale.name} value={locale.name}>
                        {locale.name}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default LocaleSwitcher
