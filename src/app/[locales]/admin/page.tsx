'use client';

import { useEffect, useState } from 'react';
import { DollarSign, Package, TrendingUp, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { StatCard } from '@/components/admin/stat-card';
import { AdminStats } from '@/types/admin';

export default function AdminDashboard() {
    const t = useTranslations('Admin.Dashboard');
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats');
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
          
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
                <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
            </div>

         
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title={t('totalRevenue')}
                    value={`$${stats?.totalRevenue.toFixed(2) || 0}`}
                    icon={DollarSign}
                    trend={{
                        value: stats?.revenueGrowth || 0,
                        label: t('last30Days')
                    }}
                />
                <StatCard
                    title={t('totalOrders')}
                    value={stats?.totalOrders || 0}
                    icon={Package}
                    trend={{
                        value: stats?.ordersGrowth || 0,
                        label: t('last30Days')
                    }}
                />
                <StatCard
                    title={t('totalUsers')}
                    value={stats?.totalUsers || 0}
                    icon={Users}
                    trend={{
                        value: stats?.usersGrowth || 0,
                        label: t('last30Days')
                    }}
                />
                <StatCard
                    title={t('pendingOrders')}
                    value={stats?.pendingOrders || 0}
                    icon={TrendingUp}
                    description={t('last30Days')}
                />
            </div>

           
            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-card rounded-xl border shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <p className="text-sm text-muted-foreground">
                        Activity tracking coming soon...
                    </p>
                </div>
                <div className="bg-card rounded-xl border shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <p className="text-sm text-muted-foreground">Quick actions coming soon...</p>
                </div>
            </div>
        </div>
    );
}

