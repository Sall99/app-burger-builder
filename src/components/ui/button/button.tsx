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
                'border-0 flex gap-4 items-center justify-center text-white bg-primary-200 hover:bg-primary-600 rounded-xs text-xs focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
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
