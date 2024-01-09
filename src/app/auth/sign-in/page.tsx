'use client'
import React from 'react'
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
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<SignInFormValues>({
        resolver: yupResolver(signInFormSchema)
    })

    const router = useRouter()

    const onSubmit: SubmitHandler<SignInFormValues> = (data) => {
        signIn('credentials', { ...data, redirect: false }).then((callback) => {
            if (callback?.ok) {
                toast.success('Logged in')
                router.push('/')
            }

            if (callback?.error) {
                toast.error(callback.error)
            }
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
                    <Button type="submit" label="Sign In" className="w-full h-10" />
                </form>
            </AuthContainer>
        </div>
    )
}

export default SignIn
