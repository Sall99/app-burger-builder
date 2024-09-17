import { instance } from '@/config'

export const getOrders = async () => {
    const { data } = await instance.get('/orders/get-orders')

    return data
}
