import { combineReducers } from 'redux'
import { ingredientsReducer } from './slices/ingredients'

const rootReducer = combineReducers({
    ingredients: ingredientsReducer
})

export default rootReducer
