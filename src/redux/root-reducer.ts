import { combineReducers } from 'redux';

import currentUser from './slices/currentUser';
import { ingredientsReducer } from './slices/ingredients';
import { shippingAddressReducer } from './slices/shipping-address';

const rootReducer = combineReducers({
    ingredients: ingredientsReducer,
    currentUser: currentUser,
    shippingAddress: shippingAddressReducer
});

export default rootReducer;
