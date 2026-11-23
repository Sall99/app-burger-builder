'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
    ArrowRight,
    Award,
    CheckCircle2,
    Clock,
    DollarSign,
    Loader2,
    Package,
    RefreshCw,
    Ticket,
    TrendingUp,
    Users
} from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

import { StatCard } from '@/components/admin/stat-card'
import { AdminStats } from '@/types/admin'
import { totalFormatter } from '@/utils/utils'

const NEXT_STATUS_MAP: Record<string, { next: string; labelFr: string; labelEn: string }> = {
    PENDING: { next: 'PROCESSING', labelFr: 'Lancer cuisine', labelEn: 'Start cooking' },
    PROCESSING: { next: 'COMPLETED', labelFr: 'Marquer prête', labelEn: 'Mark ready' },
    COMPLETED: { next: 'DELIVERED', labelFr: 'Marquer livrée', labelEn: 'Mark delivered' }
}

export default function AdminDashboard() {
    const t = useTranslations('Admin.Dashboard')
    const locale = useLocale()
    const isFr = locale === 'fr'
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [chartMode, setChartMode] = useState<'revenue' | 'orders'>('revenue')
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

    const fetchStats = useCallback(async (isManual = false) => {
        if (isManual) setRefreshing(true)
        try {
            const response = await fetch('/api/admin/stats', { cache: 'no-store' })
            if (response.ok) {
                const data = await response.json()
                setStats(data)
            }
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [])

    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    const handleAdvanceOrder = async (orderId: string, nextStatus: string) => {
        setUpdatingOrderId(orderId)
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: nextStatus })
            })
            if (res.ok) {
                toast.success(
                    isFr ? `Statut passé à ${nextStatus}` : `Order moved to ${nextStatus}`
                )
                await fetchStats()
            }
        } catch {
            toast.error(isFr ? 'Erreur lors de la mise à jour' : 'Failed to update order')
        } finally {
            setUpdatingOrderId(null)
        }
    }

    const handleMarkPaid = async (orderId: string) => {
        setUpdatingOrderId(orderId)
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, payment_status: true })
            })
            if (res.ok) {
                toast.success(isFr ? 'Commande marquée payée' : 'Order marked as paid')
                await fetchStats()
            }
        } catch {
            toast.error(isFr ? 'Erreur' : 'Update failed')
        } finally {
            setUpdatingOrderId(null)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-7 w-7 animate-spin text-ink-subtle" />
            </div>
        )
    }

    const series = stats?.dailySeries || []
    const maxSeriesValue = Math.max(
        1,
        ...series.map((d) => (chartMode === 'revenue' ? d.revenue : d.orders))
    )
    const fourteenDayRevenue = series.reduce((sum, d) => sum + d.revenue, 0)
    const fourteenDayOrders = series.reduce((sum, d) => sum + d.orders, 0)

    const statusRows = [
        {
            key: 'PENDING' as const,
            label: isFr ? 'En attente' : 'Pending',
            count: stats?.statusBreakdown?.PENDING || 0,
            barClass: 'bg-amber-500'
        },
        {
            key: 'PROCESSING' as const,
            label: isFr ? 'En préparation' : 'Processing',
            count: stats?.statusBreakdown?.PROCESSING || 0,
            barClass: 'bg-sky-500'
        },
        {
            key: 'COMPLETED' as const,
            label: isFr ? 'Prêtes' : 'Completed',
            count: stats?.statusBreakdown?.COMPLETED || 0,
            barClass: 'bg-ink'
        },
        {
            key: 'DELIVERED' as const,
            label: isFr ? 'Livrées' : 'Delivered',
            count: stats?.statusBreakdown?.DELIVERED || 0,
            barClass: 'bg-fresh-600'
        },
        {
            key: 'CANCELLED' as const,
            label: isFr ? 'Annulées' : 'Cancelled',
            count: stats?.statusBreakdown?.CANCELLED || 0,
            barClass: 'bg-red-500'
        }
    ]
    const totalStatusCount = Math.max(1, stats?.totalOrders || 0)

    return (
        <div className="space-y-6">
            {/* Header Bar */}
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
                        onClick={() => fetchStats(true)}
                        disabled={refreshing}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-white px-3 py-2 text-xs font-semibold text-ink hover:bg-surface transition-colors disabled:opacity-50">
                        <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                        <span>{isFr ? 'Actualiser' : 'Refresh'}</span>
                    </button>
                    <Link
                        href={`/${locale}/admin/orders`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 text-xs font-semibold text-white hover:bg-charcoal-light transition-colors">
                        <span>{isFr ? 'Toutes les commandes' : 'All Orders'}</span>
                        <ArrowRight size={13} />
                    </Link>
                </div>
            </div>

            {/* 4 Primary KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title={t('totalRevenue')}
                    value={totalFormatter.format(stats?.totalRevenue || 0)}
                    icon={DollarSign}
                    description={`${isFr ? 'Panier moyen :' : 'Avg order:'} ${totalFormatter.format(stats?.averageOrderValue || 0)}`}
                    trend={{
                        value: stats?.revenueGrowth || 0,
                        label: t('last30Days')
                    }}
                />
                <StatCard
                    title={t('totalOrders')}
                    value={stats?.totalOrders || 0}
                    icon={Package}
                    description={`${stats?.paidOrders || 0} ${isFr ? 'payées' : 'paid'} · ${stats?.unpaidOrders || 0} ${isFr ? 'non payées' : 'unpaid'}`}
                    trend={{
                        value: stats?.ordersGrowth || 0,
                        label: t('last30Days')
                    }}
                />
                <StatCard
                    title={t('pendingOrders')}
                    value={stats?.pendingOrders || 0}
                    icon={TrendingUp}
                    description={`${isFr ? 'Encours non payé :' : 'Unpaid pipeline:'} ${totalFormatter.format(stats?.unpaidRevenue || 0)}`}
                />
                <StatCard
                    title={t('totalUsers')}
                    value={stats?.totalUsers || 0}
                    icon={Users}
                    description={`${stats?.loyaltyMembers || 0} ${isFr ? 'membres fidélité' : 'loyalty members'} · ${stats?.activeCoupons || 0} ${isFr ? 'coupons actifs' : 'active coupons'}`}
                    trend={{
                        value: stats?.usersGrowth || 0,
                        label: t('last30Days')
                    }}
                />
            </div>

            {/* 14-Day Activity Chart + Pipeline Distribution */}
            <div className="grid gap-6 lg:grid-cols-12">
                {/* 14-Day Chart */}
                <section className="lg:col-span-8 rounded-xl border border-surface-border bg-white p-5 flex flex-col justify-between">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-surface-border">
                        <div>
                            <h2 className="font-display text-base font-bold text-ink">
                                {isFr
                                    ? 'Activité des 14 derniers jours'
                                    : 'Last 14 Days Performance'}
                            </h2>
                            <p className="text-xs text-ink-muted tabular-nums">
                                {chartMode === 'revenue'
                                    ? `${totalFormatter.format(fourteenDayRevenue)} ${isFr ? 'encaissés sur 14j' : 'collected over 14d'}`
                                    : `${fourteenDayOrders} ${isFr ? 'commandes sur 14j' : 'orders over 14d'}`}
                            </p>
                        </div>

                        <div className="inline-flex rounded-lg border border-surface-border bg-surface p-0.5 text-xs">
                            <button
                                type="button"
                                onClick={() => setChartMode('revenue')}
                                className={`rounded-md px-2.5 py-1 font-semibold transition-colors ${
                                    chartMode === 'revenue'
                                        ? 'bg-white text-ink shadow-soft'
                                        : 'text-ink-muted hover:text-ink'
                                }`}>
                                {isFr ? 'Revenus ($)' : 'Revenue ($)'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setChartMode('orders')}
                                className={`rounded-md px-2.5 py-1 font-semibold transition-colors ${
                                    chartMode === 'orders'
                                        ? 'bg-white text-ink shadow-soft'
                                        : 'text-ink-muted hover:text-ink'
                                }`}>
                                {isFr ? 'Commandes' : 'Orders'}
                            </button>
                        </div>
                    </div>

                    {/* Bars */}
                    <div className="mt-6 grid grid-cols-14 items-end gap-1.5 h-44 pt-4">
                        {series.map((pt) => {
                            const val = chartMode === 'revenue' ? pt.revenue : pt.orders
                            const heightPct =
                                val > 0 ? Math.max(10, Math.round((val / maxSeriesValue) * 100)) : 4
                            return (
                                <div
                                    key={pt.date}
                                    className="group relative flex h-full flex-col items-center justify-end"
                                    title={`${pt.label}: ${totalFormatter.format(pt.revenue)} (${pt.orders} cmd)`}>
                                    <div className="pointer-events-none absolute -top-7 z-10 hidden whitespace-nowrap rounded bg-ink px-1.5 py-0.5 text-[10px] font-semibold text-white tabular-nums group-hover:block">
                                        {chartMode === 'revenue'
                                            ? totalFormatter.format(pt.revenue)
                                            : `${pt.orders} cmd`}
                                    </div>
                                    <div className="flex h-36 w-full items-end justify-center">
                                        <div
                                            style={{ height: `${heightPct}%` }}
                                            className={`w-full max-w-[22px] rounded-t-md transition-all ${
                                                val > 0
                                                    ? 'bg-ink group-hover:bg-brand-500'
                                                    : 'bg-surface-muted'
                                            }`}
                                        />
                                    </div>
                                    <span className="mt-2 text-[10px] text-ink-subtle tabular-nums">
                                        {pt.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* Status Pipeline Breakdown */}
                <section className="lg:col-span-4 rounded-xl border border-surface-border bg-white p-5 flex flex-col justify-between space-y-4">
                    <div className="pb-3 border-b border-surface-border">
                        <h2 className="font-display text-base font-bold text-ink">
                            {isFr ? 'Pipeline des commandes' : 'Order Pipeline'}
                        </h2>
                        <p className="text-xs text-ink-muted">
                            {isFr
                                ? 'Cliquez sur un statut pour filtrer'
                                : 'Click any status to filter orders'}
                        </p>
                    </div>

                    <div className="space-y-3 flex-1">
                        {statusRows.map((row) => {
                            const pct = Math.round((row.count / totalStatusCount) * 100)
                            return (
                                <Link
                                    key={row.key}
                                    href={`/${locale}/admin/orders?status=${row.key}`}
                                    className="block rounded-lg p-2 -mx-2 hover:bg-surface transition-colors">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-medium text-ink">{row.label}</span>
                                        <span className="tabular-nums font-semibold text-ink">
                                            {row.count}{' '}
                                            <span className="font-normal text-ink-subtle">
                                                ({pct}%)
                                            </span>
                                        </span>
                                    </div>
                                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                                        <div
                                            className={`h-full rounded-full ${row.barClass}`}
                                            style={{ width: `${Math.max(pct, row.count > 0 ? 4 : 0)}%` }}
                                        />
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs">
                        <span className="text-ink-muted">
                            {isFr ? 'Coupons actifs' : 'Active coupons'}
                        </span>
                        <Link
                            href={`/${locale}/admin/coupons`}
                            className="inline-flex items-center gap-1 font-semibold text-ink hover:underline tabular-nums">
                            <Ticket size={13} />
                            <span>
                                {stats?.activeCoupons || 0} / {stats?.totalCoupons || 0}
                            </span>
                        </Link>
                    </div>
                </section>
            </div>

            {/* Live Recent Orders + Top Customers */}
            <div className="grid gap-6 lg:grid-cols-12">
                {/* Live Recent Orders with 1-Click Progression */}
                <section className="lg:col-span-8 rounded-xl border border-surface-border bg-white overflow-hidden">
                    <div className="flex items-center justify-between gap-4 border-b border-surface-border px-5 py-4">
                        <div>
                            <h2 className="font-display text-base font-bold text-ink">
                                {isFr ? 'Commandes récentes en direct' : 'Live Recent Orders'}
                            </h2>
                            <p className="text-xs text-ink-muted">
                                {isFr
                                    ? 'Avancez la préparation ou validez un paiement en 1 clic'
                                    : 'Advance kitchen status or mark paid in 1 click'}
                            </p>
                        </div>
                        <Link
                            href={`/${locale}/admin/orders`}
                            className="text-xs font-semibold text-ink hover:underline">
                            {isFr ? 'Voir tout →' : 'View all →'}
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-surface-border bg-surface/60 text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">
                                        {isFr ? 'Client & Ville' : 'Customer & City'}
                                    </th>
                                    <th className="px-4 py-3">{isFr ? 'Total' : 'Amount'}</th>
                                    <th className="px-4 py-3">{isFr ? 'Statut' : 'Status'}</th>
                                    <th className="px-4 py-3 text-right">
                                        {isFr ? 'Action rapide' : 'Quick Action'}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-border">
                                {(stats?.recentOrders || []).map((order) => {
                                    const nextStep = NEXT_STATUS_MAP[order.status]
                                    const isBusy = updatingOrderId === order.id
                                    return (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-surface/40 transition-colors">
                                            <td className="px-4 py-3 tabular-nums text-xs font-semibold text-ink">
                                                #{order.id.slice(-8)}
                                                <div className="text-[11px] font-normal text-ink-subtle">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-xs font-semibold text-ink">
                                                    {order.user?.name || 'Client'}
                                                </div>
                                                <div className="text-[11px] text-ink-muted truncate max-w-[180px]">
                                                    {order.shippingAdresse?.town
                                                        ? `${order.shippingAdresse.town} · ${order.user?.email || ''}`
                                                        : order.user?.email}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 tabular-nums text-xs font-bold text-ink">
                                                <div>{totalFormatter.format(order.totalPrice)}</div>
                                                <span
                                                    className={`inline-flex items-center gap-1 text-[10px] font-medium ${
                                                        order.payment_status
                                                            ? 'text-fresh-700'
                                                            : 'text-amber-700'
                                                    }`}>
                                                    {order.payment_status ? (
                                                        <>
                                                            <CheckCircle2 size={10} />
                                                            {isFr ? 'Payée' : 'Paid'}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Clock size={10} />
                                                            {isFr ? 'Non payée' : 'Unpaid'}
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                                                        order.status === 'DELIVERED' ||
                                                        order.status === 'COMPLETED'
                                                            ? 'bg-fresh-50 text-fresh-700'
                                                            : order.status === 'CANCELLED'
                                                              ? 'bg-red-50 text-red-700'
                                                              : 'bg-amber-50 text-amber-800'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="inline-flex items-center justify-end gap-1.5">
                                                    {!order.payment_status &&
                                                        order.status !== 'CANCELLED' && (
                                                            <button
                                                                type="button"
                                                                disabled={isBusy}
                                                                onClick={() =>
                                                                    handleMarkPaid(order.id)
                                                                }
                                                                className="rounded-md border border-surface-border bg-white px-2 py-1 text-[11px] font-semibold text-ink hover:bg-surface disabled:opacity-40">
                                                                {isFr ? 'Valider $' : 'Mark paid'}
                                                            </button>
                                                        )}
                                                    {nextStep ? (
                                                        <button
                                                            type="button"
                                                            disabled={isBusy}
                                                            onClick={() =>
                                                                handleAdvanceOrder(
                                                                    order.id,
                                                                    nextStep.next
                                                                )
                                                            }
                                                            className="rounded-md bg-ink px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-charcoal-light disabled:opacity-40">
                                                            {isFr
                                                                ? nextStep.labelFr
                                                                : nextStep.labelEn}
                                                        </button>
                                                    ) : (
                                                        <span className="text-[11px] text-ink-subtle">
                                                            —
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Top Customers Leaderboard */}
                <section className="lg:col-span-4 rounded-xl border border-surface-border bg-white p-5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                        <div>
                            <h2 className="font-display text-base font-bold text-ink">
                                {isFr ? 'Meilleurs clients' : 'Top Customers'}
                            </h2>
                            <p className="text-xs text-ink-muted">
                                {isFr ? 'Classés par volume commandé' : 'Ranked by order volume'}
                            </p>
                        </div>
                        <Link
                            href={`/${locale}/admin/users`}
                            className="text-xs font-semibold text-ink hover:underline">
                            {isFr ? 'Gérer →' : 'Manage →'}
                        </Link>
                    </div>

                    <div className="divide-y divide-surface-border">
                        {(stats?.topCustomers || []).length === 0 ? (
                            <p className="py-6 text-center text-xs text-ink-muted">
                                {isFr ? 'Aucun client avec commande' : 'No customer orders yet'}
                            </p>
                        ) : (
                            (stats?.topCustomers || []).map((cust, i) => (
                                <div
                                    key={cust.id}
                                    className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-1">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface text-xs font-bold text-ink tabular-nums">
                                            #{i + 1}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-semibold text-ink">
                                                {cust.name || cust.email}
                                            </p>
                                            <div className="flex items-center gap-1.5 text-[11px] text-ink-muted">
                                                <span className="tabular-nums">
                                                    {cust.ordersCount}{' '}
                                                    {isFr ? 'cmd' : 'orders'}
                                                </span>
                                                <span>·</span>
                                                <span className="inline-flex items-center gap-0.5 font-medium text-ink">
                                                    <Award size={10} />
                                                    {cust.tier}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="shrink-0 tabular-nums text-xs font-bold text-ink">
                                        {totalFormatter.format(cust.totalSpent)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
