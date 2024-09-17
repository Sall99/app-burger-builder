'use client'

import React from 'react'
import dayjs from 'dayjs'
import useSWR from 'swr'

import { getOrders } from '@/actions/orders'
import { OrderWithShippingAddress } from '@/types'

const Content = () => {
    const { error, data, isLoading } = useSWR(['Orders'], getOrders, {
        revalidateOnFocus: false
    })

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto my-8 min-h-screen flex items-center justify-center">
                <div className="text-[#f08e4a] text-lg font-semibold">Loading...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto my-8 min-h-screen flex items-center justify-center">
                <p className="text-red-500">Failed to load orders. Please try again.</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto my-8 min-h-screen px-8 sm:px-16">
            <h1 className="text-3xl font-bold mb-6 text-[#f08e4a]">Order History</h1>
            {data && data?.orders?.length > 0 ? (
                <div className="space-y-4">
                    {data.orders.map(
                        ({
                            id,
                            createdAt,
                            payment_status,
                            status,
                            shippingAdresse,
                            totalPrice
                        }: OrderWithShippingAddress) => (
                            <div
                                key={id}
                                className="p-4 border border-gray-200 rounded-lg shadow-sm">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-lg font-semibold">Order #{id}</h2>
                                        <p className="text-sm text-gray-500">
                                            Placed on:{' '}
                                            {dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}
                                        </p>
                                    </div>
                                    <div className="text-[#f08e4a] font-semibold">
                                        {payment_status ? 'Paid' : 'Pending'}
                                    </div>
                                </div>
                                <div className="mt-4 text-gray-700">
                                    <p>
                                        <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
                                    </p>
                                    <p>
                                        <strong>Status:</strong> {status}
                                    </p>
                                    {shippingAdresse && (
                                        <p>
                                            <strong>Shipping Address:</strong>{' '}
                                            {shippingAdresse.streetAddress}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )
                    )}
                </div>
            ) : (
                <p className="text-center text-gray-500">No orders found.</p>
            )}
        </div>
    )
}

export default Content
