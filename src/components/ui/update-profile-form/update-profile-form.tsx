'use client'
import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input } from '@/components/ui'
import { signUpFormSchema } from '@/utils'

type SignInFormValues = {
    name: string
    email: string
    password: string
    confirmPassword: string
}

export const UpdateProfileForm = () => {
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<SignInFormValues>({
        resolver: yupResolver(signUpFormSchema)
    })

    const onSubmit = async (data: SignInFormValues) => {}
    return (
        <div className="w-full">
            {' '}
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    name="name"
                    type="text"
                    placeholder="Name"
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
                <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    register={register}
                    errors={errors}
                />
                <Button type="submit" label="Create Account" className="w-full h-10" />
            </form>
        </div>
    )
}
