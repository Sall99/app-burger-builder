import { instance } from '@/config'

export const currentUserAction = async () => {
    const { data } = await instance.get('/auth/current-user')

    return data
}
