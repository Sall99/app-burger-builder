'use client';
import React from 'react';

interface ProvidersProps {
    children: React.ReactNode
}

import { Provider } from 'react-redux';

import store from './store';

export default function Providers({ children }: ProvidersProps) {
    return <Provider store={store}>{children}</Provider>;
}
