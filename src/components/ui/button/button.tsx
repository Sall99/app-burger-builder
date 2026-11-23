'use client'

import { FC } from 'react'
import clsx from 'clsx'

import { Spiner } from '@/components/ui'

export interface ButtonProps {
    label: string
    className?: string
    onClick?: () => void
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
    'aria-label'?: string
    'aria-describedby'?: string
}

export const Button: FC<ButtonProps> = ({
    label,
    className = '',
    onClick,
    type = 'button',
    disabled,
    loading = false,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby
}) => {
    const isDisabled = disabled || loading

    return (
        <button
            type={type}
            className={clsx(
                'inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-45 disabled:cursor-not-allowed',
                className
            )}
            onClick={onClick}
            disabled={isDisabled}
            aria-label={ariaLabel || label}
            aria-describedby={ariaDescribedby}
            aria-busy={loading}
            aria-disabled={isDisabled}>
            <span>{label}</span>
            {loading && (
                <>
                    <Spiner />
                    <span className="sr-only">Loading...</span>
                </>
            )}
        </button>
    )
}
