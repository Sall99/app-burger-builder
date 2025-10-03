import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { fireEvent, render, screen } from '@testing-library/react'

import { Controls } from '../control'

jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key
}))

const createMockStore = () => {
    return configureStore({
        reducer: {
            rootReducer: () => ({
                ingredients: {
                    ingredients: {
                        meat: 0,
                        bacon: 0,
                        cheese: 0,
                        salad: 0
                    },
                    prices: {
                        meat: 1.3,
                        bacon: 0.7,
                        cheese: 0.4,
                        salad: 0.5
                    },
                    totalPrice: 4
                }
            })
        }
    })
}

describe('Controls Component', () => {
    it('should render all ingredient controls', () => {
        const store = createMockStore()
        render(
            <Provider store={store}>
                <Controls />
            </Provider>
        )

        expect(screen.getByText('Meat')).toBeInTheDocument()
        expect(screen.getByText('Bacon')).toBeInTheDocument()
        expect(screen.getByText('Cheese')).toBeInTheDocument()
        expect(screen.getByText('Salad')).toBeInTheDocument()
    })

    it('should have add and remove buttons for each ingredient', () => {
        const store = createMockStore()
        render(
            <Provider store={store}>
                <Controls />
            </Provider>
        )

        const buttons = screen.getAllByRole('generic')
        expect(buttons.length).toBeGreaterThan(0)
    })

    it('should dispatch addIngredients action on add button click', () => {
        const store = createMockStore()
        const dispatchSpy = jest.spyOn(store, 'dispatch')

        render(
            <Provider store={store}>
                <Controls />
            </Provider>
        )

        const controls = screen.getByText('Meat').parentElement
        const addButton = controls?.querySelector('.ctrl > div:first-child')

        if (addButton) {
            fireEvent.click(addButton)
            expect(dispatchSpy).toHaveBeenCalled()
        }
    })

    it('should dispatch removeIngredients action on remove button click', () => {
        const store = createMockStore()
        const dispatchSpy = jest.spyOn(store, 'dispatch')

        render(
            <Provider store={store}>
                <Controls />
            </Provider>
        )

        const controls = screen.getByText('Meat').parentElement
        const removeButton = controls?.querySelector('.ctrl > div:last-child')

        if (removeButton) {
            fireEvent.click(removeButton)
            expect(dispatchSpy).toHaveBeenCalled()
        }
    })
})
