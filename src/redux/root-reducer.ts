import { combineReducers } from 'redux'

import { couponReducer } from './slices/coupon'
import { ingredientsReducer } from './slices/ingredients-enhanced'
import { shippingAddressReducer } from './slices/shipping-address'

const rootReducer = combineReducers({
    ingredients: ingredientsReducer,
    shippingAddress: shippingAddressReducer,
    coupon: couponReducer
})

export default rootReducer
