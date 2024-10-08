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

    return (
        <AuthContainer title={t('signIn')}>
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
                    label={t('signInButton')}
                    className="w-full h-10"
                    loading={loading}
                />
            </form>
        </AuthContainer>
    )
}
