import { combineReducers } from 'redux'

import { ingredientsReducer } from './slices/ingredients'
import { shippingAddressReducer } from './slices/shipping-address'

const rootReducer = combineReducers({
    ingredients: ingredientsReducer,
    shippingAddress: shippingAddressReducer
})

export default rootReducer
