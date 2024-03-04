import { combineReducers } from 'redux'
import { ingredientsReducer } from './slices/ingredients'
import currentUser from './slices/currentUser'

const rootReducer = combineReducers({
    ingredients: ingredientsReducer,
    currentUser: currentUser
})

export default rootReducer
