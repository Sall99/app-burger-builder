import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CouponState {
    code: string
    isValid: boolean
    isValidating: boolean
    discountType: 'percentage' | 'fixed' | null
    discountValue: number
    maxDiscount: number | null
    appliedDiscount: number
    error: string | null
}

const initialState: CouponState = {
    code: '',
    isValid: false,
    isValidating: false,
    discountType: null,
    discountValue: 0,
    maxDiscount: null,
    appliedDiscount: 0,
    error: null
}

const couponSlice = createSlice({
    name: 'coupon',
    initialState,
    reducers: {
        setCouponCode(state, action: PayloadAction<string>) {
            state.code = action.payload.toUpperCase()
            state.error = null
        },
        setValidating(state, action: PayloadAction<boolean>) {
            state.isValidating = action.payload
        },
        setCouponValid(
            state,
            action: PayloadAction<{
                discountType: 'percentage' | 'fixed'
                discountValue: number
                maxDiscount: number | null
            }>
        ) {
            state.isValid = true
            state.isValidating = false
            state.discountType = action.payload.discountType
            state.discountValue = action.payload.discountValue
            state.maxDiscount = action.payload.maxDiscount
            state.error = null
        },
        setCouponInvalid(state, action: PayloadAction<string>) {
            state.isValid = false
            state.isValidating = false
            state.discountType = null
            state.discountValue = 0
            state.maxDiscount = null
            state.appliedDiscount = 0
            state.error = action.payload
        },
        calculateDiscount(state, action: PayloadAction<number>) {
            const subtotal = action.payload

            if (!state.isValid || !state.discountType) {
                state.appliedDiscount = 0
                return
            }

            if (state.discountType === 'fixed') {
                state.appliedDiscount = Math.min(state.discountValue, subtotal)
            } else {
                let discount = (subtotal * state.discountValue) / 100
                if (state.maxDiscount) {
                    discount = Math.min(discount, state.maxDiscount)
                }
                state.appliedDiscount = discount
            }
        },
        clearCoupon(state) {
            return initialState
        }
    }
})

export const couponReducer = couponSlice.reducer
export const {
    setCouponCode,
    setValidating,
    setCouponValid,
    setCouponInvalid,
    calculateDiscount,
    clearCoupon
} = couponSlice.actions
