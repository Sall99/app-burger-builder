import { instance } from '@/config'
import { SignupFormValues, UpdateProfileInFormValues } from '@/types'

export const signupAction = async (values: SignupFormValues) => {
    const { data } = await instance.post('/auth/sign-up', values)

    return data
}

export const updateProfileAction = async (values: UpdateProfileInFormValues) => {
    const { data } = await instance.post('/user/update', values)

    return data
}
