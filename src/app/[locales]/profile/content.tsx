'use client'
import React from 'react'
import {
    BiCalendar,
    BiCheck,
    BiDollar,
    BiLoaderAlt,
    BiPackage,
    BiReceipt,
    BiUser
} from 'react-icons/bi'
import dayjs from 'dayjs'
import { useTranslations } from 'next-intl'
import useSWR from 'swr'

import { getUserStats } from '@/actions/users'
import { UpdateProfileForm } from '@/components/ui'

interface UserStats {
    user: {
        id: string
        name: string
        email: string
        memberSince: string
        emailVerified: boolean
    }
    stats: {
        totalOrders: number
        totalSpent: number
        paidOrders: number
        pendingOrders: number
    }
    recentOrders: Array<{
        id: string
        totalPrice: number
        status: string
        payment_status: boolean
        createdAt: string
    }>
}

const Content = () => {
    const t = useTranslations('UpdateProfile')
    const { data, error, isLoading } = useSWR<UserStats>(['userStats'], getUserStats, {
        revalidateOnFocus: false
    })

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto my-8 min-h-screen px-8 sm:px-16 flex items-center justify-center">
                <div className="text-center">
                    <BiLoaderAlt className="w-12 h-12 animate-spin text-primary-200 mx-auto mb-4" />
                    <p className="text-lg text-gray-700">{t('Loading') || 'Loading...'}</p>
                </div>
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="max-w-6xl mx-auto my-8 min-h-screen px-8 sm:px-16 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-red-600">{t('Error') || 'Failed to load profile'}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto my-8 min-h-screen px-8 sm:px-16">
            <div className="grid grid-cols-1 mt-20 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BiPackage className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-xl font-bold text-gray-900 mb-1">{data.stats.totalOrders}</p>
                    <p className="text-xs text-gray-600">{t('TotalOrders')}</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <BiDollar className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <p className="text-xl font-bold text-gray-900 mb-1">
                        ${data.stats.totalSpent.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600">{t('TotalSpent')}</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <BiCheck className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <p className="text-xl font-bold text-gray-900 mb-1">{data.stats.paidOrders}</p>
                    <p className="text-xs text-gray-600">{t('PaidOrders') || 'Paid Orders'}</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <BiCalendar className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-xl font-bold text-gray-900 mb-1">
                        {dayjs(data.user.memberSince).format('MMM YYYY')}
                    </p>
                    <p className="text-xs text-gray-600">{t('MemberSince')}</p>
                </div>
            </div>

            {data.recentOrders && data.recentOrders.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <BiReceipt className="w-5 h-5 text-primary-200" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            {t('RecentOrders') || 'Recent Orders'}
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {data.recentOrders.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <BiPackage className="w-5 h-5 text-gray-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            #{order.id.substring(0, 8)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {dayjs(order.createdAt).format('MMM DD, YYYY')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="text-sm font-semibold text-gray-900">
                                        ${order.totalPrice.toFixed(2)}
                                    </p>
                                    <span
                                        className={`text-xs px-2 py-1 rounded ${
                                            order.payment_status
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.payment_status ? t('Paid') : t('Pending')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
                <UpdateProfileForm />
            </div>
        </div>
    )
}

export default Content
