'use client'

import React from 'react'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import { useTranslations } from 'next-intl'

export default function Help() {
    const t = useTranslations('Help')

    const helpData = [
        {
            title: t('HowToBuild'),
            description: t('HowToBuildDescription')
        },
        {
            title: t('Customizing'),
            description: t('CustomizingDescription')
        },
        {
            title: t('Reviewing'),
            description: t('ReviewingDescription')
        },
        {
            title: t('PlacingOrder'),
            description: t('PlacingOrderDescription')
        },
        {
            title: t('SpecialOffers'),
            description: t('SpecialOffersDescription')
        }
    ]

    return (
        <div className="px-4 md:px-8 lg:px-12 mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-zinc-700">{t('HelpTitle')}</h2>
            <div className="bg-white shadow-md rounded-lg p-4">
                {helpData.map(({ title, description }, index) => (
                    <Disclosure key={index} as="div" className="mt-4" defaultOpen={index === 0}>
                        {({ open }) => (
                            <>
                                <Disclosure.Button className="flex justify-between w-full px-4 py-3 text-sm font-medium text-left text-primary-700 bg-orange-50 rounded-md hover:bg-orange-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-200 focus-visible:ring-opacity-75 transition-all">
                                    <span>{title}</span>
                                    <ChevronUpIcon
                                        className={`${
                                            open ? 'rotate-180 transform' : ''
                                        } h-5 w-5 text-primary-700`}
                                    />
                                </Disclosure.Button>
                                <Disclosure.Panel className="px-4 py-3 text-sm text-gray-600 leading-relaxed">
                                    {description}
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                ))}
            </div>
        </div>
    )
}
