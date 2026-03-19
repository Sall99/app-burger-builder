'use client'
import React from 'react'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const SOCIAL_LINKS = {
    github: 'https://github.com/Sall99',
    linkedin: 'https://www.linkedin.com/in/sall99/'
} as const

export const Footer = () => {
    const t = useTranslations('Footer')
    const tHeader = useTranslations('Header')
    const currentYear = dayjs().year()

    return (
        <footer className="mt-8 border-t border-neutral-800 bg-neutral-950 text-white" role="contentinfo">
            <div className="max-w-5xl mx-auto px-6 py-10">
                {/* Internal navigation links for SEO */}
                <nav aria-label="Footer navigation" className="mb-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
                        <div>
                            <h3 className="font-semibold text-amber-400 mb-3">Burger Builder</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <Link href="/" className="hover:text-amber-400 transition-colors">
                                        Build Your Burger
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/en/locations" className="hover:text-amber-400 transition-colors">
                                        {tHeader('locations')}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-amber-400 mb-3">Account</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <Link href="/en/auth/sign-in" className="hover:text-amber-400 transition-colors">
                                        {tHeader('signIn')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/en/auth/sign-up" className="hover:text-amber-400 transition-colors">
                                        {tHeader('signUp')}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-amber-400 mb-3">Support</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <Link href="/en/help" className="hover:text-amber-400 transition-colors">
                                        Help & FAQ
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-amber-400 mb-3">Connect</h3>
                            <ul className="space-y-2 text-gray-400">
                                {Object.entries(SOCIAL_LINKS).map(([name, url]) => (
                                    <li key={name}>
                                        <Link
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                                            {name === 'github' ? (
                                                <FaGithub className="text-amber-400" size={14} />
                                            ) : (
                                                <FaLinkedinIn className="text-amber-400" size={14} />
                                            )}
                                            <span className="capitalize">{name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </nav>

                {/* Bottom bar */}
                <div className="border-t border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        <span className="underline">{currentYear}</span> &copy; {t('Copyright')}
                    </p>
                </div>
            </div>
        </footer>
    )
}
