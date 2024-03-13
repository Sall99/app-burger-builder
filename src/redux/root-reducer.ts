import { combineReducers } from 'redux'
import { ingredientsReducer } from './slices/ingredients'
import currentUser from './slices/currentUser'
import { shippingAddressReducer } from './slices/shipping-address'

const rootReducer = combineReducers({
    ingredients: ingredientsReducer,
    currentUser: currentUser,
    shippingAddress: shippingAddressReducer
})

export default rootReducer
