'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
    ChevronLeft,
    ChevronRight,
    Copy,
    Edit,
    Loader2,
    Plus,
    RefreshCw,
    Search,
    Sparkles,
    Trash2,
    Wand2
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { Modal } from '@/components/ui/modal/modal'
import { CouponWithUsage } from '@/types/admin'

export default function AdminCouponsPage() {
    const t = useTranslations('Admin.Coupons')
    const locale = useLocale()
    const isFr = locale === 'fr'

    const [coupons, setCoupons] = useState<CouponWithUsage[]>([])
    const [summary, setSummary] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        totalRedemptions: 0
    })
    const [loading, setLoading] = useState(true)
    const [seeding, setSeeding] = useState(false)
    const [saving, setSaving] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [isCreating, setIsCreating] = useState(false)
    const [editingCoupon, setEditingCoupon] = useState<CouponWithUsage | null>(null)
    const [formData, setFormData] = useState<{
        code: string
        description: string
        discountType: string
        discountValue: string | number
        minOrderValue: string | number
        maxDiscount: string | number
        usageLimit: string | number
        userLimit: string | number
        validUntil: string
        isActive: boolean
    }>({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderValue: '',
        maxDiscount: '',
        usageLimit: '',
        userLimit: '',
        validUntil: '',
        isActive: true
    })

    const fetchCoupons = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10'
            })
            if (search.trim()) params.append('search', search.trim())
            if (statusFilter) params.append('status', statusFilter)

            const response = await fetch(`/api/admin/coupons?${params}`, { cache: 'no-store' })
            if (response.ok) {
                const data = await response.json()
                setCoupons(data.coupons || [])
                if (data.summary) setSummary(data.summary)
                setTotalPages(data.pagination?.totalPages || 1)
            }
        } catch (error) {
            console.error('Error fetching coupons:', error)
        } finally {
            setLoading(false)
        }
    }, [page, search, statusFilter])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCoupons()
        }, 200)
        return () => clearTimeout(timer)
    }, [fetchCoupons])

    const handleSeedDefaults = async () => {
        setSeeding(true)
        try {
            const res = await fetch('/api/admin/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'seed_defaults' })
            })
            if (res.ok) {
                toast.success(
                    isFr
                        ? 'Codes WELCOME10, SAVE5 et BURGER20 activés !'
                        : 'Default codes WELCOME10, SAVE5 & BURGER20 seeded!'
                )
                await fetchCoupons()
            }
        } catch {
            toast.error(isFr ? 'Erreur lors de la création' : 'Failed to seed coupons')
        } finally {
            setSeeding(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const method = editingCoupon ? 'PATCH' : 'POST'
            const payload = {
                ...(editingCoupon ? { couponId: editingCoupon.id } : {}),
                code: formData.code.trim().toUpperCase(),
                description: formData.description.trim() || null,
                discountType: formData.discountType,
                discountValue: formData.discountValue,
                minOrderValue: formData.minOrderValue === '' ? null : formData.minOrderValue,
                maxDiscount: formData.maxDiscount === '' ? null : formData.maxDiscount,
                usageLimit: formData.usageLimit === '' ? null : formData.usageLimit,
                userLimit: formData.userLimit === '' ? null : formData.userLimit,
                validUntil: formData.validUntil ? formData.validUntil : null,
                isActive: formData.isActive
            }

            const response = await fetch('/api/admin/coupons', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await response.json()
            if (response.ok) {
                toast.success(t('success'))
                await fetchCoupons()
                closeForm()
            } else {
                toast.error(data.error || t('error'))
            }
        } catch (error) {
            console.error('Error saving coupon:', error)
            toast.error(t('error'))
        } finally {
            setSaving(false)
        }
    }

    const handleToggleActive = async (coupon: CouponWithUsage) => {
        try {
            const res = await fetch('/api/admin/coupons', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    couponId: coupon.id,
                    isActive: !coupon.isActive
                })
            })
            if (res.ok) {
                toast.success(
                    !coupon.isActive
                        ? isFr
                            ? `${coupon.code} activé`
                            : `${coupon.code} enabled`
                        : isFr
                          ? `${coupon.code} désactivé`
                          : `${coupon.code} disabled`
                )
                await fetchCoupons()
            }
        } catch {
            toast.error(t('error'))
        }
    }

    const handleDelete = async (couponId: string) => {
        if (!window.confirm(t('confirmDelete'))) return

        try {
            const response = await fetch(`/api/admin/coupons?id=${couponId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                toast.success(isFr ? 'Coupon supprimé' : 'Coupon deleted')
                await fetchCoupons()
            }
        } catch (error) {
            console.error('Error deleting coupon:', error)
            toast.error(t('error'))
        }
    }

    const openEdit = (coupon: CouponWithUsage) => {
        setEditingCoupon(coupon)
        setFormData({
            code: coupon.code || '',
            description: coupon.description || '',
            discountType: coupon.discountType || 'percentage',
            discountValue: coupon.discountValue ?? '',
            minOrderValue: coupon.minOrderValue ?? '',
            maxDiscount: coupon.maxDiscount ?? '',
            usageLimit: coupon.usageLimit ?? '',
            userLimit: coupon.userLimit ?? '',
            validUntil: coupon.validUntil
                ? new Date(coupon.validUntil).toISOString().slice(0, 10)
                : '',
            isActive: coupon.isActive
        })
        setIsCreating(true)
    }

    const closeForm = () => {
        setIsCreating(false)
        setEditingCoupon(null)
        setFormData({
            code: '',
            description: '',
            discountType: 'percentage',
            discountValue: '',
            minOrderValue: '',
            maxDiscount: '',
            usageLimit: '',
            userLimit: '',
            validUntil: '',
            isActive: true
        })
    }

    const generateRandomCode = () => {
        const prefixes = ['SMASH', 'BURGER', 'CHEF', 'FRESH', 'VIP']
        const p = prefixes[Math.floor(Math.random() * prefixes.length)]
        const num = Math.floor(10 + Math.random() * 89)
        setFormData((prev) => ({ ...prev, code: `${p}${num}` }))
    }

    const fieldClass =
        'w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none'

    const couponFormContent = (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <div className="mb-1 flex items-center justify-between">
                    <label className="block text-xs font-semibold text-ink">
                        {t('couponCode')} *
                    </label>
                    <button
                        type="button"
                        onClick={generateRandomCode}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:underline">
                        <Wand2 size={11} />
                        <span>{isFr ? 'Générer' : 'Generate'}</span>
                    </button>
                </div>
                <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    placeholder="EX: BURGER20"
                    className={`${fieldClass} uppercase font-bold tracking-wider`}
                />
            </div>

            <div>
                <label className="mb-1 block text-xs font-semibold text-ink">
                    {t('discountType')} *
                </label>
                <select
                    required
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className={fieldClass}>
                    <option value="percentage">{t('percentage')} (%)</option>
                    <option value="fixed">{t('fixed')} ($)</option>
                </select>
            </div>

            <div>
                <label className="mb-1 block text-xs font-semibold text-ink">
                    {t('discountValue')} *
                </label>
                <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={formData.discountValue}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            discountValue: e.target.value
                        })
                    }
                    className={fieldClass}
                />
            </div>

            <div>
                <label className="mb-1 block text-xs font-semibold text-ink-muted">
                    {t('minOrderValue')} ({t('optional')})
                </label>
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.minOrderValue}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            minOrderValue: e.target.value
                        })
                    }
                    className={fieldClass}
                />
            </div>

            <div>
                <label className="mb-1 block text-xs font-semibold text-ink-muted">
                    {t('maxDiscountAmount')} ({t('optional')})
                </label>
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.maxDiscount}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            maxDiscount: e.target.value
                        })
                    }
                    className={fieldClass}
                />
            </div>

            <div>
                <label className="mb-1 block text-xs font-semibold text-ink-muted">
                    {t('totalUsageLimit')} ({t('optional')})
                </label>
                <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            usageLimit: e.target.value
                        })
                    }
                    className={fieldClass}
                />
            </div>

            <div>
                <label className="mb-1 block text-xs font-semibold text-ink-muted">
                    {t('perUserLimit')} ({t('optional')})
                </label>
                <input
                    type="number"
                    min="1"
                    value={formData.userLimit}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            userLimit: e.target.value
                        })
                    }
                    className={fieldClass}
                />
            </div>

            <div>
                <label className="mb-1 block text-xs font-semibold text-ink-muted">
                    {t('validUntil')} ({t('optional')})
                </label>
                <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            validUntil: e.target.value
                        })
                    }
                    className={fieldClass}
                />
            </div>

            <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-ink-muted">
                    {t('description')} ({t('optional')})
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className={fieldClass}
                />
            </div>

            <div className="sm:col-span-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="h-4 w-4 rounded accent-ink"
                    />
                    <span className="text-sm font-semibold text-ink">{t('isActive')}</span>
                </label>
            </div>

            <div className="sm:col-span-2 flex justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                    type="button"
                    onClick={closeForm}
                    className="rounded-lg border border-surface-border bg-white px-4 py-2 text-xs font-semibold text-ink hover:bg-surface">
                    {t('cancel')}
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-ink px-5 py-2 text-xs font-semibold text-white hover:bg-charcoal-light disabled:opacity-50">
                    {saving
                        ? editingCoupon
                            ? t('updating')
                            : t('creating')
                        : editingCoupon
                          ? t('update')
                          : t('create')}
                </button>
            </div>
        </form>
    )

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
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={handleSeedDefaults}
                        disabled={seeding}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-white px-3.5 py-2 text-xs font-semibold text-ink hover:bg-surface transition-colors disabled:opacity-50">
                        <Sparkles size={13} className="text-brand-500" />
                        <span>
                            {seeding
                                ? isFr
                                    ? 'Initialisation...'
                                    : 'Seeding...'
                                : isFr
                                  ? 'Activer codes standards'
                                  : 'Seed Default Promos'}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => fetchCoupons()}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-white px-3 py-2 text-xs font-semibold text-ink hover:bg-surface transition-colors">
                        <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsCreating(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-charcoal-light transition-colors">
                        <Plus className="h-4 w-4" />
                        <span>{t('createCoupon')}</span>
                    </button>
                </div>
            </div>

            {/* 4 Summary Metrics */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-surface-border bg-white p-4">
                    <p className="text-xs text-ink-muted">
                        {isFr ? 'Total coupons' : 'Total Coupons'}
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold text-ink tabular-nums">
                        {summary.total}
                    </p>
                </div>
                <div className="rounded-xl border border-surface-border bg-white p-4">
                    <p className="text-xs text-ink-muted">
                        {isFr ? 'Campagnes actives' : 'Active Campaigns'}
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold text-fresh-700 tabular-nums">
                        {summary.active}
                    </p>
                </div>
                <div className="rounded-xl border border-surface-border bg-white p-4">
                    <p className="text-xs text-ink-muted">
                        {isFr ? 'Inactifs' : 'Inactive'}
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold text-ink tabular-nums">
                        {summary.inactive}
                    </p>
                </div>
                <div className="rounded-xl border border-surface-border bg-white p-4">
                    <p className="text-xs text-ink-muted">
                        {isFr ? 'Utilisations totales' : 'Total Redemptions'}
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold text-ink tabular-nums">
                        {summary.totalRedemptions}
                    </p>
                </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {[
                        { id: '', label: isFr ? 'Tous' : 'All' },
                        { id: 'active', label: t('active') },
                        { id: 'inactive', label: t('inactive') },
                        { id: 'expired', label: isFr ? 'Expirés' : 'Expired' }
                    ].map((tab) => {
                        const active = statusFilter === tab.id
                        return (
                            <button
                                key={tab.id || 'ALL'}
                                type="button"
                                onClick={() => {
                                    setStatusFilter(tab.id)
                                    setPage(1)
                                }}
                                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    active
                                        ? 'bg-ink text-white'
                                        : 'border border-surface-border bg-white text-ink-muted hover:text-ink'
                                }`}>
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                <div className="relative w-full sm:w-72">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                        placeholder={
                            isFr ? 'Rechercher un code promo...' : 'Search promo code...'
                        }
                        className="w-full rounded-lg border border-surface-border bg-white py-2 pl-10 pr-4 text-sm text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none"
                    />
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isCreating}
                setIsOpen={(open) => {
                    if (!open) closeForm()
                }}
                title={editingCoupon ? t('editCoupon') : t('createCoupon')}
                content={couponFormContent}
            />

            {/* Coupons Table */}
            <div className="overflow-hidden rounded-xl border border-surface-border bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-surface-border bg-surface/60 text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                            <tr>
                                <th className="px-4 py-3.5">{t('code')}</th>
                                <th className="px-4 py-3.5">{t('discount')}</th>
                                <th className="px-4 py-3.5">
                                    {isFr ? 'Conditions' : 'Conditions'}
                                </th>
                                <th className="px-4 py-3.5">{t('usageCount')}</th>
                                <th className="px-4 py-3.5">{t('validUntil')}</th>
                                <th className="px-4 py-3.5">{t('status')}</th>
                                <th className="px-4 py-3.5 text-right">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-border">
                            {loading && coupons.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center">
                                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-ink-subtle" />
                                    </td>
                                </tr>
                            ) : coupons.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-12 text-center text-sm text-ink-muted">
                                        {t('noCoupons')}
                                    </td>
                                </tr>
                            ) : (
                                coupons.map((coupon) => {
                                    const isExpired = Boolean(
                                        coupon.validUntil &&
                                            new Date(coupon.validUntil) < new Date()
                                    )
                                    const usagePct = coupon.usageLimit
                                        ? Math.min(
                                              100,
                                              Math.round(
                                                  (coupon.usageCount / coupon.usageLimit) * 100
                                              )
                                          )
                                        : null

                                    return (
                                        <tr
                                            key={coupon.id}
                                            className="transition-colors hover:bg-surface/40">
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="rounded-md border border-surface-border bg-surface px-2 py-0.5 text-xs font-bold tracking-wider text-ink">
                                                        {coupon.code}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(
                                                                coupon.code
                                                            )
                                                            toast.success(
                                                                isFr
                                                                    ? 'Code copié'
                                                                    : 'Code copied'
                                                            )
                                                        }}
                                                        title="Copy code"
                                                        className="text-ink-subtle hover:text-ink">
                                                        <Copy size={12} />
                                                    </button>
                                                </div>
                                                {coupon.description && (
                                                    <p className="mt-1 text-[11px] text-ink-muted max-w-[220px] truncate">
                                                        {coupon.description}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 tabular-nums text-sm font-bold text-ink">
                                                {coupon.discountType === 'percentage'
                                                    ? `-${coupon.discountValue}%`
                                                    : `-$${coupon.discountValue.toFixed(2)}`}
                                            </td>
                                            <td className="px-4 py-3.5 text-xs text-ink-muted tabular-nums">
                                                <div>
                                                    {coupon.minOrderValue
                                                        ? `${isFr ? 'Min :' : 'Min:'} $${coupon.minOrderValue}`
                                                        : isFr
                                                          ? 'Sans minimum'
                                                          : 'No min'}
                                                </div>
                                                {coupon.maxDiscount && (
                                                    <div className="text-[11px] text-ink-subtle">
                                                        Max: ${coupon.maxDiscount}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 tabular-nums text-xs">
                                                <div className="font-semibold text-ink">
                                                    {coupon.usageCount}
                                                    {coupon.usageLimit
                                                        ? ` / ${coupon.usageLimit}`
                                                        : ` (${t('unlimited')})`}
                                                </div>
                                                {usagePct !== null && (
                                                    <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-surface-muted">
                                                        <div
                                                            className="h-full rounded-full bg-ink"
                                                            style={{ width: `${usagePct}%` }}
                                                        />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 text-xs text-ink-muted tabular-nums">
                                                {coupon.validUntil
                                                    ? new Date(
                                                          coupon.validUntil
                                                      ).toLocaleDateString()
                                                    : t('unlimited')}
                                                {isExpired && (
                                                    <span className="ml-1.5 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
                                                        {isFr ? 'Expiré' : 'Expired'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleActive(coupon)}
                                                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                                                        coupon.isActive && !isExpired
                                                            ? 'bg-fresh-50 text-fresh-700 hover:bg-fresh-100'
                                                            : 'bg-surface text-ink-muted hover:bg-surface-muted'
                                                    }`}>
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${
                                                            coupon.isActive && !isExpired
                                                                ? 'bg-fresh-600'
                                                                : 'bg-ink-subtle'
                                                        }`}
                                                    />
                                                    <span>
                                                        {coupon.isActive
                                                            ? t('active')
                                                            : t('inactive')}
                                                    </span>
                                                </button>
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <div className="inline-flex items-center justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEdit(coupon)}
                                                        className="rounded-lg p-1.5 text-ink-muted hover:bg-surface hover:text-ink transition-colors"
                                                        aria-label="Edit coupon">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(coupon.id)}
                                                        className="rounded-lg p-1.5 text-ink-subtle hover:bg-red-50 hover:text-red-600 transition-colors"
                                                        aria-label="Delete coupon">
                                                        <Trash2 className="h-4 w-4" />
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
        </div>
    )
}
