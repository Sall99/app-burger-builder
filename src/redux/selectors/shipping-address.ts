'use client'
import { RootState } from '../store'

const selectShippingAddress = (state: RootState) => state.rootReducer.shippingAddress

export { selectShippingAddress }
