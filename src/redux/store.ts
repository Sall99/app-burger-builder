import {
    TypedUseSelectorHook,
    useDispatch as useAppDispatch,
    useSelector as useAppSelector
} from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import createWebStorage from 'redux-persist/es/storage/createWebStorage'

import rootReducer from './root-reducer'

const createNoopStorage = () => {
    return {
        getItem(_key: any) {
            return Promise.resolve(null)
        },
        setItem(_key: any, value: any) {
            return Promise.resolve(value)
        },
        removeItem(_key: any) {
            return Promise.resolve()
        }
    }
}

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage()

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['shippingAddress']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: {
        rootReducer: persistedReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
    devTools: process.env.NODE_ENV !== 'production'
})

export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export const useSelector: TypedUseSelectorHook<RootState> = useAppSelector

export const useDispatch = () => useAppDispatch<AppDispatch>()

export default store
