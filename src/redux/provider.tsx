'use client'

import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { persistor, store } from './store'

interface ProvidersProps {
    children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
}
