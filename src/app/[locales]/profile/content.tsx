'use client'

import React from 'react'
import dayjs from 'dayjs'
import { AlertCircle, ArrowUpRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import useSWR from 'swr'

import { getUserStats } from '@/actions/users'
import { AccountShell, OrderStatusBadge, PaymentStatusBadge } from '@/components/account'
import { UpdateProfileForm } from '@/components/ui'
import { totalFormatter } from '@/utils/utils'

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
    const locale = useLocale()
    const isFr = locale === 'fr'
    const { data, error, isLoading } = useSWR<UserStats>(['userStats'], getUserStats, {
        revalidateOnFocus: false
    })

    return (
        <AccountShell
            title={isFr ? 'Profil & paramètres' : 'Profile & Settings'}
            subtitle={
                isFr
                    ? 'Informations personnelles, sécurité et résumé de votre compte.'
                    : 'Personal details, security, and account overview.'
            }>
            {isLoading ? (
                <div className="flex items-center justify-center rounded-2xl border border-zinc-200/80 py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                </div>
            ) : error || !data ? (
                <div className="rounded-2xl border border-red-200 bg-red-50/40 p-8 text-center space-y-2">
                    <AlertCircle className="mx-auto h-7 w-7 text-red-500" />
                    <p className="text-sm font-medium text-red-700">
                        {t('Error') || 'Failed to load profile'}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Crisp Metric Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200/80 rounded-2xl border border-zinc-200/80 bg-white overflow-hidden">
                        {[
                            { value: data.stats.totalOrders, label: t('TotalOrders') },
                            {
                                value: totalFormatter.format(data.stats.totalSpent),
                                label: t('TotalSpent')
                            },
                            {
                                value: data.stats.paidOrders,
                                label: t('PaidOrders') || (isFr ? 'Payées' : 'Paid')
                            },
                            {
                                value: dayjs(data.user.memberSince).format('MMM YYYY'),
                                label: t('MemberSince')
                            }
                        ].map((stat) => (
                            <div key={stat.label} className="p-4 sm:p-5">
                                <p className="text-xs font-medium text-zinc-500">{stat.label}</p>
                                <p className="mt-1 text-xl font-bold tracking-tight text-zinc-950 tabular-nums">
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Profile Settings */}
                    <div className="rounded-2xl border border-zinc-200/80 bg-white p-6">
                        <UpdateProfileForm />
                    </div>

                    {/* Recent Orders */}
                    {data.recentOrders && data.recentOrders.length > 0 && (
                        <div className="rounded-2xl border border-zinc-200/80 bg-white overflow-hidden">
                            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                                <h2 className="text-sm font-semibold text-zinc-950">
                                    {t('RecentOrders') ||
                                        (isFr ? 'Commandes récentes' : 'Recent Orders')}
                                </h2>
                                <Link
                                    href={`/${locale}/history`}
                                    className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-950">
                                    <span>{isFr ? 'Tout voir' : 'View all'}</span>
                                    <ArrowUpRight size={13} />
                                </Link>
                            </div>
                            <div className="divide-y divide-zinc-100">
                                {data.recentOrders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={`/${locale}/track-order?order_id=${order.id}`}
                                        className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 hover:bg-zinc-50 transition-colors">
                                        <div>
                                            <p className="font-mono text-xs font-semibold text-zinc-950">
                                                #{order.id.substring(0, 8)}
                                            </p>
                                            <p className="text-[11px] text-zinc-500">
                                                {dayjs(order.createdAt).format('DD MMM YYYY')}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <OrderStatusBadge status={order.status} />
                                            <PaymentStatusBadge paid={order.payment_status} />
                                            <span className="text-sm font-bold text-zinc-950 tabular-nums min-w-[3.5rem] text-right">
                                                {totalFormatter.format(order.totalPrice)}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </AccountShell>
    )
}

export default Content
