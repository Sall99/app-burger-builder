'use client'

import React, { useState } from 'react'
import { OrderStatus } from '@prisma/client'
import dayjs from 'dayjs'
import {
    AlertCircle,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    DollarSign,
    Loader2,
    MapPin,
    Package,
    Search,
    Truck,
    XCircle
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import useSWR from 'swr'

import { getOrderById, getOrders } from '@/actions/orders'
import { AccountShell, OrderStatusBadge } from '@/components/account'
import { OrderWithShippingAddress } from '@/types'
import { totalFormatter } from '@/utils/utils'

interface OrderDetail {
    id: string
    createdAt: string
    status: OrderStatus
    shippingAdresse?: {
        firstName?: string
        lastName?: string
        streetAddress?: string
        town?: string
    }
    totalPrice: number
}

interface OrderResponse {
    order: OrderDetail
}

const statusSteps = [
    { status: OrderStatus.PENDING, label: 'Pending', icon: Clock },
    { status: OrderStatus.PROCESSING, label: 'Processing', icon: Package },
    { status: OrderStatus.COMPLETED, label: 'Completed', icon: CheckCircle2 },
    { status: OrderStatus.DELIVERED, label: 'Delivered', icon: Truck },
    { status: OrderStatus.CANCELLED, label: 'Cancelled', icon: XCircle }
]

const Content: React.FC = () => {
    const t = useTranslations('Order')
    const locale = useLocale()
    const isFr = locale === 'fr'
    const { data: session } = useSession()
    const [orderId, setOrderId] = useState<string>('')
    const [submittedId, setSubmittedId] = useState<string | null>(null)

    const { data: recentData } = useSWR(session ? ['Orders'] : null, getOrders, {
        revalidateOnFocus: false
    })

    const { error, data, isLoading } = useSWR<OrderResponse>(
        submittedId ? [`Order_${submittedId}`] : null,
        () => getOrderById(submittedId!)
    )

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            const urlOrderId = params.get('order_id')
            if (urlOrderId && !submittedId) {
                setOrderId(urlOrderId)
                setSubmittedId(urlOrderId)
            }
        }
    }, [submittedId])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (orderId.trim()) {
            setSubmittedId(orderId.trim())
        }
    }

    const selectQuickOrder = (id: string) => {
        setOrderId(id)
        setSubmittedId(id)
    }

    const recentOrders: OrderWithShippingAddress[] = (recentData?.orders || []).slice(0, 5)
    const currentStatusIndex = data?.order
        ? statusSteps.findIndex((step) => step.status === data.order.status)
        : -1

    return (
        <AccountShell title={t('trackMyOrder')} subtitle={t('enterOrderId')}>
            {/* Search Card */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 space-y-4">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
                    <div className="relative flex-1">
                        <Search
                            size={15}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                        />
                        <input
                            type="text"
                            id="orderId"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            placeholder={t('orderIdPlaceholder')}
                            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 py-2.5 pl-10 pr-4 text-sm text-zinc-950 placeholder:text-zinc-400 focus:border-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950/10"
                            autoComplete="off"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!orderId.trim()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        <Search size={15} />
                        <span>{t('trackOrderButton')}</span>
                    </button>
                </form>

                {/* Quick 1-click chips for signed-in user's recent orders */}
                {recentOrders.length > 0 && (
                    <div className="pt-1 border-t border-zinc-100">
                        <p className="mb-2 mt-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                            {isFr ? 'Vos commandes récentes :' : 'Your recent orders:'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {recentOrders.map((order) => {
                                const selected = submittedId === order.id
                                return (
                                    <button
                                        key={order.id}
                                        type="button"
                                        onClick={() => selectQuickOrder(order.id)}
                                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                                            selected
                                                ? 'border-zinc-950 bg-zinc-950 text-white'
                                                : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-white'
                                        }`}>
                                        <span className="font-mono">
                                            #{order.id.substring(0, 8)}
                                        </span>
                                        <span className={selected ? 'text-zinc-400' : 'text-zinc-300'}>
                                            •
                                        </span>
                                        <span className="tabular-nums">
                                            {totalFormatter.format(order.totalPrice)}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {isLoading && (
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-12 text-center space-y-3">
                    <Loader2 className="mx-auto h-7 w-7 animate-spin text-zinc-400" />
                    <p className="text-sm font-medium text-zinc-500">{t('loading')}</p>
                </div>
            )}

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50/50 p-10 text-center space-y-2.5">
                    <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
                    <p className="text-sm font-semibold text-zinc-950">{t('failedToLoadOrder')}</p>
                </div>
            )}

            {data && data.order && (
                <div className="space-y-4">
                    {/* Order Summary */}
                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200/80 bg-white p-5">
                        <div className="flex items-center gap-3.5">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                                <Package size={20} />
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-base font-semibold tracking-tight text-zinc-950">
                                        {isFr ? 'Commande' : 'Order'} #{data.order.id.substring(0, 10)}
                                    </h3>
                                    <OrderStatusBadge status={data.order.status} />
                                </div>
                                <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                                    <Calendar size={12} />
                                    <span>
                                        {t('placedOn')}:{' '}
                                        {dayjs(data.order.createdAt).format('DD MMM YYYY • HH:mm')}
                                    </span>
                                </p>
                                {data.order.shippingAdresse?.streetAddress && (
                                    <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                                        <MapPin size={12} className="text-zinc-400" />
                                        <span>
                                            {data.order.shippingAdresse.streetAddress}
                                            {data.order.shippingAdresse.town
                                                ? `, ${data.order.shippingAdresse.town}`
                                                : ''}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-zinc-50 px-3.5 py-2.5">
                            <DollarSign size={14} className="text-zinc-400" />
                            <span className="text-xs font-medium text-zinc-500">
                                {t('totalPrice')}:
                            </span>
                            <span className="text-lg font-semibold tracking-tight text-zinc-950 tabular-nums">
                                {totalFormatter.format(data.order.totalPrice)}
                            </span>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 sm:p-6">
                        <h3 className="text-sm font-semibold text-zinc-950 mb-5">
                            {t('orderStatus')}
                        </h3>

                        <div className="space-y-3.5">
                            {statusSteps.map((step, index) => {
                                const Icon = step.icon
                                const isActive = index === currentStatusIndex
                                const isCompleted = index < currentStatusIndex
                                const isCancelled =
                                    data.order.status === OrderStatus.CANCELLED &&
                                    step.status === OrderStatus.CANCELLED

                                return (
                                    <div key={step.status} className="flex items-center gap-3.5">
                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                                isCancelled
                                                    ? 'bg-red-50 text-red-600 ring-1 ring-red-200'
                                                    : isActive
                                                      ? 'bg-zinc-950 text-white'
                                                      : isCompleted
                                                        ? 'bg-emerald-600 text-white'
                                                        : 'bg-zinc-50 text-zinc-400 ring-1 ring-zinc-200'
                                            }`}>
                                            {isCompleted && !isCancelled ? (
                                                <Check size={16} />
                                            ) : isCancelled ? (
                                                <XCircle size={16} />
                                            ) : (
                                                <Icon size={16} />
                                            )}
                                        </div>

                                        <div className="flex-1 flex items-center justify-between border-b border-zinc-100 pb-3">
                                            <p
                                                className={`text-sm font-medium ${
                                                    isCancelled
                                                        ? 'text-red-600'
                                                        : isActive
                                                          ? 'text-zinc-950 font-semibold'
                                                          : isCompleted
                                                            ? 'text-zinc-900'
                                                            : 'text-zinc-400'
                                                }`}>
                                                {t(step.label)}
                                            </p>
                                            {isActive && !isCancelled && (
                                                <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-semibold text-orange-700 ring-1 ring-orange-200/80">
                                                    {isFr ? 'Étape actuelle' : 'Current'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {data.order.status === OrderStatus.CANCELLED && (
                            <div className="mt-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50/70 p-3.5 text-xs font-medium text-red-700">
                                <XCircle size={16} className="shrink-0" />
                                <p>{t('orderCancelled')}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AccountShell>
    )
}

export default Content
