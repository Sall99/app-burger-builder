'use client'

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
    { name: 'currentPassword', type: 'password', placeholder: 'CurrentPassword' },
    { name: 'newPassword', type: 'password', placeholder: 'NewPassword' },
    { name: 'confirmNewPassword', type: 'password', placeholder: 'ConfirmNewPassword' }
]

const useUpdate = () => {
    const [loading, setLoading] = useState(false)
    const t = useTranslations('UpdateProfile')

    const update = async (data: UpdateProfileInFormValues) => {
        setLoading(true)
        try {
            await updateProfileAction(data)
            toast.success(t('ProfileUpdated'))

            mutate(['User'])
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                toast.error(error.response.data?.error || t('Error'))
            } else {
                toast.error(t('UnknownError'))
            }
        } finally {
            setLoading(false)
        }
    }

    return { update, loading }
}

export const UpdateProfileForm = () => {
    const t = useTranslations('UpdateProfile')

    const { error, data, isLoading } = useSWR(['User'], currentUserAction, {
        revalidateOnFocus: false
    })

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
                    <span>{t('Hi')}</span>
                    <span className="font-bold underline text-base">
                        {data?.user ? data?.user.name : '....'}
                    </span>
                    <span>, {t('UpdateMessage')}</span>
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
                        placeholder={t(placeholder)}
                        register={register}
                        errors={errors}
                    />
                ))}
                <Button
                    type="submit"
                    label={loading ? t('Updating') : t('Update')}
                    className="w-full h-10"
                    disabled={loading}
                />
            </form>
        </div>
    )
}
