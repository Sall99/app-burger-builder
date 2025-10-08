'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Edit, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { UserWithStats } from '@/types/admin';

export default function AdminUsersPage() {
    const t = useTranslations('Admin.Users');
    const [users, setUsers] = useState<UserWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [editingUser, setEditingUser] = useState<string | null>(null);
    const [editRole, setEditRole] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 300);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, search]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10'
            });
            if (search) params.append('search', search);

            const response = await fetch(`/api/admin/users?${params}`);
            if (response.ok) {
                const data = await response.json();
                setUsers(data.users);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async (userId: string) => {
        try {
            const response = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: editRole })
            });

            if (response.ok) {
                await fetchUsers();
                setEditingUser(null);
                setEditRole('');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const roleOptions = ['USER', 'ADMIN', 'SUPER_ADMIN'];

    if (loading && users.length === 0) {
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

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder={t('search')}
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
                />
            </div>

            {/* Users Table */}
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold">
                                    {t('name')}
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">
                                    {t('email')}
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">
                                    {t('role')}
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">
                                    {t('orders')}
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">
                                    {t('joined')}
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">
                                    {t('actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 text-sm">
                                        <div className="font-medium">{user.name || 'N/A'}</div>
                                        {user.emailVerified && (
                                            <span className="text-xs text-green-600">
                                                {t('verified')}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {editingUser === user.id ? (
                                            <select
                                                value={editRole}
                                                onChange={(e) => setEditRole(e.target.value)}
                                                className="px-2 py-1 rounded border text-xs"
                                            >
                                                {roleOptions.map((role) => (
                                                    <option key={role} value={role}>
                                                        {role}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    user.role === 'SUPER_ADMIN'
                                                        ? 'bg-purple-100 text-purple-700'
                                                        : user.role === 'ADMIN'
                                                          ? 'bg-blue-100 text-blue-700'
                                                          : 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        {user._count.Order}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {editingUser === user.id ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdateRole(user.id)}
                                                    className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90"
                                                >
                                                    {t('update')}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingUser(null);
                                                        setEditRole('');
                                                    }}
                                                    className="px-3 py-1 bg-muted rounded text-xs hover:bg-muted/80"
                                                >
                                                    {t('cancel')}
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setEditingUser(user.id);
                                                    setEditRole(user.role);
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

            {users.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">{t('noUsers')}</p>
                </div>
            )}
        </div>
    );
}

