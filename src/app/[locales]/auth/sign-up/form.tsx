'use client'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { signupAction } from '@/actions/auth'
import { AuthContainer, Button, Input } from '@/components/ui'
import { SignupFormValues } from '@/types'
import { signUpFormSchema } from '@/utils'

type InputField = {
    name: keyof SignupFormValues
    type: 'text' | 'email' | 'password'
    placeholder: string
}

const inputFields: InputField[] = [
    { name: 'name', type: 'text', placeholder: 'name' },
    { name: 'email', type: 'email', placeholder: 'emailAddress' },
    { name: 'password', type: 'password', placeholder: 'password' },
    { name: 'confirmPassword', type: 'password', placeholder: 'confirmPassword' }
]

const useSignUp = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const t = useTranslations('Auth')

    const signUp = async (data: SignupFormValues) => {
        setLoading(true)
        signupAction(data)
            .then((result) => {
                toast.success(t('accountCreated'))
                setLoading(true)
                router.push('/auth/sign-in')
            })
            .catch((error) => {
                toast.error('error')
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return { signUp, loading }
}

export const SignUpForm = () => {
    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors }
    } = useForm<SignupFormValues>({
        resolver: yupResolver(signUpFormSchema)
    })
    const t = useTranslations('Auth')
    const { signUp, loading } = useSignUp()

    const onSubmit = useCallback(
        async (data: SignupFormValues) => {
            await signUp(data)
        },
        [signUp]
    )

    const fillTestData = () => {
        setValue('name', 'Test User')
        setValue('email', 'test@test.com')
        setValue('password', 'testtest')
        setValue('confirmPassword', 'testtest')
    }

    return (
        <AuthContainer title={t('createAccount')}>
            {/* Test Credentials Card */}
            <div className="mt-6 mb-6 p-3 bg-primary-300 border border-primary-100 rounded-lg">
                <h3 className="text-sm font-semibold text-primary-600 mb-2">
                    🧪 {t('testCredentials')}
                </h3>
                <div className="text-xs text-gray-100 space-y-1 mb-3">
                    <p>
                        <span className="font-medium">Name:</span> Test User
                    </p>
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
                    label="Create Account"
                    className="w-full h-10"
                    loading={loading}
                />
            </form>
        </AuthContainer>
    )
}
