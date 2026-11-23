'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
    Award,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Download,
    Loader2,
    Plus,
    RefreshCw,
    Search,
    Settings2,
    Shield,
    Trash2
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { Modal } from '@/components/ui/modal/modal'
import { UserWithStats } from '@/types/admin'
import { totalFormatter } from '@/utils/utils'

const ROLE_OPTIONS = ['USER', 'ADMIN', 'SUPER_ADMIN'] as const
const TIER_OPTIONS = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'] as const

export default function AdminUsersPage() {
    const t = useTranslations('Admin.Users')
    const locale = useLocale()
    const isFr = locale === 'fr'

    const [users, setUsers] = useState<UserWithStats[]>([])
    const [summary, setSummary] = useState({
        total: 0,
        admins: 0,
        verified: 0,
        loyaltyMembers: 0
    })
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [managingUser, setManagingUser] = useState<UserWithStats | null>(null)
    const [editName, setEditName] = useState('')
    const [editRole, setEditRole] = useState('USER')
    const [editVerified, setEditVerified] = useState(false)
    const [editTier, setEditTier] = useState('BRONZE')
    const [pointsDelta, setPointsDelta] = useState(0)
    const [saving, setSaving] = useState(false)

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10'
            })
            if (search.trim()) params.append('search', search.trim())
            if (roleFilter) params.append('role', roleFilter)

            const response = await fetch(`/api/admin/users?${params}`, { cache: 'no-store' })
            if (response.ok) {
                const data = await response.json()
                setUsers(data.users || [])
                if (data.summary) setSummary(data.summary)
                setTotalPages(data.pagination?.totalPages || 1)
            }
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }, [page, search, roleFilter])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers()
        }, 200)
        return () => clearTimeout(timer)
    }, [fetchUsers])

    const openManageModal = (user: UserWithStats) => {
        setManagingUser(user)
        setEditName(user.name || '')
        setEditRole(user.role)
        setEditVerified(Boolean(user.emailVerified))
        setEditTier(user.loyalty?.currentTier || 'BRONZE')
        setPointsDelta(0)
    }

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!managingUser) return
        setSaving(true)
        try {
            const response = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: managingUser.id,
                    name: editName,
                    role: editRole,
                    verifyEmail: editVerified,
                    loyaltyTier: editTier,
                    loyaltyPointsDelta: pointsDelta
                })
            })

            if (response.ok) {
                toast.success(isFr ? 'Compte client mis à jour' : 'User account updated')
                setManagingUser(null)
                await fetchUsers()
            } else {
                toast.error(isFr ? 'Échec de la mise à jour' : 'Failed to update user')
            }
        } catch (error) {
            console.error('Error updating user:', error)
            toast.error(isFr ? 'Erreur réseau' : 'Network error')
        } finally {
            setSaving(false)
        }
    }

    const handleQuickRoleChange = async (userId: string, newRole: string) => {
        try {
            const response = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole })
            })
            if (response.ok) {
                toast.success(isFr ? `Rôle changé en ${newRole}` : `Role changed to ${newRole}`)
                await fetchUsers()
            }
        } catch {
            toast.error(isFr ? 'Erreur' : 'Update failed')
        }
    }

    const handleDeleteUser = async (userId: string) => {
        if (
            !window.confirm(
                isFr
                    ? 'Supprimer définitivement ce compte utilisateur et ses commandes ?'
                    : 'Permanently delete this user account and its orders?'
            )
        ) {
            return
        }
        try {
            const res = await fetch(`/api/admin/users?id=${userId}`, { method: 'DELETE' })
            const data = await res.json()
            if (res.ok) {
                toast.success(isFr ? 'Utilisateur supprimé' : 'User deleted')
                if (managingUser?.id === userId) setManagingUser(null)
                await fetchUsers()
            } else {
                toast.error(data.error || (isFr ? 'Suppression refusée' : 'Delete failed'))
            }
        } catch {
            toast.error(isFr ? 'Erreur' : 'Delete failed')
        }
    }

    const handleExportCsv = () => {
        if (users.length === 0) return
        const headers = [
            'UserID',
            'Name',
            'Email',
            'Role',
            'Verified',
            'LoyaltyTier',
            'Points',
            'Orders',
            'TotalSpentUSD',
            'Joined'
        ]
        const rows = users.map((u) => [
            u.id,
            `"${(u.name || '').replace(/"/g, '""')}"`,
            u.email || '',
            u.role,
            u.emailVerified ? 'YES' : 'NO',
            u.loyalty?.currentTier || 'BRONZE',
            u.loyalty?.availablePoints || 0,
            u._count.Order,
            (u.totalSpent || 0).toFixed(2),
            new Date(u.createdAt).toISOString()
        ])
        const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `users-export-${new Date().toISOString().slice(0, 10)}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

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
                        disabled={users.length === 0}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-white px-3 py-2 text-xs font-semibold text-ink hover:bg-surface transition-colors disabled:opacity-40">
                        <Download size={13} />
                        <span>Export CSV</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => fetchUsers()}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-white px-3 py-2 text-xs font-semibold text-ink hover:bg-surface transition-colors">
                        <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                        <span>{isFr ? 'Actualiser' : 'Refresh'}</span>
                    </button>
                </div>
            </div>

            {/* 4 Summary Metrics */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-surface-border bg-white p-4">
                    <p className="text-xs text-ink-muted">
                        {isFr ? 'Comptes totaux' : 'Total Accounts'}
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold text-ink tabular-nums">
                        {summary.total}
                    </p>
                </div>
                <div className="rounded-xl border border-surface-border bg-white p-4">
                    <p className="text-xs text-ink-muted">
                        {isFr ? 'Équipe Admin' : 'Admin Team'}
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold text-ink tabular-nums">
                        {summary.admins}
                    </p>
                </div>
                <div className="rounded-xl border border-surface-border bg-white p-4">
                    <p className="text-xs text-ink-muted">
                        {isFr ? 'E-mails vérifiés' : 'Verified Emails'}
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold text-ink tabular-nums">
                        {summary.verified}
                    </p>
                </div>
                <div className="rounded-xl border border-surface-border bg-white p-4">
                    <p className="text-xs text-ink-muted">
                        {isFr ? 'Membres Fidélité' : 'Loyalty Members'}
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold text-ink tabular-nums">
                        {summary.loyaltyMembers}
                    </p>
                </div>
            </div>

            {/* Search & Role Filter */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {[
                        { id: '', label: isFr ? 'Tous les rôles' : 'All roles' },
                        { id: 'USER', label: 'USER' },
                        { id: 'ADMIN', label: 'ADMIN' },
                        { id: 'SUPER_ADMIN', label: 'SUPER_ADMIN' }
                    ].map((tab) => {
                        const active = roleFilter === tab.id
                        return (
                            <button
                                key={tab.id || 'ALL'}
                                type="button"
                                onClick={() => {
                                    setRoleFilter(tab.id)
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
                        placeholder={t('search')}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                        className="w-full rounded-lg border border-surface-border bg-white py-2 pl-10 pr-4 text-sm text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="overflow-hidden rounded-xl border border-surface-border bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-surface-border bg-surface/60 text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                            <tr>
                                <th className="px-4 py-3.5">{t('name')}</th>
                                <th className="px-4 py-3.5">{t('role')}</th>
                                <th className="px-4 py-3.5">
                                    {isFr ? 'Fidélité & Points' : 'Loyalty & Points'}
                                </th>
                                <th className="px-4 py-3.5">
                                    {isFr ? 'Commandes & Dépenses' : 'Orders & Spend'}
                                </th>
                                <th className="px-4 py-3.5">{t('joined')}</th>
                                <th className="px-4 py-3.5 text-right">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-border">
                            {loading && users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center">
                                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-ink-subtle" />
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-12 text-center text-sm text-ink-muted">
                                        {t('noUsers')}
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="transition-colors hover:bg-surface/40">
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-xs font-bold text-ink">
                                                    {(
                                                        user.name?.[0] ||
                                                        user.email?.[0] ||
                                                        'U'
                                                    ).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                                                        <span>{user.name || 'N/A'}</span>
                                                        {user.emailVerified && (
                                                            <span title={t('verified')}>
                                                                <CheckCircle2
                                                                    size={12}
                                                                    className="text-fresh-600"
                                                                />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-[11px] text-ink-muted">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <select
                                                value={user.role}
                                                onChange={(e) =>
                                                    handleQuickRoleChange(user.id, e.target.value)
                                                }
                                                className={`rounded-lg border px-2.5 py-1 text-xs font-semibold focus:outline-none ${
                                                    user.role === 'SUPER_ADMIN'
                                                        ? 'border-ink bg-ink text-white'
                                                        : user.role === 'ADMIN'
                                                          ? 'border-brand-300 bg-brand-50 text-brand-700'
                                                          : 'border-surface-border bg-white text-ink'
                                                }`}>
                                                {ROLE_OPTIONS.map((role) => (
                                                    <option
                                                        key={role}
                                                        value={role}
                                                        className="bg-white text-ink">
                                                        {role}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="inline-flex items-center gap-1.5 rounded-md border border-surface-border bg-surface/60 px-2 py-0.5 text-xs font-semibold text-ink">
                                                <Award size={12} className="text-brand-500" />
                                                <span>{user.loyalty?.currentTier || 'BRONZE'}</span>
                                                <span className="text-ink-subtle">·</span>
                                                <span className="tabular-nums">
                                                    {user.loyalty?.availablePoints || 0} pts
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 tabular-nums text-xs">
                                            <div className="font-bold text-ink">
                                                {totalFormatter.format(user.totalSpent || 0)}
                                            </div>
                                            <div className="text-[11px] text-ink-muted">
                                                {user._count.Order}{' '}
                                                {isFr ? 'commande(s)' : 'order(s)'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-xs text-ink-muted tabular-nums">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="inline-flex items-center justify-end gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => openManageModal(user)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-surface-border bg-white px-2.5 py-1.5 text-xs font-semibold text-ink hover:bg-surface transition-colors">
                                                    <Settings2 size={13} />
                                                    <span>{isFr ? 'Gérer' : 'Manage'}</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    aria-label="Delete user"
                                                    className="rounded-lg p-1.5 text-ink-subtle hover:bg-red-50 hover:text-red-600 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
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

            {/* Manage User & Loyalty Modal */}
            <Modal
                isOpen={Boolean(managingUser)}
                setIsOpen={(open) => {
                    if (!open) setManagingUser(null)
                }}
                title={
                    managingUser
                        ? `${isFr ? 'Gérer le client :' : 'Manage Customer:'} ${managingUser.name || managingUser.email}`
                        : ''
                }
                content={
                    managingUser ? (
                        <form onSubmit={handleSaveUser} className="space-y-4 text-sm">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-ink">
                                        {t('name')}
                                    </label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-ink">
                                        {t('role')}
                                    </label>
                                    <select
                                        value={editRole}
                                        onChange={(e) => setEditRole(e.target.value)}
                                        className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm font-semibold text-ink focus:border-ink focus:outline-none">
                                        {ROLE_OPTIONS.map((r) => (
                                            <option key={r} value={r}>
                                                {r}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <label className="flex items-center justify-between rounded-lg border border-surface-border bg-surface/50 px-3.5 py-2.5 cursor-pointer">
                                <div>
                                    <p className="text-xs font-semibold text-ink">
                                        {isFr ? 'Compte e-mail vérifié' : 'Verified email account'}
                                    </p>
                                    <p className="text-[11px] text-ink-muted">
                                        {managingUser.email}
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={editVerified}
                                    onChange={(e) => setEditVerified(e.target.checked)}
                                    className="h-4 w-4 rounded accent-ink"
                                />
                            </label>

                            {/* Loyalty Management */}
                            <div className="rounded-xl border border-surface-border p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink">
                                        <Award size={14} className="text-brand-500" />
                                        {isFr
                                            ? 'Programme Fidélité & Points'
                                            : 'Loyalty Program & Points'}
                                    </span>
                                    <span className="tabular-nums text-xs font-semibold text-ink-muted">
                                        {isFr ? 'Solde actuel :' : 'Current:'}{' '}
                                        <strong className="text-ink">
                                            {managingUser.loyalty?.availablePoints || 0} pts
                                        </strong>
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-ink-muted">
                                            {isFr ? 'Palier Fidélité' : 'Loyalty Tier'}
                                        </label>
                                        <select
                                            value={editTier}
                                            onChange={(e) => setEditTier(e.target.value)}
                                            className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-ink focus:outline-none">
                                            {TIER_OPTIONS.map((tier) => (
                                                <option key={tier} value={tier}>
                                                    {tier}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-ink-muted">
                                            {isFr
                                                ? 'Créditer / Débiter des points'
                                                : 'Add / Deduct points'}
                                        </label>
                                        <input
                                            type="number"
                                            value={pointsDelta}
                                            onChange={(e) =>
                                                setPointsDelta(parseInt(e.target.value || '0', 10))
                                            }
                                            className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-xs font-semibold text-ink tabular-nums focus:border-ink focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                    {[50, 100, 250, 500, -100].map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() =>
                                                setPointsDelta((prev) => prev + preset)
                                            }
                                            className="inline-flex items-center gap-0.5 rounded-md border border-surface-border bg-surface px-2 py-1 text-[11px] font-semibold text-ink hover:bg-surface-muted tabular-nums">
                                            {preset > 0 ? <Plus size={10} /> : null}
                                            {preset} pts
                                        </button>
                                    ))}
                                    {pointsDelta !== 0 && (
                                        <span className="ml-auto text-xs font-semibold text-brand-600 tabular-nums">
                                            {isFr ? 'Nouveau solde :' : 'New balance:'}{' '}
                                            {Math.max(
                                                0,
                                                (managingUser.loyalty?.availablePoints || 0) +
                                                    pointsDelta
                                            )}{' '}
                                            pts
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-surface-border">
                                <button
                                    type="button"
                                    onClick={() => handleDeleteUser(managingUser.id)}
                                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">
                                    <Trash2 size={14} />
                                    <span>{isFr ? 'Supprimer' : 'Delete'}</span>
                                </button>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setManagingUser(null)}
                                        className="rounded-lg border border-surface-border bg-white px-4 py-2 text-xs font-semibold text-ink hover:bg-surface">
                                        {t('cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-charcoal-light disabled:opacity-50">
                                        <Shield size={13} />
                                        <span>
                                            {saving ? t('updating') : t('update')}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : null
                }
            />
        </div>
    )
}
