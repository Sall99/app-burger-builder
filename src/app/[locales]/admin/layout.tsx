import { ArrowLeft, Shield } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'

import { AdminNav } from '@/components/admin/admin-nav'
import { isAdmin } from '@/lib/admin'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Admin')

    return {
        title: t('title'),
        robots: { index: false, follow: false }
    }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const admin = await isAdmin()
    const locale = await getLocale()

    if (!admin) {
        redirect(`/${locale}`)
    }

    const t = await getTranslations('Admin')

    return (
        <div className="min-h-screen bg-surface">
            <div className="border-b border-surface-border bg-white">
                <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ink text-white">
                            <Shield size={13} />
                        </span>
                        <span>{t('title')}</span>
                        <span className="hidden sm:inline rounded-md border border-surface-border bg-surface px-2 py-0.5 text-[10px] font-medium text-ink-muted">
                            Operations Console
                        </span>
                    </div>
                    <Link
                        href={`/${locale}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-white px-3 py-1 text-xs font-medium text-ink-muted hover:bg-surface hover:text-ink transition-colors">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>{t('backToSite')}</span>
                    </Link>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[210px_1fr] items-start">
                    <aside className="lg:sticky lg:top-24 h-fit">
                        <AdminNav />
                    </aside>
                    <main className="min-w-0">{children}</main>
                </div>
            </div>
        </div>
    )
}
