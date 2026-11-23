'use client'
import { FC } from 'react'
import clsx from 'clsx'

export interface InputProps {
    classname?: string
    name: string
    type: 'text' | 'password' | 'email' | 'number' | 'date'
    placeholder: string
    value?: string
    defaultValue?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean
    register?: any
    required?: boolean
    errors?: any
    autoFocus?: boolean
    autoComplete?: string
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    step?: number
    pattern?: string
    id?: string
}

export const Input: FC<InputProps> = ({
    classname,
    type,
    placeholder,
    required,
    name,
    register,
    errors,
    autoComplete,
    value,
    defaultValue,
    onChange,
    disabled,
    autoFocus,
    minLength,
    maxLength,
    min,
    max,
    step,
    pattern,
    id
}) => {
    const hasError = errors && errors[name]
    const errorMessage = hasError ? errors[name].message : ''
    const fieldId = id || name

    const inputClass = clsx(
        'block w-full rounded-xl border px-3.5 py-2.5 text-sm text-zinc-950 placeholder:text-zinc-400 transition-all focus:outline-none focus:ring-2',
        {
            'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-500/15': hasError,
            'border-zinc-200 bg-white hover:border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950/10':
                !hasError && !disabled,
            'border-zinc-200 bg-zinc-50 text-zinc-400 cursor-not-allowed': disabled
        },
        classname
    )

    return (
        <div className="mb-4 w-full">
            <label
                htmlFor={fieldId}
                className="mb-1.5 block text-xs font-medium text-zinc-600">
                {placeholder}
                {required && <span className="ml-0.5 text-orange-500">*</span>}
            </label>
            <input
                id={fieldId}
                type={type}
                {...(register ? register(name) : { onChange })}
                className={inputClass}
                placeholder={placeholder}
                autoComplete={autoComplete}
                value={value}
                defaultValue={defaultValue}
                required={required}
                disabled={disabled}
                autoFocus={autoFocus}
                minLength={minLength}
                maxLength={maxLength}
                min={min}
                max={max}
                step={step}
                pattern={pattern}
                aria-invalid={hasError ? 'true' : 'false'}
                aria-describedby={hasError ? `${name}-error` : undefined}
            />
            {hasError && (
                <p id={`${name}-error`} className="mt-1.5 text-xs font-medium text-red-600">
                    {errorMessage}
                </p>
            )}
        </div>
    )
}
