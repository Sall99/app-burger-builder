import { combineReducers } from 'redux'

import { couponReducer } from './slices/coupon'
import { ingredientsReducer } from './slices/ingredients-enhanced'
import { shippingAddressReducer } from './slices/shipping-address'
import { substitutionsReducer } from './slices/substitutions'

const rootReducer = combineReducers({
    ingredients: ingredientsReducer,
    shippingAddress: shippingAddressReducer,
    coupon: couponReducer,
    substitutions: substitutionsReducer
})

export default rootReducer
