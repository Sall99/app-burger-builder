import { render, screen } from '@testing-library/react'

import { BurgerIngredients } from '../ingredients'

jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key
}))

describe('BurgerIngredients Component', () => {
    it('should render BreadBottom ingredient', () => {
        render(<BurgerIngredients type="BreadBottom" />)
        const element = screen.getByLabelText('BreadBottom')
        expect(element).toBeInTheDocument()
        expect(element).toHaveClass('BreadBottom')
    })

    it('should render BreadTop ingredient with seeds', () => {
        render(<BurgerIngredients type="BreadTop" />)
        const element = screen.getByLabelText('BreadTop')
        expect(element).toBeInTheDocument()
        expect(element).toHaveClass('BreadTop')

        const seeds1 = element.querySelector('.Seeds1')
        const seeds2 = element.querySelector('.Seeds2')
        expect(seeds1).toBeInTheDocument()
        expect(seeds2).toBeInTheDocument()
    })

    it('should render Meat ingredient', () => {
        render(<BurgerIngredients type="meat" />)
        const element = screen.getByLabelText('Meat')
        expect(element).toBeInTheDocument()
        expect(element).toHaveClass('Meat')
    })

    it('should render Cheese ingredient', () => {
        render(<BurgerIngredients type="cheese" />)
        const element = screen.getByLabelText('Cheese')
        expect(element).toBeInTheDocument()
        expect(element).toHaveClass('Cheese')
    })

    it('should render Salad ingredient', () => {
        render(<BurgerIngredients type="salad" />)
        const element = screen.getByLabelText('Salad')
        expect(element).toBeInTheDocument()
        expect(element).toHaveClass('Salad')
    })

    it('should render Bacon ingredient', () => {
        render(<BurgerIngredients type="bacon" />)
        const element = screen.getByLabelText('Bacon')
        expect(element).toBeInTheDocument()
        expect(element).toHaveClass('Bacon')
    })

    it('should return null for unknown ingredient type', () => {
        const { container } = render(<BurgerIngredients type="unknown" />)
        expect(container.firstChild).toBeNull()
    })

    it('should handle empty type', () => {
        const { container } = render(<BurgerIngredients type="" />)
        expect(container.firstChild).toBeNull()
    })
})
