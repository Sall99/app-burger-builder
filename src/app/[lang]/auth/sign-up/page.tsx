'use client'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { signUpFormSchema } from '@/utils'
import { AuthContainer, Button, Input } from '@/components/ui'

type SignInFormValues = {
    fullName: string
    email: string
    password: string
    confirmPassword: string
}

const Signup = () => {
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<SignInFormValues>({
        resolver: yupResolver(signUpFormSchema)
    })
    const onSubmit = (data: SignInFormValues) => console.log(data)
    return (
        <div className="flex justify-center px-8 sm:px-16">
            <AuthContainer h1="Create Account">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        name="fullName"
                        type="text"
                        placeholder="Full Name"
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
                    <Button type="submit" label="Create Account" className="w-full h-10" />
                </form>
            </AuthContainer>
        </div>
    )
}

export default Signup
