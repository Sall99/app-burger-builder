export interface DailyRevenuePoint {
    date: string
    label: string
    revenue: number
    orders: number
}

export interface TopCustomerSummary {
    id: string
    name: string | null
    email: string | null
    role: string
    ordersCount: number
    totalSpent: number
    tier: string
}

export interface AdminStats {
    totalOrders: number
    totalRevenue: number
    totalUsers: number
    pendingOrders: number
    revenueGrowth: number
    ordersGrowth: number
    usersGrowth: number
    paidOrders: number
    unpaidOrders: number
    unpaidRevenue: number
    averageOrderValue: number
    activeCoupons: number
    totalCoupons: number
    loyaltyMembers: number
    statusBreakdown: {
        PENDING: number
        PROCESSING: number
        COMPLETED: number
        DELIVERED: number
        CANCELLED: number
    }
    dailySeries: DailyRevenuePoint[]
    recentOrders: OrderWithDetails[]
    topCustomers: TopCustomerSummary[]
}

export interface OrderWithDetails {
    id: string
    userId: string
    totalPrice: number
    status: string
    payment_status: boolean
    createdAt: string
    updatedAt: string
    user: {
        name: string | null
        email: string | null
    }
    shippingAdresse: {
        id?: string
        firstName: string
        lastName: string
        streetAddress: string
        town: string
    } | null
}

export interface UserWithStats {
    id: string
    name: string | null
    email: string | null
    role: string
    createdAt: string
    emailVerified: string | null
    _count: {
        Order: number
    }
    totalSpent?: number
    paidOrdersCount?: number
    loyalty?: {
        totalPoints: number
        availablePoints: number
        currentTier: string
        lifetimeSpend: number
    } | null
}

export interface CouponWithUsage {
    id: string
    code: string
    description: string | null
    discountType: string
    discountValue: number
    minOrderValue: number | null
    maxDiscount: number | null
    usageLimit: number | null
    userLimit?: number | null
    usageCount: number
    validFrom: string
    validUntil: string | null
    isActive: boolean
    createdAt: string
    updatedAt: string
}
