'use client'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { yupResolver } from '@hookform/resolvers/yup'
import { FlaskConical } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

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
            .then(() => {
                toast.success(t('accountCreated'))
                router.push('/auth/sign-in')
            })
            .catch(() => {
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
    const locale = useLocale()
    const isFr = locale === 'fr'
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
                    label={t('createAccount')}
                    className="mt-2 w-full py-2.5 text-sm font-semibold"
                    loading={loading}
                />
            </form>

            <div className="mt-3 text-center">
                <button
                    type="button"
                    onClick={fillTestData}
                    className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition-colors">
                    <FlaskConical size={12} />
                    <span>
                        {isFr
                            ? 'Remplir avec des données de démonstration'
                            : 'Fill with demo credentials'}
                    </span>
                </button>
            </div>
        </AuthContainer>
    )
}
