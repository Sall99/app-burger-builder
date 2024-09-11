'use client';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { AuthContainer, Button, Input } from '@/components/ui';
import { SignInFormValues } from '@/types';
import { signInFormSchema } from '@/utils';

type InputField = {
    name: keyof SignInFormValues
    type: 'email' | 'password'
    placeholder: string
}
const inputFields: InputField[] = [
    { name: 'email', type: 'email', placeholder: 'Email Address' },
    { name: 'password', type: 'password', placeholder: 'Password' }
];

const useSignin = () => {
    const [loading, setLoading] = useState(false);
    const t = useTranslations('signIn');
    const router = useRouter();

    const onSignIn = async (data: SignInFormValues) => {
        setLoading(true);
        signIn('credentials', { ...data, redirect: false }).then(async (callback) => {
            if (callback?.ok) {
                toast.success('Logged in');
                router.refresh();
                router.push('/');
            }

            if (callback?.error) {
                toast.error(callback.error);
                console.log(callback.error);
            }

            setLoading(false);
        });
    };

    return { onSignIn, loading };
};

const SignIn = () => {
    const t = useTranslations('signIn');
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<SignInFormValues>({
        resolver: yupResolver(signInFormSchema)
    });

    const { onSignIn, loading } = useSignin();

    const onSubmit = useCallback(
        async (data: SignInFormValues) => {
            await onSignIn(data);
        },
        [onSignIn]
    );

    return (
        <div className="flex justify-center px-8 sm:px-16">
            <AuthContainer h1={t('signIn')}>
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
                        label="Sign In"
                        className="w-full h-10"
                        loading={loading}
                    />
                </form>
            </AuthContainer>
        </div>
    );
};

export default SignIn;
