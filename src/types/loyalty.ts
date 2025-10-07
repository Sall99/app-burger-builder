export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum'

export interface TierInfo {
    tier: LoyaltyTier
    name: string
    minPoints: number
    maxPoints: number | null
    color: string
    gradient: string
    icon: string
    benefits: string[]
    pointsMultiplier: number
}

export interface Reward {
    id: string
    name: string
    description: string
    pointsCost: number
    icon: string
    type: 'discount' | 'free-item' | 'upgrade' | 'special'
    value: number
    minTier?: LoyaltyTier
    isPopular?: boolean
    expiryDays?: number
}

export interface UserLoyalty {
    userId: string
    totalPoints: number
    availablePoints: number
    currentTier: LoyaltyTier
    lifetimeSpend: number
    ordersCount: number
    redeemedRewards: RedeemedReward[]
    joinedAt: Date
}

export interface RedeemedReward {
    rewardId: string
    redeemedAt: Date
    expiresAt?: Date
    isUsed: boolean
    usedAt?: Date
}

/**
 * Tier Configuration
 */
export const LOYALTY_TIERS: Record<LoyaltyTier, TierInfo> = {
    bronze: {
        tier: 'bronze',
        name: 'Bronze Member',
        minPoints: 0,
        maxPoints: 499,
        color: '#CD7F32',
        gradient: 'linear-gradient(135deg, #CD7F32 0%, #B8860B 100%)',
        icon: '🥉',
        benefits: ['Earn 1 point per $1', 'Birthday reward', 'Member-only deals'],
        pointsMultiplier: 1.0
    },
    silver: {
        tier: 'silver',
        name: 'Silver Member',
        minPoints: 500,
        maxPoints: 1499,
        color: '#C0C0C0',
        gradient: 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)',
        icon: '🥈',
        benefits: [
            'Earn 1.25 points per $1',
            'Free delivery',
            'Early access to new items',
            'All Bronze benefits'
        ],
        pointsMultiplier: 1.25
    },
    gold: {
        tier: 'gold',
        name: 'Gold Member',
        minPoints: 1500,
        maxPoints: 2999,
        color: '#FFD700',
        gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        icon: '🥇',
        benefits: [
            'Earn 1.5 points per $1',
            'Priority support',
            'Exclusive rewards',
            'Monthly free item',
            'All Silver benefits'
        ],
        pointsMultiplier: 1.5
    },
    platinum: {
        tier: 'platinum',
        name: 'Platinum Member',
        minPoints: 3000,
        maxPoints: null,
        color: '#E5E4E2',
        gradient: 'linear-gradient(135deg, #E5E4E2 0%, #BCC6CC 100%)',
        icon: '💎',
        benefits: [
            'Earn 2x points per $1',
            'VIP support',
            'Personalized offers',
            'Free upgrades',
            'Partner perks',
            'All Gold benefits'
        ],
        pointsMultiplier: 2.0
    }
}

/**
 * Available Rewards
 */
export const REWARDS: Reward[] = [
    {
        id: 'discount-5',
        name: '$5 Off',
        description: 'Get $5 off your next order',
        pointsCost: 250,
        icon: '💵',
        type: 'discount',
        value: 5,
        isPopular: true,
        expiryDays: 30
    },
    {
        id: 'discount-10',
        name: '$10 Off',
        description: 'Get $10 off your next order',
        pointsCost: 450,
        icon: '💰',
        type: 'discount',
        value: 10,
        isPopular: true,
        expiryDays: 30
    },
    {
        id: 'free-fries',
        name: 'Free Fries',
        description: 'Add free fries to any order',
        pointsCost: 150,
        icon: '🍟',
        type: 'free-item',
        value: 3
    },
    {
        id: 'free-drink',
        name: 'Free Drink',
        description: 'Get a free drink with your meal',
        pointsCost: 100,
        icon: '🥤',
        type: 'free-item',
        value: 2,
        isPopular: true
    },
    {
        id: 'free-burger',
        name: 'Free Burger',
        description: 'Redeem for any burger on the menu',
        pointsCost: 600,
        icon: '🍔',
        type: 'free-item',
        value: 8,
        minTier: 'silver'
    },
    {
        id: 'double-cheese',
        name: 'Free Double Cheese',
        description: 'Add extra cheese to any burger',
        pointsCost: 80,
        icon: '🧀',
        type: 'upgrade',
        value: 1
    },
    {
        id: 'premium-toppings',
        name: 'Premium Toppings',
        description: 'Unlock premium ingredient substitutions',
        pointsCost: 200,
        icon: '⭐',
        type: 'upgrade',
        value: 3,
        minTier: 'silver'
    },
    {
        id: 'free-delivery',
        name: 'Free Delivery',
        description: 'Waived delivery fee on your next order',
        pointsCost: 120,
        icon: '🚚',
        type: 'special',
        value: 5,
        expiryDays: 14
    },
    {
        id: 'birthday-special',
        name: 'Birthday Special',
        description: 'Exclusive birthday meal deal',
        pointsCost: 0,
        icon: '🎂',
        type: 'special',
        value: 10,
        expiryDays: 7
    },
    {
        id: 'vip-early-access',
        name: 'VIP Early Access',
        description: 'First to try new menu items',
        pointsCost: 500,
        icon: '🌟',
        type: 'special',
        value: 0,
        minTier: 'gold',
        expiryDays: 90
    }
]

/**
 * Calculate points earned from order
 */
export function calculatePointsEarned(orderTotal: number, tier: LoyaltyTier): number {
    const tierInfo = LOYALTY_TIERS[tier]
    const basePoints = Math.floor(orderTotal) // 1 point per $1
    return Math.floor(basePoints * tierInfo.pointsMultiplier)
}

/**
 * Determine tier based on total points
 */
export function getTierFromPoints(totalPoints: number): LoyaltyTier {
    if (totalPoints >= LOYALTY_TIERS.platinum.minPoints) return 'platinum'
    if (totalPoints >= LOYALTY_TIERS.gold.minPoints) return 'gold'
    if (totalPoints >= LOYALTY_TIERS.silver.minPoints) return 'silver'
    return 'bronze'
}

/**
 * Get next tier info
 */
export function getNextTier(currentTier: LoyaltyTier): TierInfo | null {
    const tiers: LoyaltyTier[] = ['bronze', 'silver', 'gold', 'platinum']
    const currentIndex = tiers.indexOf(currentTier)

    if (currentIndex === tiers.length - 1) return null // Already at max

    return LOYALTY_TIERS[tiers[currentIndex + 1]]
}

/**
 * Calculate progress to next tier
 */
export function getProgressToNextTier(
    totalPoints: number,
    currentTier: LoyaltyTier
): {
    current: number
    needed: number
    percentage: number
} {
    const nextTier = getNextTier(currentTier)

    if (!nextTier) {
        return {
            current: totalPoints,
            needed: 0,
            percentage: 100
        }
    }

    const currentTierInfo = LOYALTY_TIERS[currentTier]
    const pointsInCurrentTier = totalPoints - currentTierInfo.minPoints
    const pointsNeeded = nextTier.minPoints - currentTierInfo.minPoints
    const percentage = Math.min(100, (pointsInCurrentTier / pointsNeeded) * 100)

    return {
        current: pointsInCurrentTier,
        needed: pointsNeeded,
        percentage
    }
}

/**
 * Get available rewards for user
 */
export function getAvailableRewards(availablePoints: number, currentTier: LoyaltyTier): Reward[] {
    return REWARDS.filter((reward) => {
        // Check if user has enough points
        if (reward.pointsCost > availablePoints) return false

        // Check tier requirement
        if (reward.minTier) {
            const tierOrder: LoyaltyTier[] = ['bronze', 'silver', 'gold', 'platinum']
            const userTierIndex = tierOrder.indexOf(currentTier)
            const requiredTierIndex = tierOrder.indexOf(reward.minTier)
            if (userTierIndex < requiredTierIndex) return false
        }

        return true
    })
}

/**
 * Get reward by ID
 */
export function getRewardById(id: string): Reward | undefined {
    return REWARDS.find((r) => r.id === id)
}
