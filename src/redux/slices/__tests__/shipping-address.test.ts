import { addShippingAddress, shippingAddressReducer } from '../shipping-address'

describe('shippingAddress slice', () => {
    const initialState = {
        shippingAddress: {
            firstName: '',
            lastName: '',
            streetAddress: '',
            town: ''
        }
    }

    it('should return the initial state', () => {
        expect(shippingAddressReducer(undefined, { type: 'unknown' })).toEqual(initialState)
    })

    describe('addShippingAddress', () => {
        it('should add a complete shipping address', () => {
            const shippingData = {
                firstName: 'John',
                lastName: 'Doe',
                streetAddress: '123 Main St',
                town: 'New York'
            }

            const actual = shippingAddressReducer(initialState, addShippingAddress(shippingData))

            expect(actual.shippingAddress).toEqual(shippingData)
        })

        it('should update existing shipping address', () => {
            const existingAddress = {
                shippingAddress: {
                    firstName: 'Jane',
                    lastName: 'Smith',
                    streetAddress: '456 Oak Ave',
                    town: 'Los Angeles'
                }
            }

            const newAddress = {
                firstName: 'John',
                lastName: 'Doe',
                streetAddress: '789 Pine Rd',
                town: 'Chicago'
            }

            const actual = shippingAddressReducer(existingAddress, addShippingAddress(newAddress))

            expect(actual.shippingAddress).toEqual(newAddress)
            expect(actual.shippingAddress.firstName).toBe('John')
            expect(actual.shippingAddress.town).toBe('Chicago')
        })

        it('should handle partial address update', () => {
            const partialAddress = {
                firstName: 'Alice',
                lastName: 'Johnson',
                streetAddress: '321 Elm St',
                town: 'Boston'
            }

            const actual = shippingAddressReducer(initialState, addShippingAddress(partialAddress))

            expect(actual.shippingAddress.firstName).toBe('Alice')
            expect(actual.shippingAddress.lastName).toBe('Johnson')
            expect(actual.shippingAddress.streetAddress).toBe('321 Elm St')
            expect(actual.shippingAddress.town).toBe('Boston')
        })

        it('should handle special characters in address', () => {
            const addressWithSpecialChars = {
                firstName: 'José',
                lastName: 'Ciss',
                streetAddress: 'Apt #5, 123 Main St.',
                town: 'São Paulo'
            }

            const actual = shippingAddressReducer(
                initialState,
                addShippingAddress(addressWithSpecialChars)
            )

            expect(actual.shippingAddress).toEqual(addressWithSpecialChars)
        })

        it('should handle long address strings', () => {
            const longAddress = {
                firstName: 'A'.repeat(50),
                lastName: 'B'.repeat(50),
                streetAddress: 'Very Long Street Address '.repeat(10),
                town: 'TownName'.repeat(10)
            }

            const actual = shippingAddressReducer(initialState, addShippingAddress(longAddress))

            expect(actual.shippingAddress).toEqual(longAddress)
        })
    })

    describe('multiple updates', () => {
        it('should handle multiple consecutive updates', () => {
            let state = initialState

            const address1 = {
                firstName: 'First',
                lastName: 'User',
                streetAddress: 'Address 1',
                town: 'City 1'
            }

            const address2 = {
                firstName: 'Second',
                lastName: 'User',
                streetAddress: 'Address 2',
                town: 'City 2'
            }

            state = shippingAddressReducer(state, addShippingAddress(address1))
            expect(state.shippingAddress).toEqual(address1)

            state = shippingAddressReducer(state, addShippingAddress(address2))
            expect(state.shippingAddress).toEqual(address2)
            expect(state.shippingAddress.firstName).toBe('Second')
        })
    })
})
