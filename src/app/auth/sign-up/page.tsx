'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import axios from 'axios'

import { signUpFormSchema } from '@/utils'
import { AuthContainer, Button, Input } from '@/components/ui'
import { useRouter } from 'next/navigation'

type SignInFormValues = {
    name: string
    email: string
    password: string
    confirmPassword: string
}

const useSignUp = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const signUp = async (data: SignInFormValues) => {
        setLoading(true)
        try {
            await axios.post('/api/sign-up', data)
            toast.success('Registered!')
            router.push('/auth/sign-in')
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.error || 'An error occurred')
            } else {
                toast.error('An error occurred')
            }
        }
        setLoading(false)
    }

    return { signUp, loading }
}

const Signup = () => {
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<SignInFormValues>({
        resolver: yupResolver(signUpFormSchema)
    })

    const { signUp, loading } = useSignUp()

    const onSubmit = async (data: SignInFormValues) => {
        await signUp(data)
    }

    return (
        <div className="flex justify-center px-8 sm:px-16">
            <AuthContainer h1="Create Account">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        name="name"
                        type="text"
                        placeholder="Name"
                        register={register}
                        errors={errors}
                    />
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
                    <Input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        register={register}
                        errors={errors}
                    />
                    <Button
                        type="submit"
                        label="Create Account"
                        className="w-full h-10"
                        loading={loading}
                    />
                </form>
            </AuthContainer>
        </div>
    )
}

export default Signup
