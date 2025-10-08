'use client'

import React from 'react'
import { BiBox, BiCalendar, BiCheck, BiDollar, BiMap, BiReceipt, BiShow } from 'react-icons/bi'
import dayjs from 'dayjs'
import Link from 'next/link'
import { Package, ShoppingBag } from 'lucide-react'
import { useTranslations } from 'next-intl'
import useSWR from 'swr'

import { getOrders } from '@/actions/orders'
import { OrderWithShippingAddress } from '@/types'

const Content = () => {
    const t = useTranslations('Orders')
    const { error, data, isLoading } = useSWR(['Orders'], getOrders, {
        revalidateOnFocus: false
    })

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto my-8 min-h-screen flex items-center justify-center">
                <div className="history-loading">
                    <div className="history-loading-spinner" />
                    <p>{t('Loading')}</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto my-8 min-h-screen flex items-center justify-center">
                <div className="history-error">
                    <p>{t('LoadError')}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto my-8 min-h-screen px-8 sm:px-16">
            <div className="history-header">
                <BiReceipt className="history-header-icon" />
                <div>
                    <h1 className="history-header-title">{t('OrderHistory')}</h1>
                    <p className="history-header-subtitle">
                        {data?.orders?.length || 0}{' '}
                        {data?.orders?.length === 1 ? t('Order') : t('Orders')}
                    </p>
                </div>
            </div>

            {data && data?.orders?.length > 0 ? (
                <div className="history-list">
                    {data.orders.map(
                        ({
                            id,
                            createdAt,
                            payment_status,
                            status,
                            shippingAdresse,
                            totalPrice
                        }: OrderWithShippingAddress) => (
                            <div key={id} className="history-order-card">
                                <div className="history-order-header">
                                    <div className="history-order-icon-wrapper">
                                        <ShoppingBag size={24} className="history-order-icon" />
                                    </div>
                                    <div className="history-order-header-info">
                                        <h2 className="history-order-id">
                                            {t('Order')} #{id.substring(0, 8)}
                                        </h2>
                                        <div className="history-order-date">
                                            <BiCalendar size={14} />
                                            <span>
                                                {dayjs(createdAt).format('MMM DD, YYYY • HH:mm')}
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className={`history-order-badge ${payment_status ? 'history-order-badge-paid' : 'history-order-badge-pending'}`}>
                                        {payment_status ? (
                                            <>
                                                <BiCheck size={16} />
                                                <span>{t('Paid')}</span>
                                            </>
                                        ) : (
                                            <span>{t('Pending')}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="history-order-content">
                                    <div className="history-order-detail">
                                        <div className="history-order-detail-icon">
                                            <BiDollar size={18} />
                                        </div>
                                        <div className="history-order-detail-info">
                                            <p className="history-order-detail-label">
                                                {t('TotalPrice')}
                                            </p>
                                            <p className="history-order-detail-value">
                                                ${totalPrice.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="history-order-detail">
                                        <div className="history-order-detail-icon">
                                            <BiBox size={18} />
                                        </div>
                                        <div className="history-order-detail-info">
                                            <p className="history-order-detail-label">
                                                {t('Status')}
                                            </p>
                                            <p className="history-order-detail-value history-order-status">
                                                {status}
                                            </p>
                                        </div>
                                    </div>

                                    {shippingAdresse && (
                                        <div className="history-order-detail history-order-detail-full">
                                            <div className="history-order-detail-icon">
                                                <BiMap size={18} />
                                            </div>
                                            <div className="history-order-detail-info">
                                                <p className="history-order-detail-label">
                                                    {t('ShippingAddress')}
                                                </p>
                                                <p className="history-order-detail-value">
                                                    {shippingAdresse.streetAddress}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="history-order-footer">
                                    <Link
                                        href={`/track-order?order_id=${id}`}
                                        className="history-order-track-button">
                                        <BiShow size={18} />
                                        <span>{t('TrackOrder')}</span>
                                    </Link>
                                </div>
                            </div>
                        )
                    )}
                </div>
            ) : (
                <div className="history-empty">
                    <Package size={64} className="history-empty-icon" />
                    <p className="history-empty-title">{t('NoOrders')}</p>
                    <p className="history-empty-subtitle">{t('NoOrdersDesc')}</p>
                </div>
            )}
        </div>
    )
}

export default Content
