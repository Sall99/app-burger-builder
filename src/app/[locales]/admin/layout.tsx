import { ArrowLeft, LogOut } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { AdminNav } from '@/components/admin/admin-nav';
import { isAdmin } from '@/lib/admin';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Admin');

    return {
        title: t('title'),
        robots: {
            index: false,
            follow: false
        }
    };
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const admin = await isAdmin();

    if (!admin) {
        redirect('/');
    }

    const t = await getTranslations('Admin');

    return (
        <div className="min-h-screen bg-background">
       
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold">{t('title')}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {t('backToSite')}
                        </Link>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
                  
                    <aside className="lg:sticky lg:top-24 h-fit">
                        <div className="bg-card rounded-xl border shadow-sm p-4">
                            <AdminNav />
                        </div>
                    </aside>

                 
                    <main className="min-w-0">{children}</main>
                </div>
            </div>
        </div>
    );
}

