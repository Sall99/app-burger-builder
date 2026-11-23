import { calculateDeliveryTime, formatDeliveryTime, getDeliveryTimeRange } from '../delivery-time-calculator'
import { calculateBurgerDietaryInfo, getAllergenList, getDietaryTags } from '../dietary-calculator'

describe('Burger Calculators', () => {
    it('calculates dietary information and nutrition totals accurately', () => {
        const info = calculateBurgerDietaryInfo({
            meat: 2,
            cheese: 1,
            bacon: 1,
            salad: 1
        })

        expect(info.totalNutrition.calories).toBeGreaterThan(400)
        expect(info.totalNutrition.protein).toBeGreaterThan(20)
        expect(info.allergens.gluten).toBe(true)
        expect(info.allergens.dairy).toBe(true)
        expect(getAllergenList(info.allergens)).toContain('gluten')
        expect(getAllergenList(info.allergens)).toContain('dairy')
        expect(info.isVegan).toBe(false)
        expect(info.isVegetarian).toBe(false)
    })

    it('identifies vegetarian burger when meat and bacon are zero', () => {
        const info = calculateBurgerDietaryInfo({
            meat: 0,
            cheese: 1,
            bacon: 0,
            salad: 2
        })

        expect(info.isVegetarian).toBe(true)
        expect(info.isVegan).toBe(false)
        expect(getDietaryTags(info)).toContain('vegetarian')
    })

    it('calculates delivery time estimate and range', () => {
        const estimate = calculateDeliveryTime(
            { meat: 2, cheese: 2, bacon: 1, salad: 1 },
            { distance: 4, isPeakHour: true }
        )

        expect(estimate.prepTime).toBeGreaterThan(0)
        expect(estimate.deliveryTime).toBeGreaterThan(0)
        expect(estimate.totalTime).toBeGreaterThanOrEqual(estimate.prepTime)

        const range = getDeliveryTimeRange(estimate.totalTime)
        expect(range.min).toBeLessThanOrEqual(estimate.totalTime)
        expect(range.max).toBeGreaterThanOrEqual(estimate.totalTime)
        expect(formatDeliveryTime(estimate.totalTime)).toBeDefined()
    })
})
