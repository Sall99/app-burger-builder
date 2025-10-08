/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Edit, Plus, Trash2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { CouponWithUsage } from '@/types/admin';

export default function AdminCouponsPage() {
    const t = useTranslations('Admin.Coupons');
    const [coupons, setCoupons] = useState<CouponWithUsage[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isCreating, setIsCreating] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<CouponWithUsage | null>(null);
    const [formData, setFormData] = useState<Partial<CouponWithUsage>>({
        discountType: 'percentage',
        isActive: true
    });

    useEffect(() => {
        fetchCoupons();
    }, [page]);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10'
            });

            const response = await fetch(`/api/admin/coupons?${params}`);
            if (response.ok) {
                const data = await response.json();
                setCoupons(data.coupons);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = '/api/admin/coupons';
            const method = editingCoupon ? 'PATCH' : 'POST';
            const body = editingCoupon
                ? { ...formData, couponId: editingCoupon.id }
                : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                await fetchCoupons();
                setIsCreating(false);
                setEditingCoupon(null);
                setFormData({ discountType: 'percentage', isActive: true });
            }
        } catch (error) {
            console.error('Error saving coupon:', error);
        }
    };

    const handleDelete = async (couponId: string) => {
        if (!confirm(t('confirmDelete'))) return;

        try {
            const response = await fetch(`/api/admin/coupons?id=${couponId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await fetchCoupons();
            }
        } catch (error) {
            console.error('Error deleting coupon:', error);
        }
    };

    const openEdit = (coupon: CouponWithUsage) => {
        setEditingCoupon(coupon);
        setFormData(coupon);
        setIsCreating(true);
    };

    const closeForm = () => {
        setIsCreating(false);
        setEditingCoupon(null);
        setFormData({ discountType: 'percentage', isActive: true });
    };

    if (loading && coupons.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
                    <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                    <Plus className="h-4 w-4" />
                    {t('createCoupon')}
                </button>
            </div>

            {/* Create/Edit Form */}
            {isCreating && (
                <div className="bg-card rounded-xl border shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                            {editingCoupon ? t('editCoupon') : t('createCoupon')}
                        </h3>
                        <button onClick={closeForm} className="p-1 hover:bg-muted rounded">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {t('couponCode')} *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.code || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                                }
                                className="w-full px-3 py-2 rounded-lg border bg-background"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {t('discountType')} *
                            </label>
                            <select
                                required
                                value={formData.discountType}
                                onChange={(e) =>
                                    setFormData({ ...formData, discountType: e.target.value })
                                }
                                className="w-full px-3 py-2 rounded-lg border bg-background"
                            >
                                <option value="percentage">{t('percentage')}</option>
                                <option value="fixed">{t('fixed')}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {t('discountValue')} *
                            </label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                value={formData.discountValue || ''}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        discountValue: parseFloat(e.target.value)
                                    })
                                }
                                className="w-full px-3 py-2 rounded-lg border bg-background"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {t('minOrderValue')} ({t('optional')})
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.minOrderValue || ''}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        minOrderValue: e.target.value
                                            ? parseFloat(e.target.value)
                                            : null
                                    })
                                }
                                className="w-full px-3 py-2 rounded-lg border bg-background"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {t('maxDiscountAmount')} ({t('optional')})
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.maxDiscount || ''}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        maxDiscount: e.target.value
                                            ? parseFloat(e.target.value)
                                            : null
                                    })
                                }
                                className="w-full px-3 py-2 rounded-lg border bg-background"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {t('totalUsageLimit')} ({t('optional')})
                            </label>
                            <input
                                type="number"
                                value={formData.usageLimit || ''}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        usageLimit: e.target.value ? parseInt(e.target.value) : null
                                    })
                                }
                                className="w-full px-3 py-2 rounded-lg border bg-background"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">
                                {t('description')} ({t('optional')})
                            </label>
                            <textarea
                                value={formData.description || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                rows={2}
                                className="w-full px-3 py-2 rounded-lg border bg-background"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) =>
                                        setFormData({ ...formData, isActive: e.target.checked })
                                    }
                                    className="rounded"
                                />
                                <span className="text-sm font-medium">{t('isActive')}</span>
                            </label>
                        </div>
                        <div className="col-span-2 flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={closeForm}
                                className="px-4 py-2 border rounded-lg hover:bg-muted"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                            >
                                {editingCoupon ? t('update') : t('create')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Coupons Table */}
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold">
                                    {t('code')}
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">
                                    {t('discount')}
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">
                                    {t('usageCount')}
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">
                                    {t('status')}
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">
                                    {t('validUntil')}
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">
                                    {t('actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono font-medium">
                                        {coupon.code}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {coupon.discountType === 'percentage'
                                            ? `${coupon.discountValue}%`
                                            : `$${coupon.discountValue}`}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {coupon.usageCount}
                                        {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                coupon.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            {coupon.isActive ? t('active') : t('inactive')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        {coupon.validUntil
                                            ? new Date(coupon.validUntil).toLocaleDateString()
                                            : t('unlimited')}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEdit(coupon)}
                                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(coupon.id)}
                                                className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border disabled:opacity-50 hover:bg-muted"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </button>
                        <span className="text-sm text-muted-foreground">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border disabled:opacity-50 hover:bg-muted"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

            {coupons.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">{t('noCoupons')}</p>
                </div>
            )}
        </div>
    );
}

