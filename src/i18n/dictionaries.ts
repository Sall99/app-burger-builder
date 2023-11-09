
export type locales =  keyof typeof dictionaries

export const dictionaries  ={
    en: () => import('./locales/en.json').then((m) => m.default),
    fr: () => import('./locales/fr.json').then((m) => m.default),
}

export const getDictionary = async (locale: locales) => dictionaries[locale]()