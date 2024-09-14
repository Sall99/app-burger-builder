'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { updateProfileAction } from '@/actions/auth'
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
        updateProfileAction(data)
            .then((result) => {
                toast.success(t('profileUpdated'))
                setLoading(true)
            })
            .catch((error) => {
                toast.error(error?.response.data.error)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return { update, loading }
}

export const UpdateProfileForm = () => {
    const session = useSession()
    const { data } = session
    console.log(session, 'session')
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<UpdateProfileInFormValues>({
        resolver: yupResolver(updateProfileFormSchema)
    })

    const { update, loading } = useUpdate()

    const onSubmit = async (data: UpdateProfileInFormValues) => {
        update(data)
    }

    return (
        <div className="w-full form-card !py-16">
            <h2 className="text-lg font-semibold mb-16 text-zinc-600">
                <p className="flex gap-1 items-center font-normal">
                    <span>Hi</span>
                    <span className="font-bold underline text-base">
                        {data?.user ? data?.user.name : '....'}
                    </span>
                    <span>, please take a moment to update your profile.</span>
                </p>
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="w-_450 m-auto" autoComplete="false">
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
                <Button type="submit" label="Update" className="w-full h-10" />
            </form>
        </div>
    )
}
