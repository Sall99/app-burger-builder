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
    const currentYear = dayjs().year()
    return (
        <footer className="flex gap-4 items-center justify-center mt-8 mb-4 opacity-90">
            <p className="text-sm md:text-base">
                <span className="underline">{currentYear}</span> &copy; {t('Copyright')}
            </p>
            <div className="flex gap-3">
                {Object.entries(SOCIAL_LINKS).map(([name, url]) => (
                    <Link
                        key={name}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={name}>
                        {name === 'github' ? (
                            <FaGithub fill="#e27b36" />
                        ) : (
                            <FaLinkedinIn fill="#e27b36" />
                        )}
                        <span className="sr-only">{name}</span>
                    </Link>
                ))}
            </div>
        </footer>
    )
}
