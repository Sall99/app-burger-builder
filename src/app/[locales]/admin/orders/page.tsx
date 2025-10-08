'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, ChevronLeft, ChevronRight, Edit, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { OrderWithDetails } from '@/types/admin';

export default function AdminOrdersPage() {
    const t = useTranslations('Admin.Orders');
    const [orders, setOrders] = useState<OrderWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [editingOrder, setEditingOrder] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<{
        status?: string;
        payment_status?: boolean;
    }>({});

    useEffect(() => {
        fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10'
            });
            if (statusFilter) params.append('status', statusFilter);

            const response = await fetch(`/api/admin/orders?${params}`);
            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateOrder = async (orderId: string) => {
        try {
            const response = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId,
                    ...editValues
                })
            });

            if (response.ok) {
                await fetchOrders();
                setEditingOrder(null);
                setEditValues({});
            }
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const statusOptions = ['PENDING', 'PROCESSING', 'COMPLETED', 'DELIVERED', 'CANCELLED'];

    if (loading && orders.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
                <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                    }}
                    className="px-4 py-2 rounded-lg border bg-background"
                >
                    <option value="">{t('allStatuses')}</option>
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>
                            {t(status.toLowerCase() as any)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Orders Table */}
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold">
                                    {t('orderId')}
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">
                                    {t('customer')}
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">
                                    {t('amount')}
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">
                                    {t('status')}
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">
                                    {t('paymentStatus')}
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">
                                    {t('date')}
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">
                                    {t('actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono">
                                        {order.id.slice(-8)}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div>
                                            <div className="font-medium">
                                                {order.user.name || 'N/A'}
                                            </div>
                                            <div className="text-muted-foreground text-xs">
                                                {order.user.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        ${order.totalPrice.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {editingOrder === order.id ? (
                                            <select
                                                value={editValues.status || order.status}
                                                onChange={(e) =>
                                                    setEditValues({
                                                        ...editValues,
                                                        status: e.target.value
                                                    })
                                                }
                                                className="px-2 py-1 rounded border text-xs"
                                            >
                                                {statusOptions.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    order.status === 'COMPLETED' ||
                                                    order.status === 'DELIVERED'
                                                        ? 'bg-green-100 text-green-700'
                                                        : order.status === 'CANCELLED'
                                                          ? 'bg-red-100 text-red-700'
                                                          : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {editingOrder === order.id ? (
                                            <select
                                                value={
                                                    editValues.payment_status !== undefined
                                                        ? editValues.payment_status.toString()
                                                        : order.payment_status.toString()
                                                }
                                                onChange={(e) =>
                                                    setEditValues({
                                                        ...editValues,
                                                        payment_status: e.target.value === 'true'
                                                    })
                                                }
                                                className="px-2 py-1 rounded border text-xs"
                                            >
                                                <option value="true">{t('paid')}</option>
                                                <option value="false">{t('unpaid')}</option>
                                            </select>
                                        ) : order.payment_status ? (
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-600" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {editingOrder === order.id ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdateOrder(order.id)}
                                                    className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90"
                                                >
                                                    {t('update')}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingOrder(null);
                                                        setEditValues({});
                                                    }}
                                                    className="px-3 py-1 bg-muted rounded text-xs hover:bg-muted/80"
                                                >
                                                    {t('cancel')}
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setEditingOrder(order.id);
                                                    setEditValues({
                                                        status: order.status,
                                                        payment_status: order.payment_status
                                                    });
                                                }}
                                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                        )}
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

            {orders.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">{t('noOrders')}</p>
                </div>
            )}
        </div>
    );
}

