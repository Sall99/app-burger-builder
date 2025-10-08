import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        label: string;
    };
    description?: string;
}

export function StatCard({ title, value, icon: Icon, trend, description }: StatCardProps) {
    return (
        <div className="bg-card rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="text-3xl font-bold mt-2 text-foreground">{value}</h3>
                    {description && (
                        <p className="text-xs text-muted-foreground mt-1">{description}</p>
                    )}
                    {trend && (
                        <div className="flex items-center gap-1 mt-3">
                            <span
                                className={`text-sm font-medium ${
                                    trend.value >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}
                            >
                                {trend.value >= 0 ? '+' : ''}
                                {trend.value}%
                            </span>
                            <span className="text-xs text-muted-foreground">{trend.label}</span>
                        </div>
                    )}
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
            </div>
        </div>
    );
}

