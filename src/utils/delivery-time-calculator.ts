/**
 * Delivery Time Estimation Calculator
 * Calculates estimated delivery time based on order complexity and distance
 */

export interface DeliveryTimeEstimate {
    prepTime: number // minutes
    deliveryTime: number // minutes
    totalTime: number // minutes
    estimatedDelivery: Date // actual delivery time
    isPeakHour: boolean
}

export interface DeliveryTimeOptions {
    distance?: number // miles (optional, default 5)
    isPeakHour?: boolean // if true, add extra time
    currentTime?: Date // for testing, defaults to now
}

/**
 * Calculate preparation time based on burger complexity
 * Base time: 8 minutes
 * Each ingredient adds: 1.5 minutes
 * More ingredients = more complex preparation
 */
function calculatePrepTime(ingredients: Record<string, number>, isPeakHour: boolean): number {
    const BASE_PREP_TIME = 8 // minutes for base burger
    const TIME_PER_INGREDIENT = 1.5 // minutes per ingredient

    // Count total ingredients
    const totalIngredients = Object.values(ingredients).reduce((sum, count) => sum + count, 0)

    // Calculate base prep time
    let prepTime = BASE_PREP_TIME + totalIngredients * TIME_PER_INGREDIENT

    // Add peak hour delay (20% longer)
    if (isPeakHour) {
        prepTime *= 1.2
    }

    return Math.ceil(prepTime) // Round up to nearest minute
}

/**
 * Calculate delivery time based on distance
 * Average delivery speed: 20 mph in city
 * Minimum delivery time: 10 minutes (for very close locations)
 */
function calculateTravelTime(distance: number, isPeakHour: boolean): number {
    const AVERAGE_SPEED = 20 // mph
    const MIN_DELIVERY_TIME = 10 // minutes

    // Calculate travel time
    let deliveryTime = (distance / AVERAGE_SPEED) * 60 // convert to minutes

    // Ensure minimum delivery time
    deliveryTime = Math.max(deliveryTime, MIN_DELIVERY_TIME)

    // Add peak hour traffic delay (30% longer)
    if (isPeakHour) {
        deliveryTime *= 1.3
    }

    return Math.ceil(deliveryTime)
}

/**
 * Check if current time is during peak hours
 * Peak hours: 11:30 AM - 1:30 PM (lunch) and 5:30 PM - 8:30 PM (dinner)
 */
function isPeakHour(date: Date): boolean {
    const hour = date.getHours()
    const minute = date.getMinutes()
    const timeInMinutes = hour * 60 + minute

    // Lunch: 11:30 AM (690 min) - 1:30 PM (810 min)
    const lunchStart = 11 * 60 + 30
    const lunchEnd = 13 * 60 + 30

    // Dinner: 5:30 PM (1050 min) - 8:30 PM (1230 min)
    const dinnerStart = 17 * 60 + 30
    const dinnerEnd = 20 * 60 + 30

    return (
        (timeInMinutes >= lunchStart && timeInMinutes <= lunchEnd) ||
        (timeInMinutes >= dinnerStart && timeInMinutes <= dinnerEnd)
    )
}

/**
 * Main function to calculate delivery time estimate
 */
export function calculateDeliveryTime(
    ingredients: Record<string, number>,
    options: DeliveryTimeOptions = {}
): DeliveryTimeEstimate {
    const { distance = 5, currentTime = new Date() } = options

    // Determine if it's peak hour
    const peakHour = options.isPeakHour !== undefined ? options.isPeakHour : isPeakHour(currentTime)

    // Calculate prep and delivery times
    const prepTime = calculatePrepTime(ingredients, peakHour)
    const deliveryTime = calculateTravelTime(distance, peakHour)
    const totalTime = prepTime + deliveryTime

    // Calculate estimated delivery time
    const estimatedDelivery = new Date(currentTime.getTime() + totalTime * 60000)

    return {
        prepTime,
        deliveryTime,
        totalTime,
        estimatedDelivery,
        isPeakHour: peakHour
    }
}

/**
 * Format time in minutes to human-readable string
 * Examples: "25 min", "1 hr 15 min"
 */
export function formatDeliveryTime(minutes: number): string {
    if (minutes < 60) {
        return `${minutes} min`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (remainingMinutes === 0) {
        return `${hours} hr`
    }

    return `${hours} hr ${remainingMinutes} min`
}

/**
 * Format estimated delivery time as clock time
 * Example: "2:30 PM"
 */
export function formatDeliveryTimeString(date: Date): string {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })
}

/**
 * Get delivery time range (for displaying "25-35 min")
 * Adds ±5 minutes buffer for realistic estimate
 */
export function getDeliveryTimeRange(totalTime: number): { min: number; max: number } {
    const buffer = 5
    return {
        min: totalTime - buffer,
        max: totalTime + buffer
    }
}
