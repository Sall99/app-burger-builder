import { combineReducers } from 'redux'

import { comboReducer } from './slices/combo'
import { couponReducer } from './slices/coupon'
import { ingredientsReducer } from './slices/ingredients-enhanced'
import { loyaltyReducer } from './slices/loyalty'
import { shippingAddressReducer } from './slices/shipping-address'
import { substitutionsReducer } from './slices/substitutions'

const rootReducer = combineReducers({
    ingredients: ingredientsReducer,
    shippingAddress: shippingAddressReducer,
    coupon: couponReducer,
    substitutions: substitutionsReducer,
    combo: comboReducer,
    loyalty: loyaltyReducer
})

export default rootReducer
