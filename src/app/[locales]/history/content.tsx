'use client'

import React, { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { AlertCircle, ArrowUpRight, Loader2, MapPin, Package, Search } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import useSWR from 'swr'

import { getOrders } from '@/actions/orders'
import { AccountShell, OrderStatusBadge, PaymentStatusBadge } from '@/components/account'
import { OrderWithShippingAddress } from '@/types'
import { totalFormatter } from '@/utils/utils'

const Content = () => {
    const t = useTranslations('Orders')
    const locale = useLocale()
    const isFr = locale === 'fr'
    const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all')
    const [query, setQuery] = useState('')

    const { error, data, isLoading } = useSWR(['Orders'], getOrders, {
        revalidateOnFocus: false
    })

    const orders: OrderWithShippingAddress[] = useMemo(() => {
        const list = (data?.orders || []) as OrderWithShippingAddress[]
        return [...list].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    }, [data?.orders])

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            if (filter === 'paid' && !order.payment_status) return false
            if (filter === 'pending' && order.payment_status) return false
            if (query.trim()) {
                const q = query.trim().toLowerCase()
                return (
                    order.id.toLowerCase().includes(q) ||
                    order.shippingAdresse?.streetAddress?.toLowerCase().includes(q) ||
                    order.status.toLowerCase().includes(q)
                )
            }
            return true
        })
    }, [orders, filter, query])

    const paidCount = orders.filter((o) => o.payment_status).length
    const pendingCount = orders.length - paidCount

    return (
        <AccountShell
            title={t('OrderHistory')}
            subtitle={
                isFr
                    ? `${orders.length} ${orders.length > 1 ? 'commandes' : 'commande'}`
                    : `${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`
            }>
            {isLoading ? (
                <div className="flex items-center justify-center rounded-2xl border border-zinc-200/80 py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50/40 p-8 text-center space-y-2">
                    <AlertCircle className="mx-auto h-7 w-7 text-red-500" />
                    <p className="text-sm font-medium text-red-700">{t('LoadError')}</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center space-y-3">
                    <Package size={28} className="mx-auto text-zinc-400" />
                    <p className="text-sm font-semibold text-zinc-900">{t('NoOrders')}</p>
                    <p className="text-xs text-zinc-500">{t('NoOrdersDesc')}</p>
                    <Link
                        href={`/${locale}`}
                        className="mt-2 inline-flex rounded-full bg-zinc-950 px-5 py-2 text-xs font-semibold text-white hover:bg-zinc-800">
                        {isFr ? 'Composer un burger' : 'Build a Burger'}
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Clean Toolbar */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="inline-flex rounded-xl bg-zinc-100 p-1">
                            {(
                                [
                                    { id: 'all', label: `${isFr ? 'Toutes' : 'All'} (${orders.length})` },
                                    { id: 'paid', label: `${isFr ? 'Payées' : 'Paid'} (${paidCount})` },
                                    {
                                        id: 'pending',
                                        label: `${isFr ? 'En attente' : 'Pending'} (${pendingCount})`
                                    }
                                ] as const
                            ).map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setFilter(tab.id)}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                        filter === tab.id
                                            ? 'bg-white text-zinc-950 font-semibold shadow-soft'
                                            : 'text-zinc-500 hover:text-zinc-900'
                                    }`}>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full sm:w-60">
                            <Search
                                size={14}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                            />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={isFr ? 'Rechercher...' : 'Search...'}
                                className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-3 text-xs text-zinc-950 placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Clean Table-style Order List */}
                    {filteredOrders.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-zinc-200 p-10 text-center text-xs text-zinc-500">
                            {isFr
                                ? 'Aucune commande ne correspond à ce filtre.'
                                : 'No orders match this filter.'}
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200/80 bg-white overflow-hidden">
                            {filteredOrders.map(
                                ({
                                    id,
                                    createdAt,
                                    payment_status,
                                    status,
                                    shippingAdresse,
                                    totalPrice
                                }) => (
                                    <div
                                        key={id}
                                        className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-zinc-50/70 transition-colors">
                                        <div className="min-w-0 space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-mono text-sm font-semibold text-zinc-950">
                                                    #{id.substring(0, 8)}
                                                </span>
                                                <OrderStatusBadge status={status} />
                                                <PaymentStatusBadge paid={payment_status} />
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                                                <span>
                                                    {dayjs(createdAt).format('DD MMM YYYY · HH:mm')}
                                                </span>
                                                {shippingAdresse && (
                                                    <span className="inline-flex items-center gap-1 truncate">
                                                        <MapPin size={11} />
                                                        {shippingAdresse.streetAddress}
                                                        {shippingAdresse.town
                                                            ? `, ${shippingAdresse.town}`
                                                            : ''}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-4">
                                            <span className="text-base font-bold text-zinc-950 tabular-nums">
                                                {totalFormatter.format(totalPrice)}
                                            </span>
                                            <Link
                                                href={`/${locale}/track-order?order_id=${id}`}
                                                className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-950 hover:text-zinc-950 transition-colors">
                                                <span>{isFr ? 'Suivre' : 'Track'}</span>
                                                <ArrowUpRight size={13} />
                                            </Link>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            )}
        </AccountShell>
    )
}

export default Content
