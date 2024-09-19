'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

const locales = [{ name: 'en' }, { name: 'fr' }]

const LocaleSwitcher = () => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const localActive = useLocale()
    const [selected, setSelected] = useState(localActive || locales[0].name)

    const handleLocaleChange = (e: { target: { value: string } }) => {
        const selectedLocale = e.target.value
        setSelected(selectedLocale)
        startTransition(() => {
            router.replace(`/${e.target.value}`)
        })
    }

    return (
        <div>
            <select
                onChange={handleLocaleChange}
                className="bg-slate-200 rounded-md h-10 px-2 text-[#f08e4a] text-sm"
                value={selected}>
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
