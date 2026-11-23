'use client'

import React from 'react'
import { CheckCircle2, Clock, Package, Truck, XCircle } from 'lucide-react'
import { useLocale } from 'next-intl'

interface OrderStatusBadgeProps {
    status: string
}

const STATUS_MAP: Record<
    string,
    {
        fr: string
        en: string
        classes: string
        Icon: typeof Clock
    }
> = {
    PENDING: {
        fr: 'En attente',
        en: 'Pending',
        classes: 'bg-amber-50 text-amber-800 ring-amber-300/80',
        Icon: Clock
    },
    PROCESSING: {
        fr: 'En préparation',
        en: 'Processing',
        classes: 'bg-sky-50 text-sky-800 ring-sky-300/80',
        Icon: Package
    },
    COMPLETED: {
        fr: 'Prête',
        en: 'Completed',
        classes: 'bg-emerald-50 text-emerald-800 ring-emerald-300/80',
        Icon: CheckCircle2
    },
    DELIVERED: {
        fr: 'Livrée',
        en: 'Delivered',
        classes: 'bg-basil-50 text-basil-700 ring-basil-600/25',
        Icon: Truck
    },
    CANCELLED: {
        fr: 'Annulée',
        en: 'Cancelled',
        classes: 'bg-red-50 text-red-700 ring-red-200',
        Icon: XCircle
    }
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
    const locale = useLocale()
    const isFr = locale === 'fr'
    const config = STATUS_MAP[status?.toUpperCase()] || STATUS_MAP.PENDING
    const Icon = config.Icon

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${config.classes}`}>
            <Icon size={12} aria-hidden="true" />
            <span>{isFr ? config.fr : config.en}</span>
        </span>
    )
}

export const PaymentStatusBadge: React.FC<{ paid: boolean }> = ({ paid }) => {
    const locale = useLocale()
    const isFr = locale === 'fr'

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${
                paid
                    ? 'bg-basil-50 text-basil-700 ring-basil-600/25'
                    : 'bg-amber-50 text-amber-800 ring-amber-300/80'
            }`}>
            {paid ? (
                <>
                    <CheckCircle2 size={12} aria-hidden="true" />
                    <span>{isFr ? 'Payée' : 'Paid'}</span>
                </>
            ) : (
                <>
                    <Clock size={12} aria-hidden="true" />
                    <span>{isFr ? 'Non payée' : 'Unpaid'}</span>
                </>
            )}
        </span>
    )
}
