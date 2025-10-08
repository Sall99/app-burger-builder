'use client'

import React, { useState } from 'react'
import {
    BiCalendar,
    BiCheckCircle,
    BiDollar,
    BiError,
    BiPackage,
    BiSearch,
    BiTimeFive,
    BiX
} from 'react-icons/bi'
import { OrderStatus } from '@prisma/client'
import dayjs from 'dayjs'
import { Check, Loader2, Package, Search, Truck, XCircle } from 'lucide-react'
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
    { status: OrderStatus.PENDING, label: 'Pending', icon: BiTimeFive },
    { status: OrderStatus.PROCESSING, label: 'Processing', icon: BiPackage },
    { status: OrderStatus.COMPLETED, label: 'Completed', icon: BiCheckCircle },
    { status: OrderStatus.DELIVERED, label: 'Delivered', icon: Truck },
    { status: OrderStatus.CANCELLED, label: 'Cancelled', icon: BiX }
]

const Content: React.FC = () => {
    const t = useTranslations('Order')
    const [orderId, setOrderId] = useState<string>('')
    const [submittedId, setSubmittedId] = useState<string | null>(null)

    const { error, data, isLoading } = useSWR<OrderResponse>(
        submittedId ? [`Order_${submittedId}`] : null,
        () => getOrderById(submittedId!)
    )

    // Auto-fill and submit if order_id is in URL
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            const urlOrderId = params.get('order_id')
            if (urlOrderId && !submittedId) {
                setOrderId(urlOrderId)
                setSubmittedId(urlOrderId)
            }
        }
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (orderId.trim()) {
            setSubmittedId(orderId.trim())
        }
    }

    const getStatusIndex = (status: OrderStatus) => {
        return statusSteps.findIndex((step) => step.status === status)
    }

    const currentStatusIndex = data?.order ? getStatusIndex(data.order.status) : -1

    return (
        <div className="max-w-4xl mx-auto my-8 min-h-screen px-8 sm:px-16">
            <div className="track-header">
                <BiSearch className="track-header-icon" />
                <div>
                    <h1 className="track-header-title">{t('trackMyOrder')}</h1>
                    <p className="track-header-subtitle">{t('enterOrderId')}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="track-search-form">
                <div className="track-search-input-wrapper">
                    <BiSearch className="track-search-icon" />
                    <input
                        type="text"
                        id="orderId"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder={t('orderIdPlaceholder')}
                        className="track-search-input"
                        autoComplete="off"
                    />
                </div>
                <button type="submit" disabled={!orderId.trim()} className="track-search-button">
                    <Search size={18} />
                    <span>{t('trackOrderButton')}</span>
                </button>
            </form>

            {isLoading && (
                <div className="track-loading">
                    <Loader2 className="track-loading-spinner" size={48} />
                    <p className="track-loading-text">{t('loading')}</p>
                </div>
            )}

            {error && (
                <div className="track-error">
                    <BiError size={48} className="track-error-icon" />
                    <p className="track-error-text">{t('failedToLoadOrder')}</p>
                </div>
            )}

            {data && data.order && (
                <div className="track-result">
                    <div className="track-info-card">
                        <div className="track-info-header">
                            <Package size={24} className="track-info-icon" />
                            <div>
                                <h2 className="track-info-title">
                                    {t('order')} #{data.order.id.substring(0, 12)}
                                </h2>
                                <div className="track-info-date">
                                    <BiCalendar size={14} />
                                    <span>
                                        {t('placedOn')}:{' '}
                                        {dayjs(data.order.createdAt).format('MMM DD, YYYY • HH:mm')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="track-info-price">
                            <BiDollar size={20} />
                            <span className="track-info-price-label">{t('totalPrice')}:</span>
                            <span className="track-info-price-value">
                                ${data.order.totalPrice.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="track-timeline-card">
                        <h3 className="track-timeline-title">{t('orderStatus')}</h3>

                        <div className="track-timeline">
                            {statusSteps.map((step, index) => {
                                const Icon = step.icon
                                const isActive = index === currentStatusIndex
                                const isCompleted = index < currentStatusIndex
                                const isCancelled =
                                    data.order.status === OrderStatus.CANCELLED &&
                                    step.status === OrderStatus.CANCELLED

                                return (
                                    <div key={index} className="track-timeline-item">
                                        <div className="track-timeline-line-wrapper">
                                            {index < statusSteps.length - 1 && (
                                                <div
                                                    className={`track-timeline-line ${
                                                        isCompleted
                                                            ? 'track-timeline-line-completed'
                                                            : ''
                                                    }`}
                                                />
                                            )}
                                        </div>

                                        <div
                                            className={`track-timeline-dot ${
                                                isCancelled
                                                    ? 'track-timeline-dot-cancelled'
                                                    : isActive
                                                      ? 'track-timeline-dot-active'
                                                      : isCompleted
                                                        ? 'track-timeline-dot-completed'
                                                        : 'track-timeline-dot-pending'
                                            }`}>
                                            {isCompleted && !isCancelled ? (
                                                <Check size={16} />
                                            ) : isCancelled ? (
                                                <XCircle size={16} />
                                            ) : (
                                                <Icon size={16} />
                                            )}
                                        </div>

                                        <div className="track-timeline-content">
                                            <p
                                                className={`track-timeline-label ${
                                                    isCancelled
                                                        ? 'track-timeline-label-cancelled'
                                                        : isActive
                                                          ? 'track-timeline-label-active'
                                                          : isCompleted
                                                            ? 'track-timeline-label-completed'
                                                            : 'track-timeline-label-pending'
                                                }`}>
                                                {t(step.label)}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {data.order.status === OrderStatus.CANCELLED && (
                            <div className="track-cancelled-message">
                                <BiX size={20} />
                                <p>{t('orderCancelled')}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Content
