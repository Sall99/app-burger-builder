export interface AdminStats {
    totalOrders: number;
    totalRevenue: number;
    totalUsers: number;
    pendingOrders: number;
    revenueGrowth: number;
    ordersGrowth: number;
    usersGrowth: number;
}

export interface OrderWithDetails {
    id: string;
    userId: string;
    totalPrice: number;
    status: string;
    payment_status: boolean;
    createdAt: string;
    updatedAt: string;
    user: {
        name: string | null;
        email: string | null;
    };
    shippingAdresse: {
        firstName: string;
        lastName: string;
        streetAddress: string;
        town: string;
    } | null;
}

export interface UserWithStats {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    createdAt: string;
    emailVerified: string | null;
    _count: {
        Order: number;
    };
}

export interface CouponWithUsage {
    id: string;
    code: string;
    description: string | null;
    discountType: string;
    discountValue: number;
    minOrderValue: number | null;
    maxDiscount: number | null;
    usageLimit: number | null;
    usageCount: number;
    validFrom: string;
    validUntil: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

