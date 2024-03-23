'use client'
import { FC, useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { FaGithub } from 'react-icons/fa'

import Image from 'next/image'
import { Spiner } from '..'

interface AuthContainerProps {
    h1: string
    children: React.ReactNode
}

const publicRoutes = {
    signIn: {
        path: '/auth/sign-in'
    },
    signUp: {
        path: '/auth/sign-up'
    }
}

export const AuthContainer: FC<AuthContainerProps> = ({ children, h1 }) => {
    const pathName = usePathname()
    const [loading, setLoading] = useState({
        google: false,
        github: false
    })

    const handleSignInWithGoogle = async () => {
        setLoading({
            ...loading,
            google: true
        })
        try {
            await signIn('google', { callbackUrl: '/' })
        } catch (error) {
        } finally {
            setLoading({
                ...loading,
                google: false
            })
        }
    }

    const handleSignInWithGithub = async () => {
        setLoading({
            ...loading,
            github: true
        })
        try {
            await signIn('github', { callbackUrl: '/' })
        } catch (error) {
        } finally {
            setLoading({
                ...loading,
                github: false
            })
        }
    }
    return (
        <div className="mt-14 w-full md:w-auto">
            <div>
                <h1 className="text-xl mb-6 tracking-wide text-primary-100 font-semibold">{h1}</h1>
                <div className="flex flex-col items-center">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-9">
                        <button className="log-with-btn" onClick={handleSignInWithGoogle}>
                            <Image
                                src="/svg/googleIcon.svg"
                                priority
                                width={20}
                                height={20}
                                alt=""
                            />
                            <span>Login with Google</span>
                            <span>{loading.google ? <Spiner /> : ''}</span>
                        </button>
                        <button className="log-with-btn" onClick={handleSignInWithGithub}>
                            <FaGithub className="text-xl" />
                            <span>Login with Github</span>
                            <span>{loading.github ? <Spiner /> : ''}</span>
                        </button>
                    </div>
                    <h1 className="mt-9 text-gray-400">- OR -</h1>
                </div>
            </div>
            <div>{children}</div>
            <h2 className="mt-5 text-xs text-gray-300 tracking-wider">
                {pathName === '/sign-up' ? (
                    <span>
                        Already have an account ?{' '}
                        <Link
                            href={publicRoutes.signIn.path}
                            className="text-primary-100 hover:underline">
                            Sign in
                        </Link>
                    </span>
                ) : (
                    <span>
                        Do not have an account ?{' '}
                        <Link
                            href={publicRoutes.signUp.path}
                            className="text-primary-100 hover:underline">
                            Sign up
                        </Link>
                    </span>
                )}
            </h2>
        </div>
    )
}
