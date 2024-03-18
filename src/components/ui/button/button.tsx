'use client'
import { FC } from 'react'
import clsx from 'clsx'

export interface ButtonProps {
    label: string
    className?: string
    onClick?: () => void
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
}

export const Button: FC<ButtonProps> = ({
    label,
    className = '',
    onClick,
    type,
    disabled,
    loading = false
}) => {
    return (
        <button
            type={type}
            className={clsx(
                'border-0 flex gap-4 items-center justify-center text-white bg-primary-200 hover:bg-primary-600 rounded-xs text-xs focus:outline-none hover:cursor-pointer',
                className
            )}
            onClick={onClick}
            disabled={disabled}>
            <span>{label}</span>
            {loading && (
                <div className="border-white h-6 w-6 animate-spin rounded-full border-2 border-t-primary-100" />
            )}
        </button>
    )
}
