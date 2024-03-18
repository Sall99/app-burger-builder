'use client'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

import { AuthContainer, Button, Input } from '@/components/ui'
import { signInFormSchema } from '@/utils'
import toast from 'react-hot-toast'

type SignInFormValues = {
    email: string
    password: string
}

const SignIn = () => {
    const [loading, setLoading] = useState(false)
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<SignInFormValues>({
        resolver: yupResolver(signInFormSchema)
    })

    const router = useRouter()

    const onSubmit: SubmitHandler<SignInFormValues> = (data) => {
        setLoading(true)
        signIn('credentials', { ...data, redirect: false }).then(async (callback) => {
            if (callback?.ok) {
                toast.success('Logged in')
                router.refresh()
                router.push('/')
            }

            if (callback?.error) {
                toast.error(callback.error)
            }

            setLoading(false)
        })
    }

    return (
        <div className="flex justify-center px-8 sm:px-16">
            <AuthContainer h1="Sign In">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        register={register}
                        errors={errors}
                    />
                    <Input
                        name="password"
                        type="password"
                        placeholder="Password"
                        register={register}
                        errors={errors}
                    />
                    <Button
                        type="submit"
                        label="Sign In"
                        className="w-full h-10"
                        loading={loading}
                    />
                </form>
            </AuthContainer>
        </div>
    )
}

export default SignIn
