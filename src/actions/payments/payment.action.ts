import { instance } from '@/config'
import { PaymentActionValues } from '@/types'

export const paymentAction = async (values: PaymentActionValues) => {
    const { data } = await instance.post('/create-payment-intent', { data: values })
    return data
}
