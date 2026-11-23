'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

import { logError } from '@/lib/error-logger'

interface Props {
    children: ReactNode
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            hasError: false,
            error: null
        }
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error
        }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        logError(error, {
            componentStack: errorInfo.componentStack ?? undefined,
            type: 'ErrorBoundary'
        })

        this.props.onError?.(error, errorInfo)
    }

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="flex min-h-[70vh] items-center justify-center bg-white px-4 py-12">
                    <div className="w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white p-8 text-center">
                        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-red-200/80">
                            <AlertTriangle size={22} aria-hidden="true" />
                        </div>
                        <h1 className="text-xl font-semibold tracking-tight text-zinc-950">
                            Oops! Something went wrong
                        </h1>
                        <p className="mt-2 text-sm text-zinc-500">
                            We&apos;re sorry for the inconvenience. An unexpected error occurred.
                        </p>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 text-left">
                                <summary className="cursor-pointer text-xs font-semibold text-zinc-900">
                                    Error Details (Development Only)
                                </summary>
                                <pre className="mt-2 overflow-auto text-xs text-red-600">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors">
                            <RotateCcw size={15} />
                            <span>Reload Page</span>
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    fallback?: ReactNode
): React.FC<P> {
    const WrappedComponent: React.FC<P> = (props) => (
        <ErrorBoundary fallback={fallback}>
            <Component {...props} />
        </ErrorBoundary>
    )

    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`

    return WrappedComponent
}
