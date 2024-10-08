'use client'

import React, { useState } from 'react'
import { OrderStatus } from '@prisma/client'
import dayjs from 'dayjs'
import { useTranslations } from 'next-intl'
import useSWR from 'swr'

import { getOrderById } from '@/actions/orders'

interface ShippingAddress {
    street: string
    city: string
}

interface Order {
    id: string
    createdAt: string
    status: OrderStatus
    shippingAdresse?: ShippingAddress
    totalPrice: number
}

interface OrderResponse {
    order: Order
}

const statusSteps = [
    { status: OrderStatus.PENDING, label: 'Pending' },
    { status: OrderStatus.PROCESSING, label: 'Processing' },
    { status: OrderStatus.COMPLETED, label: 'Completed' },
    { status: OrderStatus.DELIVERED, label: 'Delivered' },
    { status: OrderStatus.CANCELLED, label: 'Cancelled' }
]

const Content: React.FC = () => {
    const t = useTranslations('Order')
    const [orderId, setOrderId] = useState<string>('')
    const [submittedId, setSubmittedId] = useState<string | null>(null)

    const { error, data, isLoading } = useSWR<OrderResponse>(
        submittedId ? [`Order_${submittedId}`] : null,
        () => getOrderById(submittedId!)
    )

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSubmittedId(orderId)
    }

    return (
        <div className="max-w-4xl mx-auto my-8 min-h-screen px-8 sm:px-16">
            <h1 className="text-xl font-bold mb-6 text-[#f08e4a]">{t('trackMyOrder')}</h1>

            <form onSubmit={handleSubmit} className="mb-8">
                <label htmlFor="orderId" className="block text-base font-medium text-gray-700 mb-2">
                    {t('enterOrderId')}
                </label>
                <input
                    type="text"
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder={t('orderIdPlaceholder')}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f08e4a]"
                />
                <button
                    type="submit"
                    className="mt-4 px-4 text-sm py-2 bg-[#f08e4a] text-white rounded-lg shadow-md hover:bg-[#e07738]">
                    {t('trackOrderButton')}
                </button>
            </form>

            {isLoading && (
                <div className="flex items-center justify-center">
                    <div className="text-[#f08e4a] text-lg">{t('loading')}</div>
                </div>
            )}

            {error && (
                <div className="flex items-center justify-center">
                    <p className="text-red-500">{t('failedToLoadOrder')}</p>
                </div>
            )}

            {data && data.order && (
                <div>
                    <div className="mb-4">
                        <h2 className="text-lg">
                            {t('order')} #{data.order.id}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {t('placedOn')}:{' '}
                            {dayjs(data.order.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                        </p>
                        <p className="mt-2">
                            <strong>{t('totalPrice')}:</strong> ${data.order.totalPrice.toFixed(2)}
                        </p>
                    </div>

                    <div className="border-t border-gray-200 pt-4 space-y-4">
                        <h3 className="text-xl text-gray-700">{t('orderStatus')}</h3>
                        <div className="flex flex-col space-y-2">
                            {statusSteps.map((step, index) => (
                                <div key={index} className="flex items-center">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            data.order.status === step.status
                                                ? 'bg-[#f08e4a] text-white'
                                                : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <p
                                        className={`ml-4 font-medium ${
                                            data.order.status === step.status
                                                ? 'text-[#f08e4a]'
                                                : 'text-gray-600'
                                        }`}>
                                        {t(step.label)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {data.order.status === OrderStatus.CANCELLED && (
                            <p className="mt-4 text-red-500">{t('orderCancelled')}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Content
