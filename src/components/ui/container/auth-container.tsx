'use client'

import { FC, useCallback, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { Flame } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'

import { Spiner } from '..'

interface AuthContainerProps {
    title: string
    children: React.ReactNode
}

const publicRoutes = {
    signIn: { path: '/auth/sign-in' },
    signUp: { path: '/auth/sign-up' }
}

export const AuthContainer: FC<AuthContainerProps> = ({ children, title }) => {
    const t = useTranslations('AuthContainer')
    const locale = useLocale()
    const pathName = usePathname()
    const [loading, setLoading] = useState<{ google: boolean; github: boolean }>({
        google: false,
        github: false
    })

    const handleSignIn = useCallback(async (provider: 'google' | 'github') => {
        setLoading((prev) => ({ ...prev, [provider]: true }))
        try {
            await signIn(provider, { callbackUrl: '/' })
        } catch (error) {
            console.error(`Sign-in with ${provider} failed:`, error)
        } finally {
            setLoading((prev) => ({ ...prev, [provider]: false }))
        }
    }, [])

    const renderSignInButton = (
        provider: 'google' | 'github',
        label: string,
        icon: JSX.Element
    ) => (
        <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-surface-border bg-white px-4 py-2.5 font-display text-xs font-bold text-ink transition-colors hover:border-ink/30 hover:bg-surface disabled:opacity-50"
            onClick={() => handleSignIn(provider)}
            disabled={loading[provider]}>
            {icon}
            <span className="truncate">{label}</span>
            {loading[provider] && <Spiner />}
        </button>
    )

    const isSignUpPage = pathName.includes(publicRoutes.signUp.path)
    const alternateRoute = isSignUpPage ? publicRoutes.signIn : publicRoutes.signUp
    const alternateText = isSignUpPage ? t('alreadyHaveAccount') : t('dontHaveAccount')

    return (
        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-10">
            <div className="w-full max-w-md mx-auto">
                <div className="rounded-3xl border border-surface-border bg-white p-7 sm:p-8 shadow-card">
                    <div className="mb-6 flex flex-col items-center text-center">
                        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-brand">
                            <Flame size={22} strokeWidth={2.5} aria-hidden="true" />
                        </span>
                        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
                            {title}
                        </h1>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                        {renderSignInButton(
                            'google',
                            'Google',
                            <Image
                                src="/svg/googleIcon.svg"
                                priority
                                width={16}
                                height={16}
                                alt="Google"
                            />
                        )}
                        {renderSignInButton('github', 'GitHub', <FaGithub className="text-base" />)}
                    </div>

                    <div className="relative my-5">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-surface-border" />
                        </div>
                        <div className="relative flex justify-center text-[11px] uppercase">
                            <span className="bg-white px-2.5 font-semibold text-ink-subtle">
                                {t('or')}
                            </span>
                        </div>
                    </div>

                    <div>{children}</div>

                    <div className="mt-5 border-t border-surface-border pt-4 text-center text-xs text-ink-muted">
                        <Link
                            href={`/${locale}${alternateRoute.path}`}
                            className="font-display font-bold text-brand-600 hover:underline">
                            {alternateText}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
