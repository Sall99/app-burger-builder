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
    return (
        <AuthContainer title={t('createAccount')}>
            <form onSubmit={handleSubmit(onSubmit)}>
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
