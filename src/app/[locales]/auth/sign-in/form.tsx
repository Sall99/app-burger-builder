'use client'

import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { AuthContainer, Button, Input } from '@/components/ui'
import { SignInFormValues } from '@/types'
import { signInFormSchema } from '@/utils'

type InputField = {
    name: keyof SignInFormValues
    type: 'email' | 'password'
    placeholder: string
}

const inputFields: InputField[] = [
    { name: 'email', type: 'email', placeholder: 'emailAddress' },
    { name: 'password', type: 'password', placeholder: 'password' }
]

const useSignin = () => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const onSignIn = async (data: SignInFormValues) => {
        setLoading(true)
        signIn('credentials', { ...data, redirect: false }).then(async (callback) => {
            if (callback?.ok) {
                toast.success('Logged in')
                router.refresh()
                router.push('/')
            }

            if (callback?.error) {
                toast.error(callback.error)
                console.log(callback.error)
            }

            setLoading(false)
        })
    }

    return { onSignIn, loading }
}

export default function SignInForm() {
    const t = useTranslations('Auth')
    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors }
    } = useForm<SignInFormValues>({
        resolver: yupResolver(signInFormSchema)
    })

    const { onSignIn, loading } = useSignin()

    const onSubmit = useCallback(
        async (data: SignInFormValues) => {
            await onSignIn(data)
        },
        [onSignIn]
    )

    const fillTestData = () => {
        setValue('email', 'test@test.com')
        setValue('password', 'testtest')
    }

    return (
        <AuthContainer title={t('signIn')}>
            {/* Test Credentials Card */}
            <div className="mt-6 mb-6 p-3 bg-primary-300 border border-primary-100 rounded-lg">
                <h3 className="text-sm font-semibold text-primary-600 mb-2">
                    🧪 {t('testCredentials')}
                </h3>
                <div className="text-xs text-gray-100 space-y-1 mb-3">
                    <p>
                        <span className="font-medium">Email:</span> test@test.com
                    </p>
                    <p>
                        <span className="font-medium">Password:</span> testtest
                    </p>
                </div>
                <button
                    type="button"
                    onClick={fillTestData}
                    className="w-full py-2 px-4 bg-primary-100 hover:bg-primary-200 text-white text-sm rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-primary-200">
                    {t('fillTestData')}
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
                {inputFields.map(({ name, type, placeholder }) => (
                    <Input
                        key={name}
                        name={name}
                        type={type}
                        placeholder={t(placeholder)}
                        register={register}
                        errors={errors}
                    />
                ))}

                <Button
                    type="submit"
                    label={t('signInButton')}
                    className="w-full h-10"
                    loading={loading}
                />
            </form>
        </AuthContainer>
    )
}
