'use client'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import { Button, Input } from '@/components/ui'
import { selectCurrentUser } from '@/redux/selectors/current-user'
import { updateProfileFormSchema } from '@/utils/yup.schema'

type UpdateProfileInFormValues = {
    name?: string | null | undefined
    password?: string | null | undefined
}
const useUpdateProfile = () => {
    const updateProfile = async (data: UpdateProfileInFormValues) => {
        try {
            const response = await axios.post('/api/update-profile', data)
            toast.success(response.data.message)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.error || 'An error occurred')
            } else {
                toast.error('An error occurred')
            }

            console.log(error, 'error')
        }
    }

    return { updateProfile }
}

export const UpdateProfileForm = () => {
    const currentUser = useSelector(selectCurrentUser) as any
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<UpdateProfileInFormValues>({
        resolver: yupResolver(updateProfileFormSchema),
        defaultValues: {
            name: currentUser?.name || ''
        }
    })

    const { updateProfile } = useUpdateProfile()

    const onSubmit = async (data: UpdateProfileInFormValues) => {
        updateProfile(data)
    }
    return (
        <div className="w-full">
            {' '}
            <form onSubmit={handleSubmit(onSubmit)} className="w-_450 m-auto" autoComplete="false">
                <Input
                    name="name"
                    type="text"
                    defaultValue={currentUser?.name || ''}
                    placeholder="Name"
                    register={register}
                    errors={errors}
                />
                <Input
                    name="password"
                    type="password"
                    placeholder="New password"
                    register={register}
                    errors={errors}
                    autoComplete="new-password"
                />
                <p className="my-4">
                    <span className="text-sm text-zinc-600">
                        **Note:** Please enter a new password to update your account.
                    </span>
                </p>
                <Button type="submit" label="Update" className="w-full h-10" />
            </form>
        </div>
    )
}
