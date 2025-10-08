'use client';

import {
    BarChart3,
    Home,
    Package,
    Settings,
    ShoppingCart,
    Ticket,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function AdminNav() {
    const pathname = usePathname();
    const t = useTranslations('Admin');

    const links = [
        {
            href: '/admin',
            label: t('dashboard'),
            icon: BarChart3,
            exact: true
        },
        {
            href: '/admin/orders',
            label: t('orders'),
            icon: ShoppingCart
        },
        {
            href: '/admin/users',
            label: t('users'),
            icon: Users
        },
        {
            href: '/admin/coupons',
            label: t('coupons'),
            icon: Ticket
        }
    ];

    const isActive = (href: string, exact?: boolean) => {
        if (exact) {
            return pathname === href || pathname.endsWith(href);
        }
        return pathname.startsWith(href);
    };

    return (
        <nav className="space-y-1">
            {links.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href, link.exact);

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                            active
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                    >
                        <Icon className="h-5 w-5" />
                        <span>{link.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

