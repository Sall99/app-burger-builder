'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Copy,
    Download,
    ExternalLink,
    Eye,
    Loader2,
    MapPin,
    RefreshCw,
    Search,
    Trash2
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { Modal } from '@/components/ui/modal/modal'
import { OrderWithDetails } from '@/types/admin'
import { totalFormatter } from '@/utils/utils'

const STATUS_OPTIONS = ['PENDING', 'PROCESSING', 'COMPLETED', 'DELIVERED', 'CANCELLED'] as const

export default function AdminOrdersPage() {
    const t = useTranslations('Admin.Orders')
    const locale = useLocale()
    const isFr = locale === 'fr'

    const [orders, setOrders] = useState<OrderWithDetails[]>([])
    const [summary, setSummary] = useState({
        ALL: 0,
        PENDING: 0,
        PROCESSING: 0,
        COMPLETED: 0,
        DELIVERED: 0,
        CANCELLED: 0,
        PAID: 0,
        UNPAID: 0
    })
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [statusFilter, setStatusFilter] = useState('')
    const [paymentFilter, setPaymentFilter] = useState('')
    const [sortBy, setSortBy] = useState('newest')
    const [search, setSearch] = useState('')
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [inspectingOrder, setInspectingOrder] = useState<OrderWithDetails | null>(null)
    const [busyId, setBusyId] = useState<string | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlStatus = new URLSearchParams(window.location.search).get('status')
            if (urlStatus && STATUS_OPTIONS.includes(urlStatus as any)) {
                setStatusFilter(urlStatus)
            }
        }
    }, [])

    const fetchOrders = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                sort: sortBy
            })
            if (statusFilter) params.append('status', statusFilter)
            if (paymentFilter) params.append('payment', paymentFilter)
            if (search.trim()) params.append('search', search.trim())

            const response = await fetch(`/api/admin/orders?${params}`, { cache: 'no-store' })
            if (response.ok) {
                const data = await response.json()
                setOrders(data.orders || [])
                if (data.summary) setSummary(data.summary)
                setTotalPages(data.pagination?.totalPages || 1)
            }
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setLoading(false)
        }
    }, [page, statusFilter, paymentFilter, sortBy, search])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchOrders()
        }, 200)
        return () => clearTimeout(timer)
    }, [fetchOrders])

    const handleQuickUpdate = async (
        orderId: string,
        patch: { status?: string; payment_status?: boolean }
    ) => {
        setBusyId(orderId)
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, ...patch })
            })
            if (res.ok) {
                const updated = await res.json()
                toast.success(isFr ? 'Commande mise à jour' : 'Order updated')
                if (inspectingOrder?.id === orderId) {
                    setInspectingOrder(updated)
                }
                await fetchOrders()
            } else {
                toast.error(isFr ? 'Échec de la mise à jour' : 'Update failed')
            }
        } catch {
            toast.error(isFr ? 'Erreur réseau' : 'Network error')
        } finally {
            setBusyId(null)
        }
    }

    const handleBulkUpdate = async (patch: { status?: string; payment_status?: boolean }) => {
        if (selectedIds.length === 0) return
        setBusyId('bulk')
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderIds: selectedIds, ...patch })
            })
            if (res.ok) {
                toast.success(
                    isFr
                        ? `${selectedIds.length} commande(s) mise(s) à jour`
                        : `${selectedIds.length} order(s) updated`
                )
                setSelectedIds([])
                await fetchOrders()
            }
        } catch {
            toast.error(isFr ? 'Erreur lors du traitement groupé' : 'Bulk update failed')
        } finally {
            setBusyId(null)
        }
    }

    const handleDeleteOrder = async (orderId: string) => {
        if (
            !window.confirm(
                isFr
                    ? 'Supprimer définitivement cette commande ?'
                    : 'Permanently delete this order?'
            )
        ) {
            return
        }
        setBusyId(orderId)
        try {
            const res = await fetch(`/api/admin/orders?id=${orderId}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success(isFr ? 'Commande supprimée' : 'Order deleted')
                if (inspectingOrder?.id === orderId) setInspectingOrder(null)
                setSelectedIds((prev) => prev.filter((id) => id !== orderId))
                await fetchOrders()
            }
        } catch {
            toast.error(isFr ? 'Impossible de supprimer' : 'Delete failed')
        } finally {
            setBusyId(null)
        }
    }

    const handleExportCsv = () => {
        if (orders.length === 0) return
        const headers = [
            'OrderID',
            'Date',
            'Customer',
            'Email',
            'Address',
            'City',
            'AmountUSD',
            'Status',
            'Paid'
        ]
        const rows = orders.map((o) => [
            o.id,
            new Date(o.createdAt).toISOString(),
            `"${(o.user?.name || '').replace(/"/g, '""')}"`,
            o.user?.email || '',
            `"${(o.shippingAdresse?.streetAddress || '').replace(/"/g, '""')}"`,
            `"${(o.shippingAdresse?.town || '').replace(/"/g, '""')}"`,
            o.totalPrice.toFixed(2),
            o.status,
            o.payment_status ? 'YES' : 'NO'
        ])
        const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `orders-export-${new Date().toISOString().slice(0, 10)}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    const toggleSelectAll = () => {
        if (selectedIds.length === orders.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(orders.map((o) => o.id))
        }
    }

    const toggleSelectOne = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    const statusTabs = [
        { id: '', label: isFr ? 'Toutes' : 'All', count: summary.ALL },
        { id: 'PENDING', label: t('pending'), count: summary.PENDING },
        { id: 'PROCESSING', label: t('processing'), count: summary.PROCESSING },
        { id: 'COMPLETED', label: t('completed'), count: summary.COMPLETED },
        { id: 'DELIVERED', label: t('delivered'), count: summary.DELIVERED },
        { id: 'CANCELLED', label: t('cancelled'), count: summary.CANCELLED }
    ]

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
                        {t('title')}
                    </h1>
                    <p className="mt-0.5 text-sm text-ink-muted">{t('subtitle')}</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleExportCsv}
                        disabled={orders.length === 0}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-white px-3 py-2 text-xs font-semibold text-ink hover:bg-surface transition-colors disabled:opacity-40">
                        <Download size={13} />
                        <span>Export CSV</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => fetchOrders()}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-white px-3 py-2 text-xs font-semibold text-ink hover:bg-surface transition-colors">
                        <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                        <span>{isFr ? 'Actualiser' : 'Refresh'}</span>
                    </button>
                </div>
            </div>

            {/* Pipeline Status Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
                {statusTabs.map((tab) => {
                    const active = statusFilter === tab.id
                    return (
                        <button
                            key={tab.id || 'ALL'}
                            type="button"
                            onClick={() => {
                                setStatusFilter(tab.id)
                                setPage(1)
                            }}
                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                active
                                    ? 'bg-ink text-white'
                                    : 'border border-surface-border bg-white text-ink-muted hover:text-ink'
                            }`}>
                            <span>{tab.label}</span>
                            <span
                                className={`rounded px-1.5 py-0.5 text-[10px] tabular-nums ${
                                    active ? 'bg-white/20 text-white' : 'bg-surface text-ink'
                                }`}>
                                {tab.count}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Search & Filters Toolbar */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                <div className="relative sm:col-span-6">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                        placeholder={
                            isFr
                                ? 'Rechercher par ID, nom, e-mail ou ville...'
                                : 'Search by order ID, name, email, or city...'
                        }
                        className="w-full rounded-lg border border-surface-border bg-white py-2 pl-10 pr-4 text-sm text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none"
                    />
                </div>

                <div className="sm:col-span-3">
                    <select
                        value={paymentFilter}
                        onChange={(e) => {
                            setPaymentFilter(e.target.value)
                            setPage(1)
                        }}
                        className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm font-medium text-ink focus:border-ink focus:outline-none">
                        <option value="">
                            {isFr
                                ? `Tous paiements (${summary.ALL})`
                                : `All payments (${summary.ALL})`}
                        </option>
                        <option value="paid">
                            {t('paid')} ({summary.PAID})
                        </option>
                        <option value="unpaid">
                            {t('unpaid')} ({summary.UNPAID})
                        </option>
                    </select>
                </div>

                <div className="sm:col-span-3">
                    <select
                        value={sortBy}
                        onChange={(e) => {
                            setSortBy(e.target.value)
                            setPage(1)
                        }}
                        className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm font-medium text-ink focus:border-ink focus:outline-none">
                        <option value="newest">
                            {isFr ? 'Plus récentes' : 'Newest first'}
                        </option>
                        <option value="oldest">
                            {isFr ? 'Plus anciennes' : 'Oldest first'}
                        </option>
                        <option value="highest">
                            {isFr ? 'Montant décroissant' : 'Highest amount'}
                        </option>
                        <option value="lowest">
                            {isFr ? 'Montant croissant' : 'Lowest amount'}
                        </option>
                    </select>
                </div>
            </div>

            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink bg-white px-4 py-3">
                    <span className="text-xs font-semibold text-ink tabular-nums">
                        {selectedIds.length}{' '}
                        {isFr ? 'commande(s) sélectionnée(s)' : 'order(s) selected'}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                        {STATUS_OPTIONS.map((st) => (
                            <button
                                key={st}
                                type="button"
                                disabled={busyId === 'bulk'}
                                onClick={() => handleBulkUpdate({ status: st })}
                                className="rounded-md border border-surface-border bg-surface px-2.5 py-1 text-xs font-semibold text-ink hover:bg-surface-muted disabled:opacity-40">
                                → {st}
                            </button>
                        ))}
                        <button
                            type="button"
                            disabled={busyId === 'bulk'}
                            onClick={() => handleBulkUpdate({ payment_status: true })}
                            className="rounded-md bg-ink px-2.5 py-1 text-xs font-semibold text-white hover:bg-charcoal-light disabled:opacity-40">
                            {isFr ? 'Marquer payées' : 'Mark paid'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedIds([])}
                            className="px-2 py-1 text-xs text-ink-muted hover:text-ink">
                            {t('cancel')}
                        </button>
                    </div>
                </div>
            )}

            {/* Orders Table */}
            <div className="overflow-hidden rounded-xl border border-surface-border bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-surface-border bg-surface/60 text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                            <tr>
                                <th className="w-10 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={
                                            orders.length > 0 &&
                                            selectedIds.length === orders.length
                                        }
                                        onChange={toggleSelectAll}
                                        aria-label="Select all orders"
                                        className="h-4 w-4 rounded accent-ink cursor-pointer"
                                    />
                                </th>
                                <th className="px-4 py-3">{t('orderId')}</th>
                                <th className="px-4 py-3">{t('customer')}</th>
                                <th className="px-4 py-3">
                                    {isFr ? 'Livraison' : 'Delivery'}
                                </th>
                                <th className="px-4 py-3">{t('amount')}</th>
                                <th className="px-4 py-3">{t('paymentStatus')}</th>
                                <th className="px-4 py-3">{t('status')}</th>
                                <th className="px-4 py-3 text-right">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-border">
                            {loading && orders.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-16 text-center">
                                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-ink-subtle" />
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-12 text-center text-sm text-ink-muted">
                                        {t('noOrders')}
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => {
                                    const isSelected = selectedIds.includes(order.id)
                                    const isBusy = busyId === order.id
                                    return (
                                        <tr
                                            key={order.id}
                                            className={`transition-colors ${
                                                isSelected
                                                    ? 'bg-surface/80'
                                                    : 'hover:bg-surface/40'
                                            }`}>
                                            <td className="px-4 py-3.5">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleSelectOne(order.id)}
                                                    aria-label={`Select order ${order.id}`}
                                                    className="h-4 w-4 rounded accent-ink cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-4 py-3.5 tabular-nums text-xs">
                                                <div className="font-semibold text-ink">
                                                    #{order.id.slice(-8)}
                                                </div>
                                                <div className="text-[11px] text-ink-subtle">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="text-xs font-semibold text-ink">
                                                    {order.user?.name || 'N/A'}
                                                </div>
                                                <div className="text-[11px] text-ink-muted">
                                                    {order.user?.email}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-xs text-ink-muted">
                                                {order.shippingAdresse ? (
                                                    <div>
                                                        <div className="font-medium text-ink">
                                                            {order.shippingAdresse.town}
                                                        </div>
                                                        <div className="truncate max-w-[160px] text-[11px]">
                                                            {order.shippingAdresse.streetAddress}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-ink-subtle">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 tabular-nums text-sm font-bold text-ink">
                                                {totalFormatter.format(order.totalPrice)}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <button
                                                    type="button"
                                                    disabled={isBusy}
                                                    onClick={() =>
                                                        handleQuickUpdate(order.id, {
                                                            payment_status: !order.payment_status
                                                        })
                                                    }
                                                    title={
                                                        isFr
                                                            ? 'Cliquer pour basculer le statut de paiement'
                                                            : 'Click to toggle payment status'
                                                    }
                                                    className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors ${
                                                        order.payment_status
                                                            ? 'bg-fresh-50 text-fresh-700 hover:bg-fresh-100'
                                                            : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                                                    }`}>
                                                    {order.payment_status ? (
                                                        <>
                                                            <CheckCircle2 size={12} />
                                                            <span>{t('paid')}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Clock size={12} />
                                                            <span>{t('unpaid')}</span>
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <select
                                                    value={order.status}
                                                    disabled={isBusy}
                                                    onChange={(e) =>
                                                        handleQuickUpdate(order.id, {
                                                            status: e.target.value
                                                        })
                                                    }
                                                    className="rounded-lg border border-surface-border bg-white px-2.5 py-1 text-xs font-semibold text-ink focus:border-ink focus:outline-none">
                                                    {STATUS_OPTIONS.map((st) => (
                                                        <option key={st} value={st}>
                                                            {st}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <div className="inline-flex items-center justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setInspectingOrder(order)}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-surface-border bg-white px-2.5 py-1.5 text-xs font-semibold text-ink hover:bg-surface transition-colors">
                                                        <Eye size={13} />
                                                        <span>
                                                            {isFr ? 'Détails' : 'Details'}
                                                        </span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={isBusy}
                                                        onClick={() => handleDeleteOrder(order.id)}
                                                        aria-label="Delete order"
                                                        className="rounded-lg p-1.5 text-ink-subtle hover:bg-red-50 hover:text-red-600 transition-colors">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-surface-border px-5 py-3.5">
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface disabled:opacity-40">
                            <ChevronLeft className="h-3.5 w-3.5" />
                            {isFr ? 'Précédent' : 'Previous'}
                        </button>
                        <span className="text-xs font-medium text-ink-muted tabular-nums">
                            Page {page} / {totalPages}
                        </span>
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface disabled:opacity-40">
                            {isFr ? 'Suivant' : 'Next'}
                            <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Order Inspector Modal */}
            <Modal
                isOpen={Boolean(inspectingOrder)}
                setIsOpen={(open) => {
                    if (!open) setInspectingOrder(null)
                }}
                title={
                    inspectingOrder
                        ? `${isFr ? 'Commande' : 'Order'} #${inspectingOrder.id.slice(-8)}`
                        : ''
                }
                content={
                    inspectingOrder ? (
                        <div className="space-y-5 text-sm">
                            {/* ID & Copy */}
                            <div className="flex items-center justify-between gap-2 rounded-lg border border-surface-border bg-surface/60 px-3.5 py-2.5 text-xs">
                                <span className="tabular-nums font-medium text-ink-muted truncate">
                                    ID: {inspectingOrder.id}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(inspectingOrder.id)
                                        toast.success(isFr ? 'ID copié' : 'Order ID copied')
                                    }}
                                    className="inline-flex items-center gap-1 font-semibold text-ink hover:underline shrink-0">
                                    <Copy size={12} />
                                    <span>{isFr ? 'Copier' : 'Copy'}</span>
                                </button>
                            </div>

                            {/* Customer + Delivery Info */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="rounded-lg border border-surface-border p-3.5 space-y-1">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                                        {t('customer')}
                                    </p>
                                    <p className="font-semibold text-ink">
                                        {inspectingOrder.user?.name || 'N/A'}
                                    </p>
                                    <p className="text-xs text-ink-muted">
                                        {inspectingOrder.user?.email}
                                    </p>
                                </div>

                                <div className="rounded-lg border border-surface-border p-3.5 space-y-1">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                                        {t('shippingAddress')}
                                    </p>
                                    {inspectingOrder.shippingAdresse ? (
                                        <>
                                            <p className="font-semibold text-ink">
                                                {inspectingOrder.shippingAdresse.firstName}{' '}
                                                {inspectingOrder.shippingAdresse.lastName}
                                            </p>
                                            <p className="text-xs text-ink-muted">
                                                {inspectingOrder.shippingAdresse.streetAddress},{' '}
                                                {inspectingOrder.shippingAdresse.town}
                                            </p>
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                    `${inspectingOrder.shippingAdresse.streetAddress}, ${inspectingOrder.shippingAdresse.town}`
                                                )}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 pt-1 text-xs font-semibold text-ink hover:underline">
                                                <MapPin size={12} />
                                                <span>Google Maps</span>
                                                <ExternalLink size={11} />
                                            </a>
                                        </>
                                    ) : (
                                        <p className="text-xs text-ink-subtle">
                                            {isFr ? 'Non renseignée' : 'Not provided'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Pipeline Switcher */}
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-ink">
                                    {isFr ? 'Étape de la commande' : 'Order Pipeline Stage'}
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                                    {STATUS_OPTIONS.map((st) => {
                                        const active = inspectingOrder.status === st
                                        return (
                                            <button
                                                key={st}
                                                type="button"
                                                onClick={() =>
                                                    handleQuickUpdate(inspectingOrder.id, {
                                                        status: st
                                                    })
                                                }
                                                className={`rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors ${
                                                    active
                                                        ? 'bg-ink text-white'
                                                        : 'border border-surface-border bg-white text-ink-muted hover:bg-surface hover:text-ink'
                                                }`}>
                                                {st}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Payment & Total */}
                            <div className="flex items-center justify-between rounded-lg border border-surface-border bg-surface/50 p-4">
                                <div>
                                    <p className="text-xs text-ink-muted">{t('amount')}</p>
                                    <p className="font-display text-xl font-bold text-ink tabular-nums">
                                        {totalFormatter.format(inspectingOrder.totalPrice)}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleQuickUpdate(inspectingOrder.id, {
                                            payment_status: !inspectingOrder.payment_status
                                        })
                                    }
                                    className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                                        inspectingOrder.payment_status
                                            ? 'bg-fresh-600 text-white'
                                            : 'bg-ink text-white hover:bg-charcoal-light'
                                    }`}>
                                    <CheckCircle2 size={14} />
                                    <span>
                                        {inspectingOrder.payment_status
                                            ? isFr
                                                ? 'Payée (cliquer pour annuler)'
                                                : 'Paid (click to unset)'
                                            : isFr
                                              ? 'Marquer comme payée'
                                              : 'Mark as Paid'}
                                    </span>
                                </button>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex items-center justify-between pt-2 border-t border-surface-border">
                                <button
                                    type="button"
                                    onClick={() => handleDeleteOrder(inspectingOrder.id)}
                                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">
                                    <Trash2 size={14} />
                                    <span>
                                        {isFr ? 'Supprimer la commande' : 'Delete order'}
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setInspectingOrder(null)}
                                    className="rounded-lg border border-surface-border bg-white px-4 py-2 text-xs font-semibold text-ink hover:bg-surface">
                                    {isFr ? 'Fermer' : 'Close'}
                                </button>
                            </div>
                        </div>
                    ) : null
                }
            />
        </div>
    )
}
