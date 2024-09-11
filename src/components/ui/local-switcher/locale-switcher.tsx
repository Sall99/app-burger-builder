'use client';

import React from 'react';

const LocaleSwitcher = () => {
    // const router = useRouter()
    // const locales = Object.keys(dictionaries)
    // const pathName = usePathname()
    // const currentLocale = useParams()

    // const handleLocaleChange = (e: { target: { value: any } }) => {
    //     const selectedLocale = e.target.value

    //     document.cookie = `NEXT_LOCALE=${selectedLocale};path=/;max-age=31536000`

    //     const redirectedPath = redirectedPathName(selectedLocale)
    //     router.push(redirectedPath)
    // }

    // const redirectedPathName = (locale: string) => {
    //     if (!pathName) return '/'
    //     const segments = pathName.split('/')
    //     segments[1] = locale
    //     return segments.join('/')
    // }

    return (
        <div>
            {/* <select
                onChange={handleLocaleChange}
                className="bg-slate-200 rounded-md p-2 text-sm"
                value={currentLocale.lang}>
                {locales.map((locale) => (
                    <option key={locale} value={locale}>
                        {locale}
                    </option>
                ))}
            </select> */}
        </div>
    );
};

export default LocaleSwitcher;
