'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import useSWR, { mutate } from 'swr'

import { updateProfileAction } from '@/actions/auth'
import { currentUserAction } from '@/actions/users'
import { Button, Input } from '@/components/ui'
import { UpdateProfileInFormValues } from '@/types'
import { updateProfileFormSchema } from '@/utils/yup.schema'

type InputField = {
    name: keyof UpdateProfileInFormValues
    type: 'password' | 'text'
    placeholder: string
}

const inputFields: InputField[] = [
    { name: 'name', type: 'text', placeholder: 'Name' },
    { name: 'currentPassword', type: 'password', placeholder: 'Current Password' },
    { name: 'newPassword', type: 'password', placeholder: 'New Password' },
    { name: 'confirmNewPassword', type: 'password', placeholder: 'Confirm New Password' }
]

const useUpdate = () => {
    const [loading, setLoading] = useState(false)
    const t = useTranslations('UpdateProfile')

    const update = async (data: UpdateProfileInFormValues) => {
        setLoading(true)
        try {
            await updateProfileAction(data)
            toast.success(t('profileUpdated'))

            mutate(['User'])
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                toast.error(error.response.data?.error || 'An error occurred')
            } else {
                toast.error('An unknown error occurred')
            }
        } finally {
            setLoading(false)
        }
    }

    return { update, loading }
}

export const UpdateProfileForm = () => {
    const session = useSession()

    const { error, data, isLoading } = useSWR(['User'], currentUserAction, {
        revalidateOnFocus: false
    })

    console.log(session, 'session')

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<UpdateProfileInFormValues>({
        resolver: yupResolver(updateProfileFormSchema)
    })

    const { update, loading } = useUpdate()

    const onSubmit = async (formData: UpdateProfileInFormValues) => {
        update(formData)
    }

    return (
        <div className="w-full form-card !py-16">
            <h2 className="text-lg font-semibold mb-16 text-zinc-600 flex justify-center">
                <p className="flex flex-col md:flex-row gap-1 items-center font-normal">
                    <span>Hi</span>
                    <span className="font-bold underline text-base">
                        {data?.user ? data?.user.name : '....'}
                    </span>
                    <span>, please take a moment to update your profile.</span>
                </p>
            </h2>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="md:w-_450 m-auto"
                autoComplete="false">
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
                    label={loading ? 'Updating...' : 'Update'}
                    className="w-full h-10"
                    disabled={loading}
                />
            </form>
        </div>
    )
}
