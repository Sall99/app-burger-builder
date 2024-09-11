'use client'
import { FC, useCallback, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signIn } from 'next-auth/react'

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
            className="log-with-btn"
            onClick={() => handleSignIn(provider)}
            disabled={loading[provider]}>
            {icon}
            <span>{label}</span>
            {loading[provider] && <Spiner />}
        </button>
    )

    const isSignUpPage = pathName.includes(publicRoutes.signUp.path)
    const alternateRoute = isSignUpPage ? publicRoutes.signIn : publicRoutes.signUp
    const alternateText = isSignUpPage
        ? 'Already have an account? Sign in'
        : 'Do not have an account? Sign up'

    console.log(isSignUpPage, 'isSu', pathName)

    return (
        <div className="mt-14 w-full md:w-auto">
            <div>
                <h2 className="text-xl mb-6 tracking-wide text-primary-100 font-semibold">
                    {title}
                </h2>
            </div>
            <section className="flex flex-col items-center">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-9">
                    {renderSignInButton(
                        'google',
                        'Login with Google',
                        <Image
                            src="/svg/googleIcon.svg"
                            priority
                            width={20}
                            height={20}
                            alt="Google Icon"
                        />
                    )}
                    {renderSignInButton(
                        'github',
                        'Login with Github',
                        <FaGithub className="text-xl" />
                    )}
                </div>
                <h1 className="mt-9 text-gray-400">- OR -</h1>
            </section>
            <div>{children}</div>
            <div className="mt-5 text-xs text-gray-300 tracking-wider">
                <span>
                    <Link href={alternateRoute.path} className="text-primary-100 hover:underline">
                        {alternateText}
                    </Link>
                </span>
            </div>
        </div>
    )
}
