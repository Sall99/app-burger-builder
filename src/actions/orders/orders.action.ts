import { instance } from '@/config'

export const getOrders = async () => {
    const { data } = await instance.get('/orders/get-orders')

    return data
}

export const getOrderById = async (id: string) => {
    const { data } = await instance.get(`/orders/get-orders/${id}`)

    return data
}
