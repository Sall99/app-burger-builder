import { LucideIcon } from 'lucide-react'

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    trend?: {
        value: number
        label: string
    }
    description?: string
}

export function StatCard({ title, value, icon: Icon, trend, description }: StatCardProps) {
    return (
        <div className="rounded-xl border border-surface-border bg-white p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-ink-muted">{title}</p>
                    <h3 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-ink tabular-nums">
                        {value}
                    </h3>
                    {description && (
                        <p className="mt-1 text-xs text-ink-subtle tabular-nums">{description}</p>
                    )}
                    {trend && (
                        <div className="mt-2.5 flex items-center gap-1.5">
                            <span
                                className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
                                    trend.value >= 0
                                        ? 'bg-fresh-50 text-fresh-700'
                                        : 'bg-red-50 text-red-700'
                                }`}>
                                {trend.value >= 0 ? '+' : ''}
                                {trend.value}%
                            </span>
                            <span className="text-[11px] text-ink-subtle">{trend.label}</span>
                        </div>
                    )}
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-surface-border bg-surface text-ink">
                    <Icon className="h-4 w-4" />
                </div>
            </div>
        </div>
    )
}
