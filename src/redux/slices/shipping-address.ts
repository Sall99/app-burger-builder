import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    shippingAddress: {
        firstName: '',
        lastName: '',
        streetAddress: '',
        town: ''
    }
}

const shippingAddressSlice = createSlice({
    name: 'shippingAddress',
    initialState,
    reducers: {
        addShippingAddress(state, action) {
            const { firstName, lastName, streetAddress, town } = action.payload
            state.shippingAddress = { firstName, lastName, streetAddress, town }

            state.shippingAddress = action.payload
        }
    }
})

export const { addShippingAddress } = shippingAddressSlice.actions
export const shippingAddressReducer = shippingAddressSlice.reducer
