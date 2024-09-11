'use client'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { signupAction } from '@/actions/auth/auth.action'
import { AuthContainer, Button, Input } from '@/components/ui'
import { SignupFormValues } from '@/types'
import { signUpFormSchema } from '@/utils'

type InputField = {
    name: keyof SignupFormValues
    type: 'text' | 'email' | 'password'
    placeholder: string
}

const inputFields: InputField[] = [
    { name: 'name', type: 'text', placeholder: 'Name' },
    { name: 'email', type: 'email', placeholder: 'Email Address' },
    { name: 'password', type: 'password', placeholder: 'Password' },
    { name: 'confirmPassword', type: 'password', placeholder: 'Confirm Password' }
]

const useSignUp = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const t = useTranslations('Signup')

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

const Signup = () => {
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<SignupFormValues>({
        resolver: yupResolver(signUpFormSchema)
    })

    const { signUp, loading } = useSignUp()

    const onSubmit = useCallback(
        async (data: SignupFormValues) => {
            await signUp(data)
        },
        [signUp]
    )

    return (
        <div className="flex justify-center px-8 sm:px-16">
            <AuthContainer title="Create Account">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {inputFields.map(({ name, type, placeholder }) => (
                        <Input
                            key={name}
                            name={name}
                            type={type}
                            placeholder={placeholder}
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
        </div>
    )
}

export default Signup
